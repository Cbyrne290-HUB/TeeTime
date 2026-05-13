// VintedFlip content script — highlights deals while you browse Vinted

let watchlist = [];
const notified = new Set();

function loadWatchlist(cb) {
  chrome.storage.local.get("watchlist", (data) => {
    watchlist = data.watchlist || [];
    cb();
  });
}

// Extract numeric price from any text containing a price
function parsePrice(text) {
  const clean = text.replace(/\s/g, "");
  const match = clean.match(/[\d]+[.,]?\d*/);
  if (!match) return null;
  return parseFloat(match[0].replace(",", "."));
}

// Find all Vinted item cards on the page
function findCards() {
  // Vinted item links always contain /items/ in the href
  const links = Array.from(document.querySelectorAll('a[href*="/items/"]'));
  const cards = new Map();

  for (const link of links) {
    const href = link.getAttribute("href");
    if (!href || cards.has(href)) continue;

    // Walk up to find the card container
    let card = link;
    for (let i = 0; i < 5; i++) {
      const p = card.parentElement;
      if (!p) break;
      const tag = p.tagName.toLowerCase();
      if (["li", "article", "section"].includes(tag)) { card = p; break; }
      if (p.children.length <= 3) { card = p; }
    }

    cards.set(href, { link, card });
  }

  return Array.from(cards.values());
}

function getTitle(card) {
  // Try common selectors Vinted uses
  const selectors = [
    '[data-testid*="title"]',
    '[data-testid*="name"]',
    '[class*="title"]',
    '[class*="name"]',
    'h2', 'h3', 'p',
  ];
  for (const sel of selectors) {
    const el = card.card.querySelector(sel);
    if (el) {
      const t = el.textContent.trim();
      if (t.length > 2 && t.length < 200) return t.toLowerCase();
    }
  }
  return card.card.textContent.trim().toLowerCase().substring(0, 100);
}

function getPrice(card) {
  // Price elements on Vinted usually contain currency symbols
  const selectors = [
    '[data-testid*="price"]',
    '[class*="price"]',
    '[class*="Price"]',
  ];
  for (const sel of selectors) {
    const el = card.card.querySelector(sel);
    if (el) {
      const p = parsePrice(el.textContent);
      if (p && p > 0) return p;
    }
  }
  // Fallback: find any text node with a price-like pattern
  const all = card.card.querySelectorAll("*");
  for (const el of all) {
    if (el.children.length > 0) continue;
    const text = el.textContent.trim();
    if (/^[€£$]?\s*\d+([.,]\d+)?\s*[€£$]?$/.test(text)) {
      const p = parsePrice(text);
      if (p && p > 0) return p;
    }
  }
  return null;
}

function matchesWatchlist(title, price) {
  for (const item of watchlist) {
    if (!item.keywords || !item.maxPrice) continue;
    const keywords = item.keywords.toLowerCase().split(/\s+/);
    const allMatch = keywords.every((kw) => title.includes(kw));
    if (allMatch && price <= item.maxPrice) {
      return item;
    }
  }
  return null;
}

function injectBadge(card, item, price) {
  // Don't add twice
  if (card.card.querySelector(".vf-badge")) return;

  const profit = item.sellPrice - price;
  const roi = ((profit / price) * 100).toFixed(0);

  const badge = document.createElement("div");
  badge.className = "vf-badge";
  badge.innerHTML = `
    <span class="vf-deal">🔥 DEAL</span>
    <span class="vf-profit">+€${profit.toFixed(2)} profit</span>
    <span class="vf-roi">${roi}% ROI</span>
    <span class="vf-sell">Sell ~€${item.sellPrice}</span>
  `;

  card.card.style.position = "relative";
  card.card.appendChild(badge);
  card.card.classList.add("vf-highlight");
}

function processCards() {
  if (!watchlist.length) return;
  const cards = findCards();

  for (const card of cards) {
    const title = getTitle(card);
    const price = getPrice(card);
    if (!price) continue;

    const match = matchesWatchlist(title, price);
    if (!match) continue;

    injectBadge(card, match, price);

    // Notify once per item URL
    const href = card.link.getAttribute("href");
    if (!notified.has(href)) {
      notified.add(href);
      const profit = (match.sellPrice - price).toFixed(2);
      // Update deal count in storage
      chrome.storage.local.get("dealCount", (data) => {
        chrome.storage.local.set({ dealCount: (data.dealCount || 0) + 1 });
      });
      chrome.runtime.sendMessage({
        type: "DEAL_FOUND",
        title: match.keywords,
        price: price.toFixed(2),
        sellPrice: match.sellPrice,
        profit,
      });
    }
  }
}

// Run on load and watch for new content (infinite scroll, navigation)
loadWatchlist(() => {
  processCards();

  const observer = new MutationObserver(() => {
    clearTimeout(observer._timer);
    observer._timer = setTimeout(processCards, 500);
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

// Re-run when watchlist changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.watchlist) {
    watchlist = changes.watchlist.newValue || [];
    processCards();
  }
});
