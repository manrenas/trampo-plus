export function iniciarBlog() {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 80}ms`;
        card.classList.add('fade-in');
    });
}
