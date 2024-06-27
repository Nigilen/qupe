const burger = document.querySelector(".burger");
const userMenu = document.querySelector(".user-nav");

burger.addEventListener("click", () => {
  userMenu.classList.toggle("user-nav--open");
  burger.classList.toggle("burger--open");
});

const prevButton = document.querySelector(".slider-control--left");
const nextButton = document.querySelector(".slider-control--right");
const slidesContainer = document.querySelector(".slider-list");
const slide = document.querySelector(".slider-item");

let slideWidth = 0;

nextButton.addEventListener("click", () => {
  if (slideWidth >= 0 && slideWidth <= slidesContainer.scrollWidth) {
    slideWidth -= slide.offsetWidth;
    slidesContainer.style.transform = "translateX(" + slideWidth + "px)";
    console.log("sas");
  }
});
prevButton.addEventListener("click", () => {
  if (slideWidth < 0 && slideWidth <= slidesContainer.scrollWidth) {
    slideWidth += slide.offsetWidth;
    slidesContainer.style.transform = "translateX(" + slideWidth + "px)";
  }
});
