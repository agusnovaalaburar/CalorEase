const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

confirm;
const genAI = new GoogleGenerativeAI(AIzaSyDgdLETOQ7NbyJJcA0jzUgNy2k05UBjUNU);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const parts = [
    {
      text: "input: sos un asistente de nutricion, cuando te pasemos nombres de comidas separadas por coma deberas responder solo el numero de calorias aproximado que corresponda, el numero siguiente a la comida es la cantidad de porciones y cada comida esta separada por coma. nada mas que numeros y comas porfavor.",
    },
    { text: "output: " },
    { text: "input: pata de pollo 2, tomate 3" },
    { text: "output: " },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
  });
  console.log(result.response.text());
}

run();
