<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autocomplete input</title>
  <link rel="stylesheet" href="assets/css/autocomplete-input.css?t=<?= time(); ?>">
</head>

<body>
  <input-autocomplete placeholder="Sök län..." list="colors_data"></input-autocomplete>
  <datalist id="colors_data" data-class-wrap="input-autocomplete-list" data-class-active="active">
    <option value="red">red</option>
    <option value="orange">åäö</option>
    <option value="green">green</option>
    <option value="blue">The color of the sky</option>
  </datalist>

  Nånting annat

  <script src="assets/js/autocomplete-input.js?t=<?= time(); ?>"></script>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      console.log(123);
      document.querySelector('input-autocomplete').addEventListener('submit', (e) => {
        console.log('test');
        console.log(e);
      });
    });
  </script>
</body>

</html>