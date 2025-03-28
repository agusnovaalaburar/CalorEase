let totlaEmissionsBondi = 0;

document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.querySelector('#bondi .calculate-button');
    calculateButton.addEventListener('click', calculatePublicTransportEmissions);
});

function calculatePublicTransportEmissions() {
    const convertedValues = getConvertedValues();

    // Example emission factors (kgCO2e per km) REPLACE WITH ACCURATE VALUES
    const factors = {
        autobus: 0.1,
        autocar: 0.05,
        nacTren: 0.04,
        interTren: 0.03,
        tranvia: 0.02,
        metro: 0.03,
        taxi: 0.16
    };

    console.log(convertedValues);
    console.log(convertedValues.taxi); // debug
    console.log(convertedValues.metro);


    let totalEmissions = (convertedValues.autobus * factors.autobus) + (convertedValues.autocar * factors.autocar) + (convertedValues.nacTren * factors.nacTren) + (convertedValues.interTren * factors.interTren) + (convertedValues.tranvia * factors.tranvia) + (convertedValues.metro * factors.metro) + (convertedValues.taxi * factors.taxi);

    // convert to tons
    totalEmissions = totalEmissions / 1000;
    totlaEmissionsBondi += totalEmissions;

    console.log(totalEmissions);
    console.log(totlaEmissionsBondi); // debug

    let resultElement = document.querySelector('#bondi .calculoViv p');
    resultElement.textContent = `Huella Total de Transporte Público = ${totlaEmissionsBondi.toFixed(2)} toneladas de CO2`;

    let elementBondi = document.getElementById("finalBondi");
    elementBondi.innerHTML = totlaEmissionsBondi + " toneladas de CO2";

    clearInputFieldsBondi();
}

function convertToKilometers(value, unit) {
    if (!value || isNaN(value)) return 0;
    return unit === "Millas" ? value * 1.60934 : value;
}

function getConvertedValues() {
    const autobus = document.getElementById('autobus');
    const autocar = document.getElementById('autocar');
    const nacTren = document.getElementById('nacTren');
    const interTren = document.getElementById('interTren');
    const tranvia = document.getElementById('tranvia');
    const metro = document.getElementById('metro');
    const taxi = document.getElementById('taxi');

    const selectElements = document.querySelectorAll('#bondi .normalSelect');

    const convertedValues = {
        autobus: convertToKilometers(
            parseFloat(autobus?.value || 0), 
            selectElements[0]?.value
        ),
        autocar: convertToKilometers(
            parseFloat(autocar?.value || 0), 
            selectElements[1]?.value
        ),
        nacTren: convertToKilometers(
            parseFloat(nacTren?.value || 0), 
            selectElements[2]?.value
        ),
        interTren: convertToKilometers(
            parseFloat(interTren?.value || 0), 
            selectElements[3]?.value
        ),
        tranvia: convertToKilometers(
            parseFloat(tranvia?.value || 0), 
            selectElements[4]?.value
        ),
        metro: convertToKilometers(
            parseFloat(metro?.value || 0), 
            selectElements[5]?.value
        ),
        taxi: convertToKilometers(
            parseFloat(taxi?.value || 0), 
            selectElements[6]?.value
        )
    };

    return convertedValues;
}

function clearInputFieldsBondi() {
    document.getElementById('autobus').value = '';
    document.getElementById('autocar').value = '';
    document.getElementById('nacTren').value = '';
    document.getElementById('interTren').value = '';
    document.getElementById('tranvia').value = '';
    document.getElementById('metro').value = '';
    document.getElementById('taxi').value = '';
}