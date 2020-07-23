<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autocomplete input</title>
  <link rel="stylesheet" href="assets/css/autocomplete-input.css?t=<?= time(); ?>">
</head>

<body>
  <select-autocomplete>
    <label><input placeholder="Sök län... "></label>

    <div data-list hidden>
      <div data-value="pp">a</div>
      <div data-value="abc">acbc122</div>
      <div data-value="aabbb">aacccc</div>
    </div>
  </select-autocomplete>

  Nånting annat

  <script src="assets/js/select-autocomplete.js?t=<?= time(); ?>"></script>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      console.log(123);
      /*document.querySelector('input-autocomplete').addEventListener('submit', (e) => {
        console.log('test');
        console.log(e);
      });*/
    });
  </script>
</body>

</html>