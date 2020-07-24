/*
// Splitta strängen för strong
*/

class SelectAutocomplete extends HTMLElement {
  constructor() {
    super();

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
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
    this.dataset.open = "false";
    this.storage();
    this.triggerEvents();
  }

  populate() {
    let html = "";

    this.querySelectorAll("option").forEach((el) => {
      console.log(el);
      html += `<div data-value="${el.value}">${el.innerHTML}</div>\n`;
    });

    html = `<div data-list hidden>${html}</div>`;
    this.querySelector("datalist").insertAdjacentHTML("beforebegin", html);
  }

  storage() {
    const list = this.querySelector("[data-list]");
    let classActive = ["active"];

    if (list.getAttribute("data-active") !== null) {
      classActive = list.dataset.active.split(/\s+/);
    }

    this.store = {
      classActive: classActive,
      input: this.querySelector("input"),
      list: list,
      items: this.querySelectorAll("[data-list] > div"),
    };
  }

  filter() {
    this.store.hasVisible = false;

    this.store.items.forEach((el) => {
      const value = el.innerHTML.toLowerCase();
      const input = this.store.input.value.toLowerCase();

      if (input.length > 0 && value.indexOf(input) > -1) {
        el.removeAttribute("hidden");
        this.store.hasVisible = true;
      } else {
        el.setAttribute("hidden", "");
      }
    });

    this.triggerListVisibility();
    this.activateFirst();
    this.triggerMenuDirection();
    this.done = false;
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

  customEventSubmit() {
    this.dispatchEvent(
      new CustomEvent("submit", {
        detail: {
          value: this.store.input.value,
          title: "",
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
    this.store.list.removeAttribute("hidden");
    this.store.items.forEach((el) => {
      el.removeAttribute("hidden");
    });
    this.store.hasVisible = true;
    this.triggerMenuDirection();
  }

  activate(el) {
    this.deactivateAll();
    el.classList.add(...this.store.classActive);
    this.active = el;
  }

  deactivateAll() {
    this.store.items.forEach((el) => {
      el.classList.remove(...this.store.classActive);
    });
  }

  activateFirst() {
    const item = this.store.list.querySelector("div:not([hidden])");
    if (!item) return;
    this.activate(item);
  }

  activateLast() {
    const item = this.store.list.querySelector(
      "div:not([hidden]):last-of-type"
    );
    if (!item) return;

    this.activate(item);
  }

  activateBySelector(selector) {
    const item = this.store.list.querySelector(selector);
    if (!item) return;
    this.activate(item);
  }

  triggerEvents() {
    this.onKeydown();
    this.onEnter();

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
      if (!this.done) {
        this.store.input.value = this.active.innerHTML;
        this.handleClickEnter();
        this.done = true;
      } else {
        this.customEventSubmit();
      }
    }
  }

  // Event click input
  onClickInput() {
    this.store.input.addEventListener("click", this.handleClickInput);
  }

  handleClickInput(e) {
    e.stopPropagation();

    if (this.store.input.value == "") {
      this.showAll();
    } else {
      this.filter();
    }
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
      if (this.store.input.value === "") {
        this.showAll();
      } else {
        this.filter();
      }
    } else {
      this.hideAll();
    }

    this.store.input.focus();
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
    this.store.input.value = e.currentTarget.innerHTML;
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
    if (e.keyCode === 38) {
      const selector = "div:not([hidden]):last-of-type";
      this.handleArrow(e, this.active.previousElementSibling, selector);
    }
  }

  handleArrowdown(e) {
    if (e.keyCode === 40) {
      const selector = "div:not([hidden]):first-of-type";
      this.handleArrow(e, this.active.nextElementSibling, selector);
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

/*
    this.selectors = Object.assign(this.defaultSelectors(), this.o.selectors);
}
*/
