    const kebabTrigger = document.querySelector(".kebab");
    const kebabContent = document.querySelector(".kebab-content");

    kebabTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        kebabContent.classList.toggle("show");
    });

    window.addEventListener("click", (e) => {
        if (!e.target.closest(".kebab-dropdown")) {
            kebabContent.classList.remove("show");
        }
    });