chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "DEAL_FOUND") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "VintedFlip Deal Alert!",
      message: `${msg.title} — €${msg.price} (flip for ~€${msg.sellPrice}, profit ~€${msg.profit})`,
      priority: 2,
    });
  }
});
