document.addEventListener("DOMContentLoaded", function () {
  const applyButton = document.querySelector(".apply__button");
  const successButton = document.querySelector(".success__button");

  applyButton.addEventListener("click", () => {
    successButton.classList.remove('hidden');
    applyButton.classList.add('hidden')
  });

  successButton.addEventListener("click", () => {
    applyButton.classList.remove('hidden');
    successButton.classList.add('hidden')
  });
});
