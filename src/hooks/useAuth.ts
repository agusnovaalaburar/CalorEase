// src/hooks/useAuth.ts
import { useEffect, useState, useCallback } from "react";
import { api, setAuthToken } from "@/services/api";
import type { Usuario, AuthResponse } from "@/types";

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => Boolean(localStorage.getItem("authToken")));
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false); // indica que terminó de validar token

  useEffect(() => {
    const t = localStorage.getItem("authToken");
    if (t) {
      setAuthToken(t, false);
      setToken(t);

      (async () => {
        setLoading(true);
        try {
          const r = await api.get<Usuario>("me", true);
          if (r.ok && r.data) {
            setUsuario(r.data);
            setIsLoggedIn(true);
          } else {
            console.warn("Token inválido o /me falló:", r);
            setAuthToken(null, true);
            setToken(null);
            setUsuario(null);
            setIsLoggedIn(false);
          }
        } catch (err) {
          console.error("Error validando token:", err);
          setAuthToken(null, true);
          setToken(null);
          setUsuario(null);
          setIsLoggedIn(false);
        } finally {
          setLoading(false);
          setLoaded(true);
        }
      })();
    } else {
      setLoaded(true);
    }
  }, []);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("login", payload, false);
      if (!res.ok) return { ok: false, status: res.status, error: res.error ?? res.data };
      const data = res.data as AuthResponse;
      if (!data?.token || !data?.usuario) return { ok: false, status: res.status, error: "Respuesta inválida del servidor" };

      setAuthToken(data.token, true);
      setToken(data.token);
      setUsuario(data.usuario);
      setIsLoggedIn(true);
      return { ok: true, data };
    } catch (err) {
      return { ok: false, status: 0, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: any) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("register", payload, false);
      if (!res.ok) return { ok: false, status: res.status, error: res.error ?? res.data };
      const data = res.data as AuthResponse;
      if (!data?.token || !data?.usuario) return { ok: false, status: res.status, error: "Respuesta inválida del servidor" };

      setAuthToken(data.token, true);
      setToken(data.token);
      setUsuario(data.usuario);
      setIsLoggedIn(true);
      return { ok: true, data };
    } catch (err) {
      return { ok: false, status: 0, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.post("logout", null, true);
      setAuthToken(null, true);
      setToken(null);
      setUsuario(null);
      setIsLoggedIn(false);
      if (!res.ok) return { ok: false, status: res.status, error: res.error ?? res.data };
      return { ok: true };
    } catch (err) {
      setAuthToken(null, true);
      setToken(null);
      setUsuario(null);
      setIsLoggedIn(false);
      return { ok: false, status: 0, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMe = useCallback(async () => {
    const t = localStorage.getItem("authToken");
    if (!t) return { ok: false, status: 0 };

    setLoading(true);
    try {
      const res = await api.get<Usuario>("me", true);
      if (res.ok && res.data) {
        setUsuario(res.data);
        setIsLoggedIn(true);
        return { ok: true, data: res.data };
      } else {
        setAuthToken(null, true);
        setToken(null);
        setUsuario(null);
        setIsLoggedIn(false);
        return { ok: false, status: res.status };
      }
    } catch (err) {
      setAuthToken(null, true);
      setToken(null);
      setUsuario(null);
      setIsLoggedIn(false);
      return { ok: false, status: 0, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    usuario,
    token,
    isLoggedIn,
    loading,
    loaded, // nuevo
    login,
    register,
    logout,
    refreshMe,
  };
}