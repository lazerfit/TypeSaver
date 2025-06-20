chrome.runtime.onInstalled.addListener(() => {
    createContextMenus();
});
chrome.storage.onChanged.addListener(() => {
    createContextMenus();
});
function createContextMenus() {
    chrome.contextMenus.removeAll(() => {
        // 최상위 TypeSaver 메뉴 생성
        chrome.contextMenus.create({
            id: "typesaver",
            title: "TypeSaver",
            contexts: ["editable"],
        });
        // 폴더 목록 가져오기
        chrome.storage.local.get(null, (result) => {
            // 폴더 정보
            const folders = result.folder ?? [];
            // default 폴더가 folder key에 없으면, 모든 key에서 default 폴더를 찾아 추가
            if (!folders.some((f) => f.name === "default")) {
                Object.keys(result).forEach((key) => {
                    if (Array.isArray(result[key])) {
                        const snippets = result[key];
                        if (snippets.length && snippets[0].folder === "default") {
                            folders.push({ id: "default", name: "default" });
                        }
                    }
                });
            }
            folders.forEach((folder) => {
                // TypeSaver 하위에 폴더 메뉴 생성
                chrome.contextMenus.create({
                    id: `folder-${folder.id}`,
                    parentId: "typesaver",
                    title: folder.name,
                    contexts: ["editable"],
                });
                // 폴더별 스니펫 가져오기
                chrome.storage.local.get([folder.name], (res) => {
                    const snippets = res[folder.name] ?? [];
                    snippets.forEach((snippet) => {
                        chrome.contextMenus.create({
                            id: `snippet-${snippet.id}`,
                            parentId: `folder-${folder.id}`,
                            title: snippet.title,
                            contexts: ["editable"],
                        });
                    });
                });
            });
        });
    });
}
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const menuItemId = String(info.menuItemId);
    if (menuItemId.startsWith("snippet-")) {
        const snippetId = menuItemId.replace("snippet-", "");
        chrome.storage.local.get(null, (result) => {
            let found = null;
            Object.values(result).forEach((snippets) => {
                if (Array.isArray(snippets)) {
                    snippets.forEach((s) => {
                        if (s.id === snippetId)
                            found = s;
                    });
                }
            });
            if (found && tab?.id) {
                void chrome.tabs.sendMessage(tab.id, {
                    type: "PASTE_SNIPPET",
                    text: found.text,
                });
            }
        });
    }
});
export {};
