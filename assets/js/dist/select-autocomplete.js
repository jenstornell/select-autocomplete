class SelectAutocomplete extends HTMLElement {
  constructor() {
    super();

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleEsc = this.handleEsc.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleClickInput = this.handleClickInput.bind(this);
    this.handleClickLabel = this.handleClickLabel.bind(this);
    this.handleHoverItem = this.handleHoverItem.bind(this);
    this.handleArrowdown = this.handleArrowdown.bind(this);
    this.handleArrowup = this.handleArrowup.bind(this);
  }

  connectedCallback() {
    this.populate();
    this.storage();
    this.querySelector("datalist").remove();
    this.dataset.open = "false";
    this.store.input.setAttribute("autocomplete", "off");
    this.triggerEvents();
  }

  populate() {
    let html = "";

    this.querySelectorAll("option").forEach((el) => {
      html += `<div>${el.value}</div>\n`;
    });

    html = `<div data-list hidden>${html}</div>`;
    this.querySelector("datalist").insertAdjacentHTML("beforebegin", html);
  }

  storage() {
    this.store = {
      values: this.values,
      input: this.querySelector("input"),
      list: this.querySelector("[data-list]"),
      items: this.querySelectorAll("[data-list] > div"),
    };
  }

  filter() {
    this.store.hasVisible = false;

    this.store.items.forEach((el) => {
      const value = el.innerText;
      const input = this.store.input.value;
      const match = value.toLowerCase().indexOf(input.toLowerCase()) > -1;

      if (input !== "" && match) {
        el.removeAttribute("hidden");
        this.store.hasVisible = true;
        el.innerHTML = this.boldString(value, input);
      } else {
        el.setAttribute("hidden", "");
      }
    });

    this.triggerListVisibility();
    this.activateFirst();
    this.triggerMenuDirection();
    this.done = false;
  }

  boldString(str, find) {
    var reg = new RegExp("(" + find + ")", "gi");
    return str.replace(reg, "<strong>$1</strong>");
  }

  triggerListVisibility() {
    if (this.store.hasVisible) {
      this.store.list.removeAttribute("hidden");
    } else {
      this.store.list.setAttribute("hidden", "");
    }
  }

  triggerMenuDirection() {
    if (this.store.hasVisible) {
      this.dataset.open = "true";
    } else {
      this.dataset.open = "false";
    }
  }

  // Custom event submit
  customEventSubmit() {
    this.dispatchEvent(
      new CustomEvent("submit", {
        detail: {
          value: this.store.input.value,
        },
      })
    );
  }

  // Custom event toggle
  customEventToggle() {
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: {
          open: this.dataset.open,
        },
      })
    );
  }

  hideAll() {
    this.store.list.setAttribute("hidden", "");
    this.store.items.forEach((el) => {
      el.setAttribute("hidden", "");
    });
    this.store.hasVisible = false;
    this.triggerMenuDirection();
  }

  showAll() {
    this.deactivateAll();
    this.store.list.removeAttribute("hidden");

    this.store.items.forEach((el) => {
      this.stripTags(el);
      el.removeAttribute("hidden");
    });
    this.store.hasVisible = true;
    this.triggerMenuDirection();
  }

  stripTags(el) {
    el.innerHTML = el.innerText;
  }

  activate(el) {
    this.deactivateAll();
    el.dataset.active = "";
    this.active = el;
  }

  deactivateAll() {
    this.store.items.forEach((el) => {
      delete el.dataset.active;
    });
  }

  activateFirst() {
    const item = this.store.list.querySelector("div:not([hidden])");
    if (item) {
      this.activate(item);
    } else {
      this.active = null;
    }
  }

  activateBySelector(selector) {
    const item = this.store.list.querySelector(selector);
    if (!item) return;
    this.activate(item);
  }

  triggerEvents() {
    this.onKeydown();
    this.onEnter();
    this.onEsc();

    this.onClickInput();
    this.onClickItem();
    this.onClickOutside();
    this.onClickLabel();
    this.onHoverItem();

    this.onArrowdown();
    this.onArrowup();
  }

  // Event keydown
  onKeydown() {
    this.store.input.addEventListener("input", this.handleKeydown);
  }

  handleKeydown() {
    this.filter();
  }

  // Event enter
  onEnter() {
    this.store.input.addEventListener("keydown", this.handleEnter);
  }

  handleEnter(e) {
    if (e.keyCode === 13) {
      if (this.store.input.value == "" && !this.active) {
        this.showAll();
      } else if (!this.done) {
        if (this.active) {
          this.store.input.value = this.active.innerText;
        }
        this.handleClickEnter();
        this.done = true;
      } else {
        this.customEventSubmit();
      }
    }
  }

  // Event enter
  onEsc() {
    this.store.input.addEventListener("keydown", this.handleEsc);
  }

  handleEsc(e) {
    if (e.keyCode === 27) {
      this.hideAll();
    }
  }

  // Event click input
  onClickInput() {
    this.store.input.addEventListener("click", this.handleClickInput);
  }

  handleClickInput(e) {
    e.stopPropagation();

    this.handleCloseOthers();

    if (this.store.input.value == "") {
      this.showAll();
    } else {
      this.filter();
    }

    this.customEventToggle();
  }

  // Event click label
  onClickLabel() {
    this.querySelector("label").addEventListener(
      "click",
      this.handleClickLabel
    );
  }

  handleClickLabel(e) {
    e.preventDefault();

    if (this.dataset.open === "false") {
      this.handleCloseOthers();

      if (this.store.input.value == "") {
        this.showAll();
      } else {
        this.filter();
      }
    } else {
      this.hideAll();
    }

    this.store.input.focus();
    this.customEventToggle();
  }

  handleCloseOthers() {
    document.querySelectorAll("select-autocomplete").forEach((el) => {
      el.dataset.open = "false";
      el.querySelector("[data-list]").setAttribute("hidden", "");
    });
  }

  // Event click outside
  onClickOutside() {
    window.addEventListener("click", this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (e.target.closest("select-autocomplete")) return;
    this.hideAll();
    this.triggerMenuDirection();
  }

  // Event click item
  onClickItem() {
    this.store.items.forEach((el) => {
      el.addEventListener("click", this.handleClickItem);
    });
  }

  handleClickItem(e) {
    this.store.input.value = e.currentTarget.innerText;
    this.handleClickEnter();
  }

  handleClickEnter() {
    this.filter();
    this.hideAll();
    this.triggerMenuDirection();
    this.store.input.focus();
  }

  // Event hover item
  onHoverItem() {
    this.store.items.forEach((el) => {
      el.addEventListener("mouseover", this.handleHoverItem);
    });
  }

  handleHoverItem(e) {
    this.activate(e.currentTarget);
  }

  // Event arrow
  onArrowup() {
    this.store.input.addEventListener("keydown", this.handleArrowup);
  }

  onArrowdown() {
    this.store.input.addEventListener("keydown", this.handleArrowdown);
  }

  handleArrowup(e) {
    if (e.keyCode === 38 && this.active) {
      const selector = "div:not([hidden]):last-of-type";
      this.handleArrow(e, this.active.previousElementSibling, selector);
    }
  }

  handleArrowdown(e) {
    if (e.keyCode === 40) {
      if (this.active) {
        const selector = "div:not([hidden]):first-of-type";
        this.handleArrow(e, this.active.nextElementSibling, selector);
      } else {
        this.activateFirst();
      }
    }
  }

  handleArrow(e, result, selector) {
    e.preventDefault();

    while (result && result.hidden == true) {
      result =
        e.keyCode == 38
          ? result.previousElementSibling
          : result.nextElementSibling;
    }

    if (result) {
      this.activate(result);
    } else {
      this.activateBySelector(selector);
    }
  }
}

customElements.define("select-autocomplete", SelectAutocomplete);
