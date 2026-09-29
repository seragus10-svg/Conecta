import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";

export function FilterChip({
  label, active, onPress,
}: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 15, paddingVertical: 9, borderRadius: 999,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  activeText: { color: colors.textPrimary },
});
