export function iniciarFAQ() {
    const items = Array.from(document.querySelectorAll(".faq-item"));

    if (!items.length) {
        return;
    }

    items.forEach((item) => {
        const question = item.querySelector(".faq-question");

        if (!question) {
            return;
        }

        question.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");

            items.forEach((otherItem) => {
                otherItem.classList.remove("is-open");
                const otherQuestion = otherItem.querySelector(".faq-question");
                if (otherQuestion) {
                    otherQuestion.setAttribute("aria-expanded", "false");
                }
            });

            if (!isOpen) {
                item.classList.add("is-open");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });
}
