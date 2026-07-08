export function iniciarMenu() {
    const header = document.querySelector(".header");
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector(".menu-toggle");

    if (!header || !nav) {
        return;
    }

    if (toggle) {
        nav.classList.add("is-collapsed");

        toggle.addEventListener("click", () => {
            const isCollapsed = nav.classList.toggle("is-collapsed");
            toggle.setAttribute("aria-expanded", String(!isCollapsed));
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.add("is-collapsed");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    const links = Array.from(nav.querySelectorAll("a"));
    links.forEach((link) => {
        link.addEventListener("click", () => {
            links.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
        });
    });
}
