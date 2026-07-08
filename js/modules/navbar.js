export function iniciarNavbar() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.menu-toggle');

    if (!header || !nav) {
        return;
    }

    const setActiveLink = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        nav.querySelectorAll('a').forEach((link) => {
            const href = link.getAttribute('href') || '';
            const isCurrent = href === currentPath || (currentPath === 'index.html' && href === 'index.html');
            link.classList.toggle('active', isCurrent);
        });
    };

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 18);
    });

    toggle?.addEventListener('click', () => {
        nav.classList.toggle('is-collapsed');
    });

    setActiveLink();
}
