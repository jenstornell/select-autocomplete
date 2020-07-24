# Autocomplete input

SCREENSHOT

## In short

- Simple to use
- Small filesize
- Keyboard support
- No dependencies
- Html web component
- Vanilla js

## Setup

### CSS

Place it within `<head></head>`.

```html
<link rel="stylesheet" href="assets/css/autocomplete-input.css" />
```

### Javaascript

In most cases place it just before `</body>`.

```html
<script src="assets/js/select-autocomplete.js"></script>
```

## Usage

<!-- prettier-ignore -->
```html
<select-autocomplete>
  <label><input placeholder="Select a country..."></label>

  <datalist>
    <option value="Finland">
    <option value="Norway">
    <option value="Sweden">
  </datalist>
</select-autocomplete>
```

You can add more HTML to this component, if you need to. However, make sure to not remove the current elements. All of the elements above are are required, except for the `label`.

## Options

There are no options except for what you see in the usage example above.

## Events

### Submit

The `submit` event is fired when the user first select an option and then press enter to confirm.

The example below will add the `submit` event to the first `select-autocomplete` element.

```html
<script>
  document
    .querySelector("select-autocomplete")
    .addEventListener("submit", (e) => {
      console.log(e.detail.value);
    });
</script>
```

## Donate

Donate to [https://www.paypal.me/DevoneraAB](DevoneraAB) if you want.

## License

MIT
