import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actividad</Text>
      <Text style={styles.subtitle}>Acá aparecerán tus notificaciones.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 60 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15, marginTop: 8 },
});
