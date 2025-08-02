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