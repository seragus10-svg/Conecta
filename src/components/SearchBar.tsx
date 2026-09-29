import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
};

export function SearchBar({
  placeholder = "Buscar...",
  value,
  onChangeText,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value ? (
        <Ionicons name="close-circle" size={19} color={colors.textMuted} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    paddingVertical: 0,
  },
});
