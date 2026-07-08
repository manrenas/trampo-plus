export function iniciarDarkMode() {
    const toggle = document.querySelector('[data-theme-toggle]');

    if (!toggle) {
        return;
    }

    const storedTheme = localStorage.getItem('sonhos-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    document.body.classList.toggle('dark-mode', initialTheme === 'dark');
    toggle.setAttribute('aria-pressed', String(initialTheme === 'dark'));
    toggle.textContent = initialTheme === 'dark' ? '☀️' : '🌙';

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('sonhos-theme', isDark ? 'dark' : 'light');
        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.textContent = isDark ? '☀️' : '🌙';
    });
}
