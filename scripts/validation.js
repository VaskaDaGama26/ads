document.addEventListener("DOMContentLoaded", function () {
  const regForm = document.querySelector("form[reg]");
  const authForm = document.querySelector("form[auth]");

  if (regForm) {
    regForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Собираем данные формы
      const formData = {
        name: document.getElementById("reg-name").value,
        email: document.getElementById("reg-email").value,
        phone: document.getElementById("reg-tel").value,
        password: document.getElementById("reg-pass").value,
        passwordRepeat: document.getElementById("reg-pass-repeat").value,
        privacyAccepted: document.getElementById("reg-check").checked,
      };

      // Выводим в консоль
      console.log("=== ДАННЫЕ РЕГИСТРАЦИИ ===");
      console.log("Имя:", formData.name);
      console.log("Email:", formData.email);
      console.log("Телефон:", formData.phone);
      console.log("Пароль:", formData.password);
      console.log("Повтор пароля:", formData.passwordRepeat);
      console.log(
        "Согласие на обработку данных:",
        formData.privacyAccepted ? "ДА" : "НЕТ"
      );
      console.log("==========================");

      const registerPopover = document.getElementById("register");
      if (registerPopover) {
        registerPopover.hidePopover();
      }

      alert("Регистрация успешно отправлена! Данные выведены в консоль.");
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Собираем данные формы
      const formData = {
        email: document.getElementById("auth-email").value,
        password: document.getElementById("auth-pass").value,
      };

      // Выводим в консоль
      console.log("=== ДАННЫЕ АВТОРИЗАЦИИ ===");
      console.log("Email:", formData.email);
      console.log("Пароль:", formData.password);
      console.log("==========================");

      const authPopover = document.getElementById("auth");
      if (authPopover) {
        authPopover.hidePopover();
      }

      alert("Авторизация успешно отправлена! Данные выведены в консоль.");
    });
  }

  function setupFormValidation() {
    // Валидация формы регистрации
    if (regForm) {
      const regInputs = regForm.querySelectorAll("input[required]");
      const regSubmitBtn = regForm.querySelector('button[type="submit"]');

      function validateRegForm() {
        let allValid = true;

        regInputs.forEach((input) => {
          if (input.type === "checkbox") {
            if (!input.checked) allValid = false;
          } else {
            if (!input.value.trim()) allValid = false;
          }
        });

        // Проверка совпадения паролей
        const password = document.getElementById("reg-pass").value;
        const passwordRepeat = document.getElementById("reg-pass-repeat").value;
        if (password && passwordRepeat && password !== passwordRepeat) {
          console.warn("Пароли не совпадают!");
        }

        if (regSubmitBtn) {
          regSubmitBtn.disabled = !allValid;
        }

        return allValid;
      }

      regInputs.forEach((input) => {
        input.addEventListener("input", validateRegForm);
        input.addEventListener("change", validateRegForm);
      });

      validateRegForm();
    }

    // Валидация формы авторизации
    if (authForm) {
      const authInputs = authForm.querySelectorAll("input[required]");
      const authSubmitBtn = authForm.querySelector(
        'button[type="submit"][pink]'
      );

      function validateAuthForm() {
        let allValid = true;

        authInputs.forEach((input) => {
          if (!input.value.trim()) allValid = false;
        });

        if (authSubmitBtn) {
          authSubmitBtn.disabled = !allValid;
        }

        return allValid;
      }

      authInputs.forEach((input) => {
        input.addEventListener("input", validateAuthForm);
        input.addEventListener("change", validateAuthForm);
      });

      validateAuthForm();
    }
  }

  setupFormValidation();
});
