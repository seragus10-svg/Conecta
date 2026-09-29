import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";
import { colors } from "../../src/theme/colors";
import { login } from "../../src/auth/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Faltan datos", "Ingresá tu correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(app)/messages");
    } catch (error) {
      Alert.alert("No pudimos ingresar", error instanceof Error ? error.message : "Revisá tus datos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Conecta</Text>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Entrá a todas tus conversaciones desde un solo lugar.</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Ingresando..." : "Iniciar sesión"}</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.muted}>¿No tenés cuenta? </Text>
        <Link href="/(auth)/register" style={styles.link}>Crear cuenta</Link>
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
