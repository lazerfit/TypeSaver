console.log("content script loaded");
chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
    if (msg.type === "PASTE_SNIPPET") {
        const active = document.activeElement;
        if (active &&
            (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
            active.value = msg.text ?? "";
            active.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
});
export {};
