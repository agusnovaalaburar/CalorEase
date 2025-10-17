import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  peso: number | null;
  altura: number | null;
  edad: number | null;
  objetivo: string | null;
}

const API_URL = "http://127.0.0.1:8000/api";

export const Profile = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // si no hay token, redirige al home
      return;
    }

    fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUsuario(data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-6">Perfil de {usuario.nombre}</h1>

      <Card className="max-w-md">
        <CardContent className="space-y-4">
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Edad:</strong> {usuario.edad || "No especificado"}
          </p>
          <p>
            <strong>Peso:</strong> {usuario.peso || "No especificado"} kg
          </p>
          <p>
            <strong>Altura:</strong> {usuario.altura || "No especificado"} m
          </p>
          <p>
            <strong>Objetivo:</strong> {usuario.objetivo || "No especificado"}
          </p>

          <Button onClick={handleLogout} className="bg-red-500 text-white">
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};