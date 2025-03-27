let totalEmissionsViv = 0;

document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.querySelector("#vivienda .calculate-button");
  calculateButton.addEventListener("click", calculateHouseEmissions);
});

function calculateHouseEmissions() {
  const energyValues = convertHouseInputs();

  const gasNatural = energyValues.gasNatural;
  const gasoleo = energyValues.gasoleo;
  const carbon = energyValues.carbon;
  const glp = energyValues.glp;
  const propano = energyValues.propano;
  const pellets = energyValues.pellets;

  let numberOfPeople =
    parseFloat(document.getElementById("cantDePersonas").value) || 1;
  let electricity =
    parseFloat(document.getElementById("electricidad").value) || 0;

  const electricityFactor = 0.2881; // kgCO2e/kWh
  const gasNaturalFactor = 0.2; // CO₂e/kWh
  const gasoleoFactor = 2.68; // CO₂e/litro
  const carbonFactor = 2650; // CO₂e/tonelada
  const glpFactor = 1.66; // CO₂e/litro
  const propanoFactor = 1.63; // CO₂e/litro
  const pelletsFactor = 25; // CO₂e/tonelada

  let totalEmissions =
    electricity * electricityFactor +
    gasNatural * gasNaturalFactor +
    gasoleo * gasoleoFactor +
    carbon * carbonFactor +
    glp * glpFactor +
    propano * propanoFactor +
    pellets * pelletsFactor;

  let emissionsPerPerson = totalEmissions / numberOfPeople;

  totalEmissionsViv += emissionsPerPerson;

  console.log(emissionsPerPerson);
  console.log(totalEmissionsViv); // debug

  let resultElement = document.querySelector("#vivienda .calculoViv p");
  resultElement.textContent = `Huella Total de Vivienda = ${totalEmissionsViv.toFixed(
    2
  )} toneladas de CO2`;

  let elementViv = document.getElementById("finalViv");
  elementViv.innerHTML = totalEmissionsViv + " toneladas de CO2";

  clearInputFieldsVivienda();
}

function convertHouseInputs() {
  const gasNatural = document.getElementById("gasNatural");
  const gasNaturalUnit = gasNatural.nextElementSibling.value;
  let gasNaturalValue = parseFloat(gasNatural.value) || 0;
  if (gasNaturalUnit === "termias") {
    gasNaturalValue *= 11.63;
  }

  const gasoleo = document.getElementById("gasoleo");
  const gasoleoUnit = gasoleo.nextElementSibling.value;
  let gasoleoValue = parseFloat(gasoleo.value) || 0;
  if (gasoleoUnit === "galones") {
    gasoleoValue *= 3.78541;
  }

  const carbon = document.getElementById("carbon");
  const carbonUnit = carbon.nextElementSibling.value;
  let carbonValue = parseFloat(carbon.value) || 0;
  switch (carbonUnit) {
    case "bolsa10":
      carbonValue *= 0.01;
      break;
    case "bolsa20":
      carbonValue *= 0.02;
      break;
    case "bolsa25":
      carbonValue *= 0.025;
      break;
    case "bolsa50":
      carbonValue *= 0.05;
      break;
  }

  const glp = document.getElementById("glp");
  const glpUnit = glp.nextElementSibling.value;
  let glpValue = parseFloat(glp.value) || 0;
  if (glpUnit === "galones") {
    glpValue *= 3.78541;
  }

  const propano = document.getElementById("propano");
  const propanoUnit = propano.nextElementSibling.value;
  let propanoValue = parseFloat(propano.value) || 0;
  if (propanoUnit === "galones") {
    propanoValue *= 3.78541;
  }

  const pellets = document.getElementById("pellets");
  let pelletsValue = parseFloat(pellets.value) || 0;

  return {
    gasNatural: gasNaturalValue,
    gasoleo: gasoleoValue,
    carbon: carbonValue,
    glp: glpValue,
    propano: propanoValue,
    pellets: pelletsValue,
  };
}

function clearInputFieldsVivienda() {
  document.getElementById("gasNatural").value = "";
  document.getElementById("gasoleo").value = "";
  document.getElementById("carbon").value = "";
  document.getElementById("glp").value = "";
  document.getElementById("propano").value = "";
  document.getElementById("pellets").value = "";
  document.getElementById("electricidad").value = "";
}
