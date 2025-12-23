document.addEventListener("DOMContentLoaded", function () {
  const Forms = {
    REG: {
      selector: "form[reg]",
      id: "register",
      fields: [
        "reg-name",
        "reg-email",
        "reg-tel",
        "reg-pass",
        "reg-pass-repeat",
        "reg-check",
      ],
      logTitle: "ДАННЫЕ РЕГИСТРАЦИИ",
      successMessage:
        "Регистрация успешно отправлена! Данные выведены в консоль.",
    },
    AUTH: {
      selector: "form[auth]",
      id: "auth",
      fields: ["auth-email", "auth-pass"],
      logTitle: "ДАННЫЕ АВТОРИЗАЦИИ",
      successMessage:
        "Авторизация успешно отправлена! Данные выведены в консоль.",
    },
  };

  class FormManager {
    constructor(type) {
      this.type = type;
      this.config = Forms[type];
      this.form = document.querySelector(this.config.selector);
      this.popover = document.getElementById(this.config.id);
      this.submitBtn = this.form?.querySelector('button[type="submit"]');
      this.init();
    }

    init() {
      if (!this.form) return;

      this.setupValidation();
      this.setupSubmitHandler();
    }

    collectData() {
      const data = {};
      this.config.fields.forEach((fieldId) => {
        const element = document.getElementById(fieldId);
        if (element) {
          data[fieldId.replace(`${this.type.toLowerCase()}-`, "")] =
            element.type === "checkbox" ? element.checked : element.value;
        }
      });
      return data;
    }

    clear() {
      this.config.fields.forEach((fieldId) => {
        const element = document.getElementById(fieldId);
        if (element) {
          if (element.type === "checkbox") {
            element.checked = false;
          } else {
            element.value = "";
          }
          element.style.borderColor = "";
        }
      });
      this.validate();
    }

    validate() {
      if (!this.form) return false;

      const requiredInputs = this.form.querySelectorAll("input[required]");
      let allValid = true;

      requiredInputs.forEach((input) => {
        const isValid =
          input.type === "checkbox" ? input.checked : input.value.trim() !== "";

        if (!isValid) allValid = false;

        if (this.type === "REG") {
          const password = document.getElementById("reg-pass");
          const passwordRepeat = document.getElementById("reg-pass-repeat");

          if (
            password &&
            passwordRepeat &&
            password.value &&
            passwordRepeat.value
          ) {
            if (password.value !== passwordRepeat.value) {
              allValid = false;
              password.style.borderColor = "#ff4444";
              passwordRepeat.style.borderColor = "#ff4444";
            } else {
              password.style.borderColor = "";
              passwordRepeat.style.borderColor = "";
            }
          }
        }
      });

      if (this.submitBtn) {
        this.submitBtn.disabled = !allValid;
      }

      return allValid;
    }

    logData(data) {
      console.log(`=== ${this.config.logTitle} ===`);
      Object.entries(data).forEach(([key, value]) => {
        const displayKey = this.getDisplayKey(key);
        console.log(`${displayKey}:`, value);
      });
      console.log("=".repeat(this.config.logTitle.length + 6));
    }

    getDisplayKey(key) {
      const keyMap = {
        name: "Имя",
        email: "Email",
        tel: "Телефон",
        pass: "Пароль",
        "pass-repeat": "Повтор пароля",
        check: "Согласие на обработку данных",
      };
      return keyMap[key] || key;
    }

    setupValidation() {
      const inputs = this.form.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("input", () => this.validate());
        input.addEventListener("change", () => this.validate());
      });
      this.validate();
    }

    setupSubmitHandler() {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!this.validate()) return;

        const data = this.collectData();
        this.logData(data);

        this.clear();

        if (this.popover) {
          this.popover.hidePopover();
        }

        alert(this.config.successMessage);
      });
    }
  }

  const regManager = new FormManager("REG");
  const authManager = new FormManager("AUTH");

  document.addEventListener("click", (e) => {
    const isCloseButton = e.target.closest('[command="hide-popover"]');
    const isPopover =
      e.target.hasAttribute("popover") && e.target.style.display === "block";

    if (isCloseButton || isPopover) {
      [regManager, authManager].forEach((manager) => {
        if (manager.popover && manager.popover.style.display === "block") {
          manager.clear();
        }
      });
    }
  });
});
