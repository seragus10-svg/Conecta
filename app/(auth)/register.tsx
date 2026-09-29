import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";
import { colors } from "../../src/theme/colors";
import { register } from "../../src/auth/authStore";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Faltan datos", "Completá todos los campos.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Contraseña", "Usá al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Contraseña", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      router.replace("/(app)/messages");
    } catch (error) {
      Alert.alert("No pudimos crear la cuenta", error instanceof Error ? error.message : "Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Conecta</Text>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Tu cuenta para centralizar tus conversaciones.</Text>

      <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Repetir contraseña" placeholderTextColor={colors.textMuted} value={confirm} onChangeText={setConfirm} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creando..." : "Crear cuenta"}</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.muted}>¿Ya tenés cuenta? </Text>
        <Link href="/(auth)/login" style={styles.link}>Iniciar sesión</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24 },
  logo: { color: colors.primaryLight, fontSize: 38, fontWeight: "800", marginBottom: 12 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 28 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, color: colors.textPrimary, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12 },
  button: { backgroundColor: colors.primary, borderRadius: 14, alignItems: "center", paddingVertical: 15, marginTop: 8 },
  buttonText: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  muted: { color: colors.textSecondary },
  link: { color: colors.primaryLight, fontWeight: "700" },
});
