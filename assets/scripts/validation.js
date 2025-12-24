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
    ADD: {
      selector: "form[add]",
      id: null,
      fields: ["add-name", "add-price", "add-desc"],
      logTitle: "ДАННЫЕ ОБЪЯВЛЕНИЯ",
      successMessage: "Объявление успешно отправлено!",
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
          let key = fieldId.replace(`${this.type.toLowerCase()}-`, "");
          if (this.type === "ADD") {
            if (fieldId === "add-name") key = "name";
            if (fieldId === "add-price") key = "price";
            if (fieldId === "add-desc") key = "desc";
          }
          data[key] =
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
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!this.validate()) return;

        if (this.type === "ADD") {
          await this.handleAddForm();
          return;
        }

        const data = this.collectData();

        const endpoint =
          this.type === "REG" ? "/src/register.php" : "/src/login.php";

        console.log("Отправка данных на:", endpoint, data);

        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const responseText = await response.text();
          console.log("Ответ сервера:", responseText);

          try {
            const result = JSON.parse(responseText);

            if (result.success) {
              this.logData(data);
              this.clear();

              if (this.popover) {
                this.popover.hidePopover();
              }

              alert(result.message);

              setTimeout(() => {
                window.location.reload(true);
              }, 500);
            } else {
              alert(
                result.errors ? result.errors.join("\n") : "Произошла ошибка"
              );
            }
          } catch (parseError) {
            console.error("Ошибка парсинга JSON:", responseText);
            console.error("Ошибка:", parseError);
            alert(
              "Сервер вернул некорректный ответ. Проверьте консоль для деталей."
            );
          }
        } catch (error) {
          console.error("Ошибка сети:", error);
          alert("Произошла ошибка при отправке данных. Проверьте подключение.");
        }
      });
    }

    async handleAddForm() {
      const data = this.collectData();

      const formData = new FormData();
      formData.append("title", data.name || "");
      formData.append("price", data.price || "");
      formData.append("description", data.desc || "");

      const fileInput = document.getElementById("add-file");
      if (fileInput && fileInput.files[0]) {
        formData.append("image", fileInput.files[0]);
      } else {
        alert("Пожалуйста, выберите изображение");
        return;
      }

      try {
        const response = await fetch("/src/add_ad.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          alert(result.message);

          this.clear();

          if (result.redirect) {
            setTimeout(() => {
              window.location.href = result.redirect;
            }, 1000);
          } else {
            setTimeout(() => {
              window.location.href = "/";
            }, 1000);
          }
        } else {
          if (result.errors) {
            alert(result.errors.join("\n"));
          } else {
            alert(result.message || "Произошла ошибка");
          }
        }
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка соединения с сервером");
      }
    }
  }

  const regManager = new FormManager("REG");
  const authManager = new FormManager("AUTH");
  const addManager = new FormManager("ADD");

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
