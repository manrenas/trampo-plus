export function iniciarGaleria() {
    const filters = document.querySelectorAll('[data-gallery-filter]');
    const items = document.querySelectorAll('[data-gallery-item]');

    if (!filters.length || !items.length) {
        return;
    }

    filters.forEach((filter) => {
        filter.addEventListener('click', () => {
            const category = filter.dataset.galleryFilter;
            filters.forEach((btn) => btn.classList.toggle('active', btn === filter));

            items.forEach((item) => {
                const matches = category === 'all' || item.dataset.galleryItem === category;
                item.style.display = matches ? 'block' : 'none';
            });
        });
    });
}
