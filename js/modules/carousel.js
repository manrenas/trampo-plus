export function iniciarCarousel() {
    const carousel = document.querySelector(".hero-carousel");
    const slides = Array.from(document.querySelectorAll(".hero-carousel .slide"));

    if (!carousel || !slides.length) {
        return;
    }

    const nextButton = carousel.querySelector(".next");
    const prevButton = carousel.querySelector(".prev");
    let index = 0;
    let intervalo;

    function mostrarSlide(numero) {
        index = (numero + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === index);
        });
    }

    function proximoSlide() {
        mostrarSlide(index + 1);
    }

    function anteriorSlide() {
        mostrarSlide(index - 1);
    }

    function reiniciarAutoPlay() {
        clearInterval(intervalo);
        intervalo = window.setInterval(proximoSlide, 4000);
    }

    nextButton?.addEventListener("click", () => {
        proximoSlide();
        reiniciarAutoPlay();
    });

    prevButton?.addEventListener("click", () => {
        anteriorSlide();
        reiniciarAutoPlay();
    });

    carousel.addEventListener("mouseenter", () => clearInterval(intervalo));
    carousel.addEventListener("mouseleave", reiniciarAutoPlay);

    mostrarSlide(0);
    reiniciarAutoPlay();
}