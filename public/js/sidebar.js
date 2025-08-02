const modal = document.getElementById("folderModal");
const dropdownTrigger = document.querySelector(".newFolder");
const dropdownContent = document.querySelector(".dropdown-content");

// New folder modal
const newFolderBtn = document.getElementById("new-folder");
const closeModal = document.querySelector(".modal .close");

// List of folders in the sidebar
const folderLink = document.querySelectorAll(".folder-link");

// "New" dropdown event listeners

dropdownTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownContent.classList.toggle("show");
});

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