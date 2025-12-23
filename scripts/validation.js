document.addEventListener("DOMContentLoaded", function () {
  const regForm = document.querySelector("form[reg]");
  const authForm = document.querySelector("form[auth]");

  function clearRegForm() {
    if (!regForm) return;

    document.getElementById("reg-name").value = "";
    document.getElementById("reg-email").value = "";
    document.getElementById("reg-tel").value = "";
    document.getElementById("reg-pass").value = "";
    document.getElementById("reg-pass-repeat").value = "";
    document.getElementById("reg-check").checked = false;

    const inputs = regForm.querySelectorAll("input");
    inputs.forEach((input) => {
      input.style.borderColor = "";
    });

    validateRegForm();
  }

  function clearAuthForm() {
    if (!authForm) return;

    document.getElementById("auth-email").value = "";
    document.getElementById("auth-pass").value = "";

    const inputs = authForm.querySelectorAll("input");
    inputs.forEach((input) => {
      input.style.borderColor = "";
    });

    validateAuthForm();
  }

  // Функция для обработки формы регистрации
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

      clearRegForm();

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

      clearAuthForm();

      const authPopover = document.getElementById("auth");
      if (authPopover) {
        authPopover.hidePopover();
      }

      alert("Авторизация успешно отправлена! Данные выведены в консоль.");
    });
  }

  let validateRegForm, validateAuthForm;

  if (regForm) {
    const regInputs = regForm.querySelectorAll("input[required]");
    const regSubmitBtn = regForm.querySelector('button[type="submit"]');

    validateRegForm = function () {
      let allValid = true;

      regInputs.forEach((input) => {
        if (input.type === "checkbox") {
          if (!input.checked) allValid = false;
        } else {
          if (!input.value.trim()) allValid = false;
        }
      });

      // Проверка совпадения паролей
      const password = document.getElementById("reg-pass");
      const passwordRepeat = document.getElementById("reg-pass-repeat");
      if (
        password &&
        passwordRepeat &&
        password.value &&
        passwordRepeat.value &&
        password.value !== passwordRepeat.value
      ) {
        console.warn("Пароли не совпадают!");
        password.style.borderColor = "#ff4444";
        passwordRepeat.style.borderColor = "#ff4444";
      } else if (password && passwordRepeat) {
        password.style.borderColor = "";
        passwordRepeat.style.borderColor = "";
      }

      if (regSubmitBtn) {
        regSubmitBtn.disabled = !allValid;
      }

      return allValid;
    };

    regInputs.forEach((input) => {
      input.addEventListener("input", validateRegForm);
      input.addEventListener("change", validateRegForm);
    });

    validateRegForm();
  }

  if (authForm) {
    const authInputs = authForm.querySelectorAll("input[required]");
    const authSubmitBtn = authForm.querySelector('button[type="submit"]');

    validateAuthForm = function () {
      let allValid = true;

      authInputs.forEach((input) => {
        if (!input.value.trim()) allValid = false;
      });

      if (authSubmitBtn) {
        authSubmitBtn.disabled = !allValid;
      }

      return allValid;
    };

    authInputs.forEach((input) => {
      input.addEventListener("input", validateAuthForm);
      input.addEventListener("change", validateAuthForm);
    });

    validateAuthForm();
  }

  document.addEventListener("click", function (e) {
    if (
      e.target.closest('[command="hide-popover"]') ||
      (e.target.hasAttribute("popover") && e.target.style.display === "block")
    ) {
      const registerPopover = document.getElementById("register");
      const authPopover = document.getElementById("auth");

      if (registerPopover && registerPopover.style.display === "block") {
        clearRegForm();
      }

      if (authPopover && authPopover.style.display === "block") {
        clearAuthForm();
      }
    }
  });
});
