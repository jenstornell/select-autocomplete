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

    <datalist>
      <option value="pp">a</option>
      <option value="abc">bbc12</option>
      <option value="aabb">aaccc</option>
    </datalist>
  </select-autocomplete>


  <select-autocomplete>
    <label><input placeholder="Sök nåt annat... "></label>

    <datalist>
      <option value="pp">77</option>
      <option value="abc">44</option>
      <option value="aabb">77888</option>
    </datalist>
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