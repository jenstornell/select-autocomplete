/*
// Outside click event hide all

// Pil icon triangle hack
// Pil toggle class
// Vid klick i select, visa alla likt keydown

// Dölj även wrapper vid dölj och visa den om items finns

// FALLBACKS
// classes
// active class
// placeholder

// Testa multipla element
// Stöd för flera klasser

// Sätt strong på match
// Custom kod - Clicka pil som en select box
*/

class SelectAutocomplete extends HTMLElement {
  constructor() {
    super();

    console.log("testar");

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleHoverItem = this.handleHoverItem.bind(this);
    this.handleArrowdown = this.handleArrowdown.bind(this);
    this.handleArrowup = this.handleArrowup.bind(this);
    /*
    this.handleClickInput = this.handleClickInput.bind(this);*/
  }

  connectedCallback() {
    this.storage();

    console.log(this.store);

    this.triggerEvents();
  }

  storage() {
    const list = this.querySelector("[data-list]");
    let classActive = ["active"];

    if (list.getAttribute("data-active") !== null) {
      classActive = list.dataset.active.split(/\s+/);
    }

    console.log(classActive);

    this.store = {
      classActive: classActive,
      input: this.querySelector("input"),
      list: list,
      items: this.querySelectorAll("[data-list] > div"),
    };

    console.log(this.store);
  }

  filter() {
    this.store.items.forEach((el) => {
      const value = el.innerHTML.toLowerCase();
      const input = this.store.input.value.toLowerCase();

      if (input.length > 0 && value.indexOf(input) > -1) {
        el.removeAttribute("hidden");
      } else {
        el.setAttribute("hidden", "");
      }
    });

    this.activateFirst();
    this.done = false;
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
    this.store.items.forEach((el) => {
      el.setAttribute("hidden", "");
    });
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

    this.onClickItem();
    this.onHoverItem();

    this.onArrowdown();
    this.onArrowup();
    /*
    this.onClickInput();*/
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
      const selector = "div:not([hidden])";
      this.handleArrow(e, this.active.nextElementSibling, selector);
    }
  }

  handleArrow(e, result, selector) {
    e.preventDefault();

    while (result && result.hidden == true) {
      result = result.previousElementSibling;
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
