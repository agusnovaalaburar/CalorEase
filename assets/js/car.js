let totalEmissionsAuto = 0;

document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.querySelector("#coche .calculate-button");
  calculateButton.addEventListener("click", calculateCarEmissions);
});

function calculateCarEmissions() {
  const carValues = convertCar();
  const kilometraje = carValues.kilometraje;
  const cilindrado = carValues.cilindrado;
  const placeholder = document.getElementById("autoCombustible") || 0;
  const combustible = placeholder.value;
  console.log(kilometraje + " " + cilindrado);
  console.log(combustible); // debug

  // Example emission factors (REPLACE WITH ACCURATE ONES)
  const fuelFactors = {
    gas: 0.2,
    diesel: 0.27,
    glp: 0.17,
    cng: 0.18,
  };

  const displacementFactor = 0.001; // Example factor for engine displacement REPLACE WITH ACCURATE ONES

  let emissionsAuto =
    kilometraje * fuelFactors[combustible] +
    (cilindrado / 1000) * displacementFactor;
  totalEmissionsAuto += emissionsAuto;

  console.log(emissionsAuto);
  console.log(totalEmissionsAuto); // debug

  let resultElement = document.querySelector("#coche .calculoVuelos p");
  resultElement.textContent = `Huella Total de Coches = ${totalEmissionsAuto.toFixed(
    2
  )} toneladas de CO2`;

  let elementAuto = document.getElementById("finalAuto");
  elementAuto.innerHTML = totalEmissionsAuto + " toneladas de CO2";

  clearInputFieldsAuto();
}

function convertCar() {
  const kilometraje = document.getElementById("AutoKM");
  let kilometrajeValue = parseFloat(kilometraje.value) || 0;
  const kilometrajeUnit = kilometraje.nextElementSibling.value;
  if (kilometrajeUnit === "Millas") {
    kilometrajeValue *= 1.60934;
  }

  const cilindrado = document.getElementById("autoCilindrado");
  let cilindradoValue = parseFloat(cilindrado.value) || 0;
  const cilindradoUnit = cilindrado.nextElementSibling.value;

  if (cilindradoUnit === "Litros") {
    cilindradoValue *= 1000; //
  }

  return {
    kilometraje: kilometrajeValue,
    cilindrado: cilindradoValue,
  };
}

function clearInputFieldsAuto() {
  document.getElementById("AutoKM").value = "";
  document.getElementById("autoCilindrado").value = "";
}
