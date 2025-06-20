import "./Vault.scss";
import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
import type { Folder } from "./Folder";
import { useDarkMode } from "@rbnd/react-dark-mode";

Modal.setAppElement("#root");

interface Snippet {
  id: string;
  title: string;
  text: string;
}

const Vault = () => {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState("default");
  const [snippetsByFolder, setSnippetsByFolder] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<{
    id: string;
    title: string;
    text: string;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snippetText, setSnippetText] = useState("");
  const [snippetTitle, setSnippetTitle] = useState("");
  const {
    isModalOpen,
    openModal: modalOpen,
    closeModal: modalClose,
  } = useModal();
  const { mode } = useDarkMode();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "300px",
      height: "390px",
      backgroundColor: mode === "dark" ? "#262626" : "#F8F7F4",
    },
  };

  const openModal = (snippet: Snippet) => {
    modalOpen();
    setSelectedSnippet(snippet);
  };

  const closeModal = () => {
    modalClose();
    setIsEditMode(false);
  };

  const handleEditClick = (title: string, text: string) => {
    setIsEditMode(true);
    setSnippetText(text);
    setSnippetTitle(title);
  };

  const handleOnChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSnippetTitle(event.target.value);
  };

  const handleOnChangeText = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setSnippetText(event.target.value);
  };

  const handleCloseEditMode = () => {
    setIsEditMode(false);
  };

  const handleDeleteSnippet = (id: string) => {
    if (!window.confirm("정말로 이 스니펫을 삭제하시겠습니까?")) {
      return;
    }
    chrome.storage.local.get([folderName], (result) => {
      const folder: Snippet[] = (result[folderName] as Snippet[]) ?? [];
      const updatedFolder = folder.filter((s) => s.id !== id);
      chrome.storage.local.set({ [folderName]: updatedFolder }, () => {
        setSnippetsByFolder(updatedFolder);
        closeModal();
      });
    });
  };

  useEffect(() => {
    chrome.storage.local.get("folder", (result) => {
      setFolderList((result.folder as Folder[]) ?? []);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get([folderName], (result) => {
      setSnippetsByFolder((result[folderName] as Snippet[]) ?? []);
    });
  }, [folderName]);

  return (
    <div className="vault-wrapper">
      <div className="vault-content-wrapper">
        <div className="select-wrapper">
          <select
            className="vault-select"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          >
            <option value="default">폴더 없음</option>
            {folderList.map((folder: Folder) => {
              return (
                <option key={folder.id} value={folder.name}>
                  {folder.name}
                </option>
              );
            })}
          </select>
          <IoIosArrowDown className="select-arrow" />
        </div>
        <div className="snippet-list-wrapper">
          {snippetsByFolder.map((snippet) => (
            <button
              key={snippet.id}
              className="snippet-item"
              onClick={() => openModal(snippet)}
            >
              {snippet.title}
            </button>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="modal-vault-wrapper">
          <div className="back-button-wrapper">
            <IoIosArrowBack className="back-button" onClick={closeModal} />
          </div>
          {isEditMode ? (
            <div className="modal-edit-content-wrapper">
              <input
                className="modal-edit-input"
                type="text"
                value={snippetTitle}
                onChange={handleOnChangeTitle}
              />
              <textarea
                className="modal-edit-textarea"
                value={snippetText}
                onChange={handleOnChangeText}
              />
              <div className="modal-button-edit-wrapper">
                <button className="modal-edit-button">저장</button>
                <button
                  className="modal-edit-button"
                  onClick={handleCloseEditMode}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="modal-edit-content-wrapper">
              <div className="modal-snippet-title">
                {selectedSnippet?.title}
              </div>
              <div className="modal-snippet-text">{selectedSnippet?.text}</div>
              <div className="modal-button-edit-wrapper">
                <button
                  className="modal-snippet-button-delete"
                  onClick={() => handleDeleteSnippet(selectedSnippet?.id ?? "")}
                >
                  삭제
                </button>
                <button
                  className="modal-snippet-button-edit"
                  onClick={() =>
                    handleEditClick(
                      selectedSnippet?.title ?? "",
                      selectedSnippet?.text ?? "",
                    )
                  }
                >
                  편집
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Vault;
