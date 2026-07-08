export function iniciarScrollTop() {
    const button = document.querySelector('[data-scroll-top]');

    if (!button) {
        return;
    }

    const toggleVisibility = () => {
        button.classList.toggle('visible', window.scrollY > 320);
    };

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
}
