<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autocomplete input</title>
  <link rel="stylesheet" href="assets/css/select-autocomplete.css?t=<?= time(); ?>">

  <style>
    body {
      font-family: arial;
    }
  </style>
</head>

<body>
  <form action="/action_page.php">
    <select-autocomplete>
      <label><input name="whatever" placeholder="Sök län... "></label>

      <datalist>
        <option value="Norde">
        <option value="abc">
        <option value="aabb">
      </datalist>
    </select-autocomplete>


    <select-autocomplete>
      <label><input placeholder="Sök nåt annat... "></label>

      <datalist>
        <option value="77">
        <option value="55 åäö">
        <option value="78">
      </datalist>
    </select-autocomplete>
  </form>



  Nånting annat

  <script src="assets/js/select-autocomplete.js?t=<?= time(); ?>"></script>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelector('select-autocomplete').addEventListener('submit', (e) => {
        console.log(e.detail);
      });
    });
  </script>
</body>

</html>