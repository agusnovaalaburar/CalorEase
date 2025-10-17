const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

app.use(express.static(__dirname));

console.log("🔑 GEMINI_API_KEY loaded?", !!process.env.GEMINI_API_KEY);

const MODEL = "gemini-2.0-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const API_KEY = process.env.GEMINI_API_KEY;

// Helper para llamar a Gemini
async function callGemini(prompt) {
  const fetch = (await import("node-fetch")).default;
  const bodyToSend = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  console.log("▶️ Payload a Gemini:", bodyToSend);

  const apiRes = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyToSend),
  });

  const rawText = await apiRes.text();

  console.log(`⬅️ Respuesta cruda Gemini (status ${apiRes.status}):`, rawText);

  if (!apiRes.ok) {
    throw new Error(`Gemini API error ${apiRes.status}: ${rawText}`);
  }

  const jsonLLM = JSON.parse(rawText);
  const candidate = jsonLLM.candidates?.[0];
  let respuestaRaw = candidate.content.parts.map((p) => p.text).join("");

  // limpiar ```json
  const cleaned = respuestaRaw.replace(/```(?:json)?/g, "").trim();
  console.log("✅ Respuesta limpia:", cleaned);

  return cleaned;
}

// Ruta genérica
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("▶️ /api/gemini llamado con prompt:", prompt);
    const cleaned = await callGemini(prompt || "<sin prompt>");
    res.send(cleaned);
  } catch (err) {
    console.error("🔥 Error en /api/gemini:", err);
    res.status(500).json({ error: err.message });
  }
});

// Nueva ruta: analizar comida
app.post("/analyze-food", async (req, res) => {
  const { food } = req.body;
  console.log("▶️ /analyze-food llamado con food:", food);

  if (!food || typeof food !== "string") {
    return res.status(400).json({ error: "Falta el campo 'food'" });
  }

  // Aquí iría tu lógica de análisis, por ejemplo llamando a Gemini
  try {
    const fetch = (await import("node-fetch")).default;

    const prompt = `Analiza esta comida: ${food}`;

    const apiRes = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const rawText = await apiRes.text();
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: rawText });
    }

    const jsonLLM = JSON.parse(rawText);
    const candidate = jsonLLM.candidates?.[0];
    const respuesta = candidate.content.parts.map((p) => p.text).join("");

    console.log("✅ /analyze-food respuesta cruda:", respuesta);
    res.json({ ok: true, data: respuesta });
  } catch (err) {
    console.error("🔥 Error en /analyze-food:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Escuchar
const LAN_IP = process.env.VITE_LAN_IP || "localhost"; 
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor escuchando en http://0.0.0.0:${PORT}`);
  console.log(`🌐 LAN disponible en http://${LAN_IP}:${PORT}`);
});