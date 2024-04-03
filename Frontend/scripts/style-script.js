// const sideviewHeading = ['Personal', 'Commercial', 'Maps'];
// var currentHeading = $("#sideview-heading")[0].innerText;
const slider = document.querySelector('.wrapper-slide');
const slides = document.querySelectorAll('.slider-item-slide');
const slideWidth = document.querySelector('.slider-item-slide').offsetWidth;
var currentSlide = 0;

// Handling triggering of icons for sideview container.
document.querySelector("#next-sideview-icon").addEventListener("click", function () {
    currentSlide += 1;
    if (currentSlide >= slider.children.length) {
        currentSlide = 0;
    }
    for (const slide of slides) {
        slide.style.transform = `translateX(-${(slideWidth * 26) * currentSlide}px)`;
    }
    changeCharts();
});

$("#back-sideview-icon").on("click", function () {
    currentSlide -= 1;
    if (currentSlide < 0) {
        currentSlide = slider.children.length-1;
    }
    for (const slide of slides) {
        slide.style.transform = `translateX(-${(slideWidth * 26) * currentSlide}px)`;
    }
    changeCharts();
});