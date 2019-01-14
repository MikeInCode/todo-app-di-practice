const floatingBtn = document.querySelector(".floating-btn");
floatingBtn.addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("active");
});

const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("active");
});
