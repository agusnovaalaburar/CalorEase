document.addEventListener("DOMContentLoaded", function () {
  fetch("assets/php/countries.php")
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("country-select");
      data.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});
