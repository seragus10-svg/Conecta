import "dotenv/config";
import express from "express";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

const {
  PORT = 3000,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_CLIENT_SECRET,
  INSTAGRAM_REDIRECT_URI,
  CONECTA_APP_REDIRECT_URI = "conecta://oauth/instagram",
  INSTAGRAM_SCOPES = "instagram_business_basic",
  TOKEN_ENCRYPTION_KEY,
} = process.env;

const required = [
  ["SUPABASE_URL", SUPABASE_URL],
  ["SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY],
  ["INSTAGRAM_CLIENT_ID", INSTAGRAM_CLIENT_ID],
  ["INSTAGRAM_CLIENT_SECRET", INSTAGRAM_CLIENT_SECRET],
  ["INSTAGRAM_REDIRECT_URI", INSTAGRAM_REDIRECT_URI],
  ["TOKEN_ENCRYPTION_KEY", TOKEN_ENCRYPTION_KEY],
];
for (const [name, value] of required) {
  if (!value) throw new Error(`Falta variable de entorno: ${name}`);
}
if (!/^[0-9a-fA-F]{64}$/.test(TOKEN_ENCRYPTION_KEY)) {
  throw new Error("TOKEN_ENCRYPTION_KEY debe contener exactamente 64 caracteres hexadecimales.");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function createState() {
  return crypto.randomBytes(32).toString("base64url");
}
function encryptAccessToken(token) {
  const key = Buffer.from(TOKEN_ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((b) => b.toString("base64url")).join(".");
}
function buildAppRedirect(params) {
  const url = new URL(CONECTA_APP_REDIRECT_URI);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  return url.toString();
}
function redirectError(res, code) {
  return res.redirect(buildAppRedirect({ success: 0, error: code }));
}
async function getAuthenticatedUser(req) {
  const auth = req.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(match[1]);
  if (error || !data.user) return null;
  return data.user;
}

app.get("/health", (_req, res) => res.json({ ok: true, service: "conecta-instagram-oauth" }));

app.post("/oauth/instagram/start", async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ ok: false, message: "Sesión no válida." });

    const state = createState();
    const stateHash = sha256(state);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin.from("oauth_states").insert({
      user_id: user.id,
      provider: "instagram",
      state_hash: stateHash,
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      expires_at: expiresAt,
    });
    if (error) throw error;

    const url = new URL("https://www.instagram.com/oauth/authorize");
    url.searchParams.set("client_id", INSTAGRAM_CLIENT_ID);
    url.searchParams.set("redirect_uri", INSTAGRAM_REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", INSTAGRAM_SCOPES);
    url.searchParams.set("state", state);

    return res.json({ ok: true, authorizationUrl: url.toString(), expiresAt });
  } catch (error) {
    console.error("oauth start:", error);
    return res.status(500).json({ ok: false, message: "No se pudo iniciar OAuth." });
  }
});

app.get("/oauth/instagram/callback", async (req, res) => {
  const { code, state, error, error_reason: errorReason } = req.query;
  try {
    if (error) return redirectError(res, String(errorReason || error).slice(0, 120));
    if (typeof code !== "string" || typeof state !== "string") return redirectError(res, "invalid_callback");

    const stateHash = sha256(state);
    const { data: stateRow, error: stateError } = await supabaseAdmin
      .from("oauth_states")
      .select("id,user_id,redirect_uri")
      .eq("state_hash", stateHash)
      .eq("provider", "instagram")
      .maybeSingle();
    if (stateError || !stateRow) return redirectError(res, "invalid_state");

    const { data: consumed, error: consumeError } = await supabaseAdmin.rpc("consume_instagram_oauth_state", {
      p_state_hash: stateHash,
      p_user_id: stateRow.user_id,
      p_redirect_uri: stateRow.redirect_uri,
    });
    if (consumeError || !consumed?.[0]?.valid) return redirectError(res, consumed?.[0]?.reason || "invalid_state");

    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: INSTAGRAM_CLIENT_ID,
        client_secret: INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: INSTAGRAM_REDIRECT_URI,
        code,
      }),
    });
    const tokenBody = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenBody.access_token) {
      console.error("instagram token exchange:", tokenBody);
      return redirectError(res, "token_exchange_failed");
    }

    let accessToken = tokenBody.access_token;
    let expiresIn = Number(tokenBody.expires_in || 0);
    try {
      const longUrl = new URL("https://graph.instagram.com/access_token");
      longUrl.searchParams.set("grant_type", "ig_exchange_token");
      longUrl.searchParams.set("client_secret", INSTAGRAM_CLIENT_SECRET);
      longUrl.searchParams.set("access_token", accessToken);
      const longResponse = await fetch(longUrl);
      const longBody = await longResponse.json();
      if (longResponse.ok && longBody.access_token) {
        accessToken = longBody.access_token;
        expiresIn = Number(longBody.expires_in || expiresIn);
      }
    } catch (exchangeError) {
      console.warn("long-lived token exchange skipped:", exchangeError);
    }

    const profileUrl = new URL("https://graph.instagram.com/me");
    profileUrl.searchParams.set("fields", "id,username");
    profileUrl.searchParams.set("access_token", accessToken);
    const profileResponse = await fetch(profileUrl);
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.id) {
      console.error("instagram profile:", profile);
      return redirectError(res, "profile_fetch_failed");
    }

    const encrypted = encryptAccessToken(accessToken);
    const expiresAt = expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000).toISOString() : null;
    const { error: upsertError } = await supabaseAdmin.from("connected_accounts").upsert({
      user_id: stateRow.user_id,
      platform: "instagram",
      external_account_id: String(profile.id),
      account_name: profile.username || "Instagram",
      access_token_encrypted: encrypted,
      refresh_token_encrypted: null,
      expires_at: expiresAt,
      capabilities: { instagram_business_basic: true },
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,platform" });
    if (upsertError) throw upsertError;

    return res.redirect(buildAppRedirect({ success: 1 }));
  } catch (error) {
    console.error("oauth callback:", error);
    return redirectError(res, "server_error");
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ ok: false, message: "Error interno." });
});

app.listen(Number(PORT), () => console.log(`Conecta OAuth backend escuchando en ${PORT}`));
