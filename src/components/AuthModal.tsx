// src/components/AuthModal.tsx
import { useState } from "react";

const API = "http://127.0.0.1:8000/api";

interface AuthModalProps {
  type: "login" | "register";
}

export function AuthModal({ type }: AuthModalProps) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    password_confirmation: "",
    peso: "",
    altura: "",
    edad: "",
    objetivo: "mantener",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const endpoint = type === "register" ? "register" : "login";
      const payload =
        type === "register"
          ? {
              nombre: form.nombre,
              email: form.email,
              password: form.password,
              password_confirmation: form.password_confirmation,
              peso: Number(form.peso),
              altura: Number(form.altura),
              edad: Number(form.edad),
              objetivo: form.objetivo,
            }
          : {
              email: form.email,
              password: form.password,
            };

      const res = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {type === "register" ? "Registro" : "Iniciar sesión"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {type === "register" && (
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        {type === "register" && (
          <>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmar Contraseña"
              value={form.password_confirmation}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
            <input
              type="number"
              name="peso"
              placeholder="Peso (kg)"
              value={form.peso}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
            <input
              type="number"
              name="altura"
              placeholder="Altura (cm)"
              value={form.altura}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
            <input
              type="number"
              name="edad"
              placeholder="Edad"
              value={form.edad}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
            <select
              name="objetivo"
              value={form.objetivo}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="mantener">Mantener</option>
              <option value="bajar">Bajar de peso</option>
              <option value="subir">Subir de peso</option>
            </select>
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading
            ? "Enviando..."
            : type === "register"
            ? "Registrarse"
            : "Iniciar Sesión"}
        </button>
      </form>

      {response && (
        <pre className="mt-4 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
