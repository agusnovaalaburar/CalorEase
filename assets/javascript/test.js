const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors"); // para permitir peticiones de otros dominios (CORS)

const app = express();
const port = 3000;

// Configurar el servidor para manejar peticiones JSON
app.use(express.json());
app.use(cors()); // Habilitar CORS

// Crear instancia de Google Generative AI
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

// Ruta para recibir la entrada del usuario y generar la respuesta
app.post("/generate", async (req, res) => {
  const inputText = req.body.text;

  const parts = [
    {
      text: "input: sos un asistente de nutricionb",
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
