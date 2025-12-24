document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();

  // Обработка кнопки выхода
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      fetch("/src/logout.php")
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            location.reload();
          }
        })
        .catch(() => {
          location.reload();
        });
    });
  }
});

function checkAuthStatus() {
  fetch("/src/check_auth.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.logged_in) {
        console.log("Пользователь авторизован:", data.user);
      } else {
        console.log("Пользователь не авторизован");
      }
    })
    .catch((error) => {
      console.log("Ошибка проверки авторизации:", error);
    });
}
