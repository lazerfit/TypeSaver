console.log("content script loaded");
chrome.runtime.onMessage.addListener(
  (msg: { type?: string; text?: string }, _sender, _sendResponse) => {
    if (msg.type === "PASTE_SNIPPET") {
      const active = document.activeElement as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (
        active &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
      ) {
        active.value = msg.text ?? "";
        active.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  },
);
