const modal = document.getElementById("folderModal");
const dropdownTrigger = document.querySelector(".newFolder");
const dropdownContent = document.querySelector(".dropdown-content");
const folderKebabTriggers = document.querySelectorAll(".folder-kebab");

// New folder modal
const newFolderBtn = document.getElementById("new-folder");
const closeModal = document.querySelector(".modal .close");

// // List of folders in the sidebar
// const folderLinks = document.querySelectorAll(".folder-item");


// "New" dropdown event listeners

dropdownTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownContent.classList.toggle("show");
});

// Merge 1
window.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
        dropdownContent.classList.remove("show");
    }
});


// New folder modal event listeners

newFolderBtn.onclick = () => {
    modal.style.display = "block";
};

closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// New file event listener
document.getElementById("new-file").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("fileInput").click();
});

folderKebabTriggers.forEach((kebabTrigger) => {
    kebabTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        const kebabContent = kebabTrigger.nextElementSibling; // Assumes the kebab-content immediately after
        if (!kebabContent) return;

        kebabContent.classList.toggle("show");
    });
})

window.addEventListener("click", (e) => {
    if (!e.target.closest(".folder-kebab-dropdown")) {
        document.querySelectorAll(".folder-kebab-content.show").forEach(menu => {
            menu.classList.remove("show");
        });
    }
});

// Right click dropdown on folder links
document.addEventListener("DOMContentLoaded", () => {
    const folderItems = document.querySelectorAll(".folder-item");

    folderItems.forEach((item) => {
        item.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            // Hide all other menus
            document.querySelectorAll(".folder-context-menu").forEach((menu) => {
                menu.classList.add("hidden");
            });

            const menu = item.querySelector(".folder-context-menu");
            menu.style.top = `${e.pageY}px`;
            menu.style.left = `${e.pageX}px`;
            menu.classList.remove("hidden");
        });
    });

    // Hide context menu after clicking anywhere
    document.addEventListener("click", () => {
        document.querySelectorAll(".folder-context-menu").forEach((menu) => {
            menu.classList.add("hidden");
        });
    });

    document.querySelectorAll(".delete-folder-btn").forEach((button) => {
        button.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const folderItem = button.closest(".folder-item");
            const folderId = folderItem.dataset.folderid;

            const confirmed = confirm("Are you sure you want to delete this folder and all the files in it?");
            if (!confirmed) return;

           deleteFolder(folderId);
        })
    })
});


// double check route
const deleteFolder = (folderId) => {
    fetch(`/folders/${folderId}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res) => {
        if(res.ok) {
            window.location.href = "/dashboard";
        } else {
            alert(`${folderId}`);
        }
    })
    .catch((err) => {
        console.error("Error:", err);
    });
}