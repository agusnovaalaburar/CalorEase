document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío normal del formulario

    const formData = new FormData(this); // Crea un FormData con los datos del formulario

    fetch("assets/php/usuario.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("resultadoUser").innerHTML = data; // Muestra el resultado en el div "resultado"
        clearInputFieldsForm();
    })
    .catch(error => console.error("Error:", error));
});

function clearInputFieldsForm() {
    document.getElementById("username").value = "";
    document.getElementById("edad").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("email").value = "";
    document.getElementById("generoMasc").checked = false;
    document.getElementById("generoFem").checked = false;
    document.getElementById("generoNon").checked = false;
    document.getElementById("compYes").checked = false;
    document.getElementById("compNo").checked = false;
    document.getElementById("estYes").checked = false;
    document.getElementById("estNo").checked = false;
}