import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Vault.scss";
import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
import { useDarkMode } from "@rbnd/react-dark-mode";
import { IoCopyOutline } from "react-icons/io5";
Modal.setAppElement("#root");
const Vault = () => {
    const [folderList, setFolderList] = useState([]);
    const [folderName, setFolderName] = useState("default");
    const [snippetsByFolder, setSnippetsByFolder] = useState([]);
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [snippetText, setSnippetText] = useState("");
    const [snippetTitle, setSnippetTitle] = useState("");
    const { isModalOpen, openModal: modalOpen, closeModal: modalClose, } = useModal();
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
    const openModal = (snippet) => {
        modalOpen();
        setSelectedSnippet(snippet);
    };
    const closeModal = () => {
        modalClose();
        setIsEditMode(false);
    };
    const handleEditClick = (title, text) => {
        setIsEditMode(true);
        setSnippetText(text);
        setSnippetTitle(title);
    };
    const handleOnChangeTitle = (event) => {
        setSnippetTitle(event.target.value);
    };
    const handleOnChangeText = (event) => {
        setSnippetText(event.target.value);
    };
    const handleCloseEditMode = () => {
        setIsEditMode(false);
    };
    const handleDeleteSnippet = (id) => {
        if (!window.confirm(chrome.i18n.getMessage("VaultSnippetDeleteConfirm"))) {
            return;
        }
        chrome.storage.local.get([folderName], (result) => {
            const folder = result[folderName] ?? [];
            const updatedFolder = folder.filter((s) => s.id !== id);
            chrome.storage.local.set({ [folderName]: updatedFolder }, () => {
                setSnippetsByFolder(updatedFolder);
                closeModal();
            });
        });
    };
    const handleCopyText = (e, text) => {
        e.stopPropagation();
        navigator.clipboard
            .writeText(text)
            .catch((e) => console.error("Failed to copy text:", e));
    };
    useEffect(() => {
        chrome.storage.local.get("folder", (result) => {
            setFolderList(result.folder ?? []);
        });
    }, []);
    useEffect(() => {
        chrome.storage.local.get([folderName], (result) => {
            setSnippetsByFolder(result[folderName] ?? []);
        });
    }, [folderName]);
    return (_jsxs("div", { className: "vault-wrapper", children: [_jsxs("div", { className: "vault-content-wrapper", children: [_jsxs("div", { className: "select-wrapper", children: [_jsxs("select", { className: "vault-select", value: folderName, onChange: (e) => setFolderName(e.target.value), children: [_jsx("option", { value: "default", children: chrome.i18n.getMessage("SelectOptionDefault") }), folderList.map((folder) => {
                                        return (_jsx("option", { value: folder.name, children: folder.name }, folder.id));
                                    })] }), _jsx(IoIosArrowDown, { className: "select-arrow" })] }), _jsx("div", { className: "snippet-list-wrapper", children: snippetsByFolder.map((snippet) => (_jsxs("button", { className: "snippet-item", onClick: () => openModal(snippet), children: [snippet.title, _jsx("button", { type: "button", className: "snippet-item-copy-button", onClick: (e) => handleCopyText(e, snippet.text), tabIndex: 0, "aria-label": "\uBCF5\uC0AC", children: _jsx(IoCopyOutline, {}) })] }, snippet.id))) })] }), _jsx(Modal, { isOpen: isModalOpen, onRequestClose: closeModal, style: customStyles, children: _jsxs("div", { className: "modal-vault-wrapper", children: [_jsx("div", { className: "back-button-wrapper", children: _jsx(IoIosArrowBack, { className: "back-button", onClick: closeModal }) }), isEditMode ? (_jsxs("div", { className: "modal-edit-content-wrapper", children: [_jsx("input", { className: "modal-edit-input", type: "text", value: snippetTitle, onChange: handleOnChangeTitle }), _jsx("textarea", { className: "modal-edit-textarea", value: snippetText, onChange: handleOnChangeText }), _jsxs("div", { className: "modal-button-edit-wrapper", children: [_jsx("button", { className: "modal-edit-button", children: chrome.i18n.getMessage("HomeSaveButton") }), _jsx("button", { className: "modal-edit-button", onClick: handleCloseEditMode, children: chrome.i18n.getMessage("Cancel") })] })] })) : (_jsxs("div", { className: "modal-edit-content-wrapper", children: [_jsx("div", { className: "modal-snippet-title", children: selectedSnippet?.title }), _jsx("div", { className: "modal-snippet-text", children: selectedSnippet?.text }), _jsxs("div", { className: "modal-button-edit-wrapper", children: [_jsx("button", { className: "modal-snippet-button-delete", onClick: () => handleDeleteSnippet(selectedSnippet?.id ?? ""), children: chrome.i18n.getMessage("Delete") }), _jsx("button", { className: "modal-snippet-button-edit", onClick: () => handleEditClick(selectedSnippet?.title ?? "", selectedSnippet?.text ?? ""), children: chrome.i18n.getMessage("Modify") })] })] }))] }) })] }));
};
export default Vault;
