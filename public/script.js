let slideIndex = 0;
const carouselInner = document.getElementById('carouselInner');
const items = document.querySelectorAll('.carousel-item');

function showSlide(index) {
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % items.length;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + items.length) % items.length;
    showSlide(slideIndex);
}

setInterval(nextSlide, 5000); 