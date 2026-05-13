function loadWatchlist(cb) {
  chrome.storage.local.get(["watchlist", "dealCount"], (data) => {
    cb(data.watchlist || [], data.dealCount || 0);
  });
}

function saveWatchlist(list) {
  chrome.storage.local.set({ watchlist: list });
}

function render(list, dealCount) {
  document.getElementById("dealCount").textContent =
    dealCount === 1 ? "1 deal found" : `${dealCount} deals found`;

  const container = document.getElementById("watchlistItems");
  if (!list.length) {
    container.innerHTML = '<p class="empty">No deals added yet.</p>';
    return;
  }

  container.innerHTML = list
    .map((item, i) => {
      const profit = item.sellPrice - item.maxPrice;
      const roi = ((profit / item.maxPrice) * 100).toFixed(0);
      return `
      <div class="watchlist-item">
        <div class="wi-info">
          <div class="wi-keywords">${item.keywords}</div>
          <div class="wi-meta">Max €${item.maxPrice} · Sell ~€${item.sellPrice}</div>
        </div>
        <span class="wi-profit">+€${profit.toFixed(2)} (${roi}%)</span>
        <button class="btn-remove" data-index="${i}" title="Remove">×</button>
      </div>`;
    })
    .join("");

  container.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      list.splice(idx, 1);
      saveWatchlist(list);
      render(list, dealCount);
    });
  });
}

document.getElementById("addBtn").addEventListener("click", () => {
  const keywords = document.getElementById("keywords").value.trim();
  const maxPrice = parseFloat(document.getElementById("maxPrice").value);
  const sellPrice = parseFloat(document.getElementById("sellPrice").value);

  if (!keywords) { alert("Enter search keywords."); return; }
  if (!maxPrice || maxPrice <= 0) { alert("Enter a valid max buy price."); return; }
  if (!sellPrice || sellPrice <= maxPrice) { alert("Sell price must be higher than buy price."); return; }

  loadWatchlist((list, dealCount) => {
    list.push({ keywords, maxPrice, sellPrice });
    saveWatchlist(list);
    document.getElementById("keywords").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("sellPrice").value = "";
    render(list, dealCount);
  });
});

// Initial render
loadWatchlist(render);

// Listen for deal count updates
chrome.storage.onChanged.addListener((changes) => {
  if (changes.dealCount || changes.watchlist) {
    loadWatchlist(render);
  }
});
