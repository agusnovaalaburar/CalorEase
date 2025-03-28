let totalEmissionsMoto = 0;

document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.querySelector("#moto .calculate-button");
  calculateButton.addEventListener("click", calculateMotorcycleEmissions);
});

function calculateMotorcycleEmissions() {
  const kilometraje = convertMoto();
  const cilindrada =
    parseFloat(document.getElementById("motoCilindrada").value) || 0;

  // console.log(kilometraje); // debug

  // Example emission factors (REPLACE WITH ACCURATE ONES)
  const baseEmissionFactor = 0.12; // kgCO2e per km
  const displacementFactor = 0.0006; // Additional factor based on engine size

  let EmissionsMoto =
    kilometraje * baseEmissionFactor + cilindrada * displacementFactor;

  totalEmissionsMoto += EmissionsMoto;

  let resultElement = document.querySelector("#moto .calculoVuelos p");
  resultElement.textContent = `Huella Total de Motos = ${totalEmissionsMoto.toFixed(
    2
  )} toneladas de CO2`;

  console.log(EmissionsMoto);
  console.log(totalEmissionsMoto); // debug

  let elementMoto = document.getElementById("finalMoto");
  elementMoto.innerHTML = totalEmissionsMoto + " toneladas de CO2";

  clearInputFieldsMoto();
}

function convertMoto() {
  let kilometraje =
    parseFloat(document.getElementById("motoKilometraje").value) || 0;

  const motoSelectElement = document.getElementById("motoSelect");
  if (!motoSelectElement) {
    console.error('Element with ID "motoSelect" not found.'); // debug
    return;
  }

  const unit = motoSelectElement.value;

  if (unit === "Millas") {
    kilometraje *= 1.60934;
  }

  return kilometraje;
}

function clearInputFieldsMoto() {
  document.getElementById("motoKilometraje").value = "";
  document.getElementById("motoCilindrada").value = "";
}
