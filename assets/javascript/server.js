const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");

const app = express();
const port = 3000;

//peticiones JSON
app.use(express.json());
app.use(cors());

//instancia
const genAI = new GoogleGenerativeAI("AIzaSyDgdLETOQ7NbyJJcA0jzUgNy2k05UBjUNU");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Ruta
app.post("/generate", async (req, res) => {
  const inputText = req.body.text;

  const parts = [
    {
      text: "input: sos un asistente de nutricion y te vamos a nombrar alimentos, deberias imaginartelo en tamaño promedio/mediano, cuando un alimento sigue de un NUMERO por ejemplo 'manzana2' es la cantidad del alimento osea multiplicador. SOLO TIENES PERMITIDO RESPONDER EL SIGUIENTE FORMATO, SIN SALTEAR UN ELEMENTO y incluso poniendo 1 decimal(EN CASO QUE ALGUNO SEA NULO PONER 0): [nombre alimento]|[calorias]|[proteinas]|[carbohidratos]|[grasas]|[cantidad]",
    },
    { text: "output: " },
    { text: `input: ${inputText}` },
    { text: "output: " },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando la respuesta" });
  }
});

// Iniciar el servidorrrr
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
