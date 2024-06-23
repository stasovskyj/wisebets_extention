chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "ui/options.html"
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
  switch (request.action) {
    case "notification":
      chrome.notifications.create({
        type: "basic",
        title: "Arbitrage ToolBox",
        message: request.message,
        iconUrl: "../images/icon.png"
      })
      break;
  }
  console.log(request);
  sendResponse({ response: sender });
})
// відправка команд в content_scripts
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: command });
});
