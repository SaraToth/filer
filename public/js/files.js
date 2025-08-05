const kebabTriggers = document.querySelectorAll(".kebab");
const kebabContent = document.querySelector(".kebab-content");

kebabTriggers.forEach((kebabTrigger) => {
    kebabTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        const kebabContent = kebabTrigger.nextElementSibling; // Assumes the kebab-content immediately after
        if (!kebabContent) return;

        kebabContent.classList.toggle("show");
    });
})

window.addEventListener("click", (e) => {
    if (!e.target.closest(".kebab-dropdown")) {
        document.querySelectorAll(".kebab-content.show").forEach(menu => {
            menu.classList.remove("show");
        });
    }
});

// Append delete file function to each delete file button after DOM loads
document.addEventListener("DOMContentLoaded", () => {
    const deleteFileBtns = document.querySelectorAll(".delete-file-btn");
    deleteFileBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const fileId = btn.dataset.fileid;
            deleteFile(fileId);
        });
    });
});

// Sends server request to delete file and handles frontend deletion UI
const deleteFile = (fileId) => {
    fetch(`/files/${fileId}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res) => {
        if (res.ok) {
            location.reload(); 
        } else {
            alert(`${fileId}`);
        }
    })
    .catch((err) => {
        console.error("Error:", err);
    });
}
