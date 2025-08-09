const modal = document.getElementById("folderModal");
const dropdownTrigger = document.querySelector(".newFolder");
const dropdownContent = document.querySelector(".dropdown-content");
const newFolderBtn = document.getElementById("new-folder");
const closeModal = document.querySelector(".modal .close");
const modalForm = document.querySelector(".modal-form");
const renameModal = document.getElementById("rename-folder-modal");
const closeRenameModal = document.querySelector(".rename-close");


const oldFolderId = document.getElementById("oldFolderId");

// "New" dropdown event listeners

// Shows the New dropdown menu
dropdownTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownContent.classList.toggle("show");
});

// Closes the New dropdown menu if you click anywhere
window.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
        dropdownContent.classList.remove("show");
    }
});


// New folder modal event listeners

// Displays New Folder Modal
newFolderBtn.onclick = () => {
    modal.style.display = "block";
};

// Closes new folder modal
closeModal.onclick = () => {
    modal.style.display = "none";
};


// New file event listener
document.getElementById("new-file").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("fileInput").click();
});



// Right click dropdown on folder links
document.addEventListener("DOMContentLoaded", () => {
    const folderItems = document.querySelectorAll(".folder-item");

    // Displays dropdown menu when user right clicks the folder-item
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

    // Deletes folders when selected from right click drop down menu
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

    document.querySelectorAll(".rename-folder-btn").forEach((button) => {
        button.addEventListener("click", async (e) => {
            e.preventDefault();

            // Get folderId and previous name via dataset
            const folderId = button.dataset.folderid;
            const folderName = button.dataset.foldername;

            // Populate form with the current folder name
            const renameFolder = document.getElementById("renameFolder");
            renameFolder.value = folderName;

            // Open Modal
            renameModal.style.display = "block";
            
            // Pass the folder Id in as a hidden input
            oldFolderId.value = folderId;

            // Set the form action to the correct endpoint
            const renameForm = document.querySelector(".rename-modal-form");
            renameForm.action = `/folders/${folderId}/rename`; // Set the action for the form
            
        });
    })


    document.getElementById("rename-submit-btn").addEventListener("click", async (e) => {
        e.preventDefault();

        // Get the folderId to change and the new name
        const newFolderName = document.getElementById("renameFolder").value;
        const folderId = oldFolderId.value;

        patchFolder(folderId, newFolderName);

        // Clear datasets and form values
        oldFolderId.value = "";
        const newFolderNameInput = document.getElementById("renameFolder");
        newFolderNameInput.value = "";

        // Reset the form action
        const renameForm = document.querySelector(".rename-modal-form");
        renameForm.action = "";

    })

});


// Closes Rename folder modal
closeRenameModal.onclick = () => {
    renameModal.style.display = "none";
};





// Folder delete request to the server
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
};


const patchFolder = (folderId, newFolderName) => {
    
    fetch(`/folders/${folderId}/rename`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newFolderName: newFolderName}),
    })
    .then((res) => {
        if (res.ok) {
            location.reload();

            // Close the modal
            renameModal.style.display = "none";
        } else {
            alert(`${folderId}`);
        }
    })
    .catch((err) => {
        console.error("Error:", err);
    });
}

window.addEventListener("click", (event) => { 

    // Closes modal if you click anywhere else
    if (event.target == modal) {
        modal.style.display = "none";
    }

    // Closes rename folder modal if you click anywhere
    if (event.target == renameModal) {
        renameModal.style.display = "none";
    }   
});
