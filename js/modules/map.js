export function iniciarMapa() {
    const map = document.querySelector('[data-map]');
    if (map) {
        map.setAttribute('loading', 'lazy');
    }
}
