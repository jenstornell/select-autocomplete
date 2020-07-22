/*
filtered custom event
input enter custom event
Sätt strong på match

// Custom kod - Clicka pil som en select box
// Outside click event hide all

// Pil icon
// Pil toggle
// Vid klick i select, visa alla likt keydown

// Dölj även wrapper vid dölj och visa den om items finns

// Rensa
// active vid key arrow
// active vid mus

// Fallbacks
// classes
// active class
// placeholder

// Testa multipla element
// Stöd för flera klasser
*/

class SelectAutocomplete extends HTMLElement {
  constructor() {
    super();

    console.log("testar");

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleArrowdown = this.handleArrowdown.bind(this);
    this.handleArrowup = this.handleArrowup.bind(this);
    /*
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickInput = this.handleClickInput.bind(this);*/
  }

  connectedCallback() {
    this.datalistToData();

    console.log(this.data);
    this.innerHTML = `
      <label>
        <input placeholder="${this.getAttribute("placeholder")}">
      </label>
      <div></div>
    `;

    this.populate();
    this.storeInput();
    this.storeItems();
    this.storeList();
    this.storeClassActive();
    this.triggerEvents();
  }

  storeInput() {
    this.input = this.querySelector("input");
  }

  storeItems() {
    this.items = this.querySelectorAll("div > div");
  }

  storeList() {
    const listSelector = `#${this.getAttribute("list")}`;
    this.listEl = document.querySelector(listSelector);
  }

  storeClassActive() {
    this.classActive = this.listEl.dataset.classActive;
  }

  datalistToData() {
    const options = this.querySelectorAll("datalist option");

    this.data = {};
    options.forEach((option) => {
      this.data[option.value] = option.innerHTML;
    });
  }

  populate() {
    const listSelector = `#${this.getAttribute("list")}`;
    const classes = document.querySelector(listSelector).dataset.classWrap;

    let list = this.querySelector("div");

    list.setAttribute("class", classes);

    for (const value in this.data) {
      const title = this.data[value];
      const item = document.createElement("div");

      item.textContent = title;
      // item.setAttribute("hidden", "");
      item.dataset.value = value;
      list.appendChild(item);
    }
  }

  filter() {
    this.items.forEach((el) => {
      const value = el.innerHTML.toLowerCase();
      const input = this.input.value.toLowerCase();

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
          value: this.input.value,
          title: "",
        },
      })
    );
  }

  hideAll() {
    this.items.forEach((el) => {
      el.setAttribute("hidden", "");
    });
  }

  activate(el) {
    this.deactivateAll();
    el.classList.add(this.classActive);
    this.active = el;
  }

  deactivateAll() {
    this.items.forEach((el) => {
      el.classList.remove(this.classActive);
    });
  }

  activateFirst() {
    this.deactivateAll();

    const root = this.items[0].parentNode;
    const item = root.querySelector("div:not([hidden])");
    if (!item) return;

    item.classList.add(this.classActive);
    this.active = item;

    console.log(this.active);
  }

  activateLast() {
    this.deactivateAll();

    const root = this.items[0].parentNode;
    const item = root.querySelector("div:not([hidden]):last-of-type");
    if (!item) return;

    item.classList.add(this.classActive);
    this.active = item;
  }

  triggerEvents() {
    this.onKeydown();
    this.onEnter();

    this.onClickItem();
    this.onArrowdown();
    this.onArrowup();
    /*
    
    this.onClickInput();*/
  }

  // Event keydown
  onKeydown() {
    this.input.addEventListener("input", this.handleKeydown);
  }

  handleKeydown() {
    this.filter();
    console.log("asdaas");
  }

  // Event enter
  onEnter() {
    this.input.addEventListener("keydown", this.handleEnter);
  }

  handleEnter(e) {
    if (e.keyCode === 13) {
      if (!this.done) {
        this.input.value = this.active.innerHTML;
        this.handleClickEnter();
        this.done = true;
      } else {
        this.customEventSubmit();
      }
    }
  }

  // Event click item
  onClickItem() {
    this.items.forEach((el) => {
      el.addEventListener("click", this.handleClickItem);
    });
  }

  handleClickItem(e) {
    this.input.value = e.currentTarget.innerHTML;
    this.handleClickEnter();
    //this.triggerItemClick();
  }

  handleClickEnter() {
    this.filter();
    this.hideAll();
    this.input.focus();
  }

  // Event arrow down
  onArrowdown() {
    this.input.addEventListener("keydown", this.handleArrowdown);
  }

  handleArrowdown(e) {
    if (e.keyCode === 40) {
      e.preventDefault();

      let result = this.active.nextElementSibling;

      while (result && result.hidden == true) {
        result = result.nextElementSibling;
      }

      if (result) {
        this.activate(result);
      } else {
        this.activateFirst();
      }
    }
  }

  // Event arrow up
  onArrowup() {
    this.input.addEventListener("keydown", this.handleArrowup);
  }

  handleArrowup(e) {
    if (e.keyCode === 38) {
      e.preventDefault();

      let result = this.active.previousElementSibling;

      while (result && result.hidden == true) {
        result = result.previousElementSibling;
      }

      if (result) {
        this.activate(result);
      } else {
        this.activateLast();
      }
    }
  }
}

customElements.define("select-autocomplete", SelectAutocomplete);

/*
    this.selectors = Object.assign(this.defaultSelectors(), this.o.selectors);
}
*/
