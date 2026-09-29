import AsyncStorage from "@react-native-async-storage/async-storage";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const USERS_KEY = "@conecta/users";
const SESSION_KEY = "@conecta/session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

async function localUsers(): Promise<any[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function localRegister(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await localUsers();
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }
  const user = {
    id: `local_${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  const session = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

async function localLogin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await localUsers();
  const user = users.find((u) => u.email === normalizedEmail && u.password === password);
  if (!user) throw new Error("Correo o contraseña incorrectos.");
  const session = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function register(name: string, email: string, password: string): Promise<SessionUser> {
  if (!isSupabaseConfigured || !supabase) return localRegister(name, email, password);

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name: name.trim() } },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("No se pudo crear la cuenta.");

  if (!data.session) {
    throw new Error("Cuenta creada. Revisá tu correo para confirmar la cuenta antes de ingresar.");
  }

  return {
    id: data.user.id,
    name: name.trim(),
    email: data.user.email ?? email.trim().toLowerCase(),
    createdAt: data.user.created_at,
  };
}

export async function login(email: string, password: string): Promise<SessionUser> {
  if (!isSupabaseConfigured || !supabase) return localLogin(email, password);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("No se pudo iniciar sesión.");

  return {
    id: data.user.id,
    name: String(data.user.user_metadata?.name ?? data.user.email ?? "Usuario"),
    email: data.user.email ?? email.trim().toLowerCase(),
    createdAt: data.user.created_at,
  };
}

export async function logout() {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return;
  }
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getSession(): Promise<SessionUser | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return null;
    return {
      id: user.id,
      name: String(user.user_metadata?.name ?? user.email ?? "Usuario"),
      email: user.email ?? "",
      createdAt: user.created_at,
    };
  }

  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
