import { Alert } from "react-native";
import { router } from "expo-router";
import { logout } from "../../../src/auth/authStore";

import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export default function ProfileScreen() {
  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Cuentas conectadas y configuración.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 60 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15, marginTop: 8 },
});
