console.log("content script loaded");
chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
    if (msg.type === "PASTE_SNIPPET") {
        const activeElement = document.activeElement; // 현재 활성화된 요소 가져오기
        if (activeElement) {
            // 1. 일반 INPUT 또는 TEXTAREA 태그인 경우 (기존 로직 유지)
            if (activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA") {
                const inputOrTextArea = activeElement;
                inputOrTextArea.value = msg.text ?? "";
                inputOrTextArea.dispatchEvent(new Event("input", { bubbles: true }));
            }
            // 2. contenteditable 요소인 경우 (Gmail의 메일 본문 div 포함)
            else if (activeElement.isContentEditable) {
                console.log("Contenteditable element detected:", activeElement); // 디버깅용
                const textToInsert = msg.text ?? "";
                // 텍스트를 현재 커서 위치에 삽입하는 로직 (가장 일반적인 WYSIWYG 에디터 동작 방식)
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0); // 현재 선택 범위 가져오기
                    range.deleteContents(); // 선택된 내용이 있다면 삭제 (덮어쓰기 효과)
                    // 삽입할 텍스트 노드 생성
                    const textNode = document.createTextNode(textToInsert);
                    range.insertNode(textNode); // 텍스트 노드를 범위에 삽입
                    // 삽입된 텍스트 뒤로 커서 이동
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    selection.removeAllRanges(); // 기존 선택 해제
                    selection.addRange(range); // 새 범위로 선택 설정 (커서 위치 업데이트)
                }
                else {
                    // 커서가 특정 위치에 없을 경우 (예: div에 포커스만 있고 입력 전)
                    // 요소의 끝에 텍스트를 추가하거나, 전체 내용을 덮어쓸 수 있습니다.
                    // Gmail의 경우, 보통 포커스 시 자동으로 커서가 생기지만, 혹시 모를 상황 대비.
                    // 여기서는 textContent에 추가하는 것으로 예시를 들지만,
                    // Gmail과 같은 복잡한 에디터는 이 방식이 예상대로 동작하지 않을 수 있습니다.
                    // 대신, range를 가져오지 못하면 그냥 무시하는 것이 더 나을 수도 있습니다.
                    // activeElement.textContent += textToInsert; // 기존 내용 뒤에 추가
                    // activeElement.innerHTML = textToInsert; // 모든 내용 덮어쓰기 (주의 필요)
                    // 또는 단순히 디버깅 메시지만 출력하고, 실제 Gmail에서는 이 else 블록은 거의 실행되지 않도록
                    // range 방식에 의존하는 것이 더 좋습니다.
                    console.warn("No selection range found in contenteditable element. Text might not be inserted at cursor.");
                    // fallback: 간단하게 텍스트 추가 (주의: Gmail에서는 내부적으로 다르게 처리할 수 있음)
                    if (activeElement.textContent !== null) {
                        activeElement.textContent += textToInsert;
                    }
                }
                // Gmail과 같은 복잡한 에디터는 자체적인 이벤트 리스너를 통해 변경을 감지합니다.
                // DOM 변경 후 'input' 이벤트를 디스패치하여 해당 에디터가 변경을 인식하도록 돕습니다.
                // 'input' 이벤트는 contenteditable 요소에서도 잘 동작합니다.
                activeElement.dispatchEvent(new Event("input", { bubbles: true }));
                // 필요에 따라 'change' 이벤트도 고려해볼 수 있으나, 'input'이 더 즉각적인 반응을 유도합니다.
                // activeElement.dispatchEvent(new Event("change", { bubbles: true }));
                // 추가적으로, 포커스를 유지하거나 다시 설정해야 할 수도 있습니다.
                activeElement.focus();
            }
        }
        // const active = document.activeElement as
        //   | HTMLInputElement
        //   | HTMLTextAreaElement
        //   | null;
        // if (
        //   active &&
        //   (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
        // ) {
        //   active.value = msg.text ?? "";
        //   active.dispatchEvent(new Event("input", { bubbles: true }));
        // }
    }
});
export {};
