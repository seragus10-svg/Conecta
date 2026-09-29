import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export function MessageBubble({
  text, incoming, time,
}: { text: string; incoming?: boolean; time?: string }) {
  return (
    <View style={[styles.wrap, incoming ? styles.left : styles.right]}>
      <View style={[styles.bubble, incoming ? styles.incoming : styles.outgoing]}>
        <Text style={styles.text}>{text}</Text>
        {time && (
          <Text style={styles.time}>
            {time}{!incoming ? "  ✓✓" : ""}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", flexDirection: "row" },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
  bubble: { maxWidth: "80%", paddingHorizontal: 13, paddingVertical: 9, borderRadius: 16 },
  incoming: { backgroundColor: colors.surfaceElevated, borderBottomLeftRadius: 4 },
  outgoing: { backgroundColor: colors.primaryDark, borderBottomRightRadius: 4 },
  text: { color: colors.textPrimary, fontSize: 15, lineHeight: 20 },
  time: { color: colors.textMuted, fontSize: 10, textAlign: "right", marginTop: 3 },
});
