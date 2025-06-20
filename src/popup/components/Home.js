import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import "./Home.scss";
import * as React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { v4 } from "uuid";
import Toast from "../../common/Toast";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
Modal.setAppElement("#root");
const Home = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("default");
    const [folders, setFolders] = useState([]);
    const [toastText, setToastText] = useState("");
    const [showToast, setShowToast] = useState(false);
    const { isModalOpen, openModal, closeModal } = useModal();
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "220px",
            height: "120px",
            backgroundColor: "#F8F7F4",
            borderRadius: "10px",
        },
    };
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleTextChange = (event) => {
        setText(event.target.value);
    };
    const handleFolderChange = (event) => {
        setSelectedFolder(event.target.value);
    };
    const handleSubmit = () => {
        if (!title || !text) {
            openModal();
            return;
        }
        chrome.storage.local.get([selectedFolder], (result) => {
            const prevSnippets = result[selectedFolder] ?? [];
            const uuid = v4();
            const newSnippets = [
                ...prevSnippets,
                { id: uuid, folder: selectedFolder, title, text },
            ];
            chrome.storage.local
                .set({ [selectedFolder]: newSnippets })
                .then(() => {
                setTitle("");
                setText("");
                setSelectedFolder("");
                setToastText("저장되었습니다.");
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 100);
            })
                .catch((e) => console.log(e));
        });
    };
    useEffect(() => {
        chrome.storage.local.get(["folder"], (result) => {
            const storedFolders = result.folder ?? [];
            setFolders(storedFolders);
        });
    });
    return (_jsxs("div", { className: "home-wrapper", children: [_jsxs("div", { className: "content-wrapper", children: [_jsxs("div", { className: "select-wrapper", children: [_jsxs("select", { className: "folder-select", name: "\uD3F4\uB354", value: selectedFolder, onChange: handleFolderChange, children: [_jsx("option", { value: "default", children: "\uD3F4\uB354 \uC5C6\uC74C" }), folders.map((folder) => {
                                        return (_jsx("option", { value: folder.name, children: folder.name }, folder.id));
                                    })] }), _jsx(IoIosArrowDown, { className: "select-arrow" })] }), _jsx("input", { className: "title-input", type: "text", placeholder: "\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694..", value: title, onChange: handleTitleChange }), _jsx("textarea", { className: "text-input", placeholder: "\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694..", value: text, onChange: handleTextChange }), _jsx("button", { className: "save-button", onClick: handleSubmit, children: _jsx("span", { children: "\uC800\uC7A5" }) })] }), _jsx(Toast, { text: toastText, showToast: showToast }), _jsx(Modal, { isOpen: isModalOpen, onRequestClose: closeModal, style: customStyles, children: _jsx("div", { className: "modal-home-wrapper", children: _jsxs("div", { className: "modal-home-content-wrapper", children: [_jsx("h2", { children: "\uC81C\uBAA9\uACFC \uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." }), _jsx("button", { className: "modal-close-button", onClick: closeModal, children: "\uB2EB\uAE30" })] }) }) })] }));
};
export default Home;
