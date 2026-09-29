import { supabase } from "./supabase";
const BACKEND_URL = process.env.EXPO_PUBLIC_CONECTA_BACKEND_URL;
export async function startInstagramOAuth() {
  if (!BACKEND_URL) throw new Error("Falta EXPO_PUBLIC_CONECTA_BACKEND_URL.");
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Tu sesión de Conecta no está activa.");
  const response = await fetch(`${BACKEND_URL.replace(/\/$/, "")}/oauth/instagram/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.authorizationUrl) throw new Error(body.message || "No se pudo iniciar la conexión con Instagram.");
  return body.authorizationUrl as string;
}
