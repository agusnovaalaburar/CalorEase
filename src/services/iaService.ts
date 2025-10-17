// src/services/iaService.ts
/**
 * IA service wrapper
 * - Usa import.meta.env.VITE_LAN_IP y import.meta.env.PORT (Vite).
 * - Provee analyzeFood() y generateDiet() con timeout y parse seguro.
 *
 * NOTA: No uses claves secretas en el frontend. GEMINI_API_KEY debe estar en el backend.
 */

type IAResult<T = any> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; data?: T | null; raw?: string | null; error?: any };

const IA_HOST = (import.meta.env.VITE_LAN_IP as string) ?? "127.0.0.1";
const IA_PORT = (import.meta.env.PORT as string) ?? "5000";
const IA_URL = `http://${IA_HOST}:${IA_PORT}`.replace(/\/+$/, "");

/** Helper: fetch with timeout and safe parse */
async function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
  timeoutMs = 15000
): Promise<{ ok: boolean; status: number; parsed?: any; raw?: string; error?: any }> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts });
    clearTimeout(id);
    const raw = await res.text();
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      return { ok: res.ok, status: res.status, parsed, raw };
    } catch {
      // no JSON
      return { ok: res.ok, status: res.status, parsed: null, raw };
    }
  } catch (err) {
    clearTimeout(id);
    return { ok: false, status: 0, error: err };
  }
}

/**
 * analyzeFood
 * - food: descripción libre de la comida
 * - user: opcional { peso, altura, edad, objetivo, ... }
 * - timeoutMs: opcional timeout en ms (por defecto 15s)
 */
export async function analyzeFood(food: string, user?: Record<string, any>, timeoutMs = 15000): Promise<IAResult> {
  if (!food || !food.trim()) {
    return { ok: false, status: 400, error: "Campo 'food' vacío" };
  }

  const url = `${IA_URL}/analyze-food`;
  const body = { food, user }; // ✅ backend espera "food"

  const res = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    },
    timeoutMs
  );

  if (!res.ok) {
    return { ok: false, status: res.status || 0, data: res.parsed ?? null, raw: res.raw ?? null, error: res.error };
  }
  return { ok: true, status: res.status, data: res.parsed };
}

/**
 * generateDiet
 * - profile: datos del usuario (peso, altura, edad, objetivo, preferencias, etc.)
 * - options: { dias, comidasPorDia, caloriasMeta, exclusiones, ... }
 * - timeoutMs: opcional (por defecto 30s porque puede demorar más)
 */
export async function generateDiet(
  profile: Record<string, any>,
  options: Record<string, any> = {},
  timeoutMs = 30000
): Promise<IAResult> {
  const url = `${IA_URL}/generate-diet`;
  const body = { profile, options };

  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  }, timeoutMs);

  if (!res.ok) {
    return { ok: false, status: res.status || 0, data: res.parsed ?? null, raw: res.raw ?? null, error: res.error };
  }
  return { ok: true, status: res.status, data: res.parsed };
}

/** Exponer la URL para debug si hace falta */
export function getIaUrl() {
  return IA_URL;
}