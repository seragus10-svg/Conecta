import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { Conversation } from "@/data/mockConversations";

const platformColor = {
  Instagram: colors.instagram,
  WhatsApp: colors.whatsapp,
  TikTok: colors.tiktok,
  Facebook: colors.facebook,
};

type Props = {
  conversation: Conversation;
  onPress: () => void;
  onToggleFavorite: () => void;
  onTogglePinned: () => void;
};

export function ConversationItem({
  conversation,
  onPress,
  onToggleFavorite,
  onTogglePinned,
}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{conversation.name.charAt(0)}</Text>
        <View
          style={[
            styles.platformDot,
            { backgroundColor: platformColor[conversation.platform] },
          ]}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={styles.name} numberOfLines={1}>
            {conversation.name}
          </Text>
          <Text style={styles.time}>{conversation.time}</Text>
        </View>
        <View style={styles.bottomLine}>
          <Text style={styles.message} numberOfLines={1}>
            {conversation.message}
          </Text>
          <View style={styles.actions}>
            <Pressable
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation();
                onToggleFavorite();
              }}
              accessibilityRole="button"
              accessibilityLabel={
                conversation.favorite
                  ? `Quitar ${conversation.name} de favoritos`
                  : `Agregar ${conversation.name} a favoritos`
              }
              style={styles.actionButton}
            >
              <Ionicons
                name={conversation.favorite ? "star" : "star-outline"}
                size={17}
                color={conversation.favorite ? colors.warning : colors.textMuted}
              />
            </Pressable>

            <Pressable
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation();
                onTogglePinned();
              }}
              accessibilityRole="button"
              accessibilityLabel={
                conversation.pinned
                  ? `Desfijar ${conversation.name}`
                  : `Fijar ${conversation.name}`
              }
              style={styles.actionButton}
            >
              <Ionicons
                name={conversation.pinned ? "pin" : "pin-outline"}
                size={17}
                color={conversation.pinned ? colors.primaryLight : colors.textMuted}
              />
            </Pressable>

            {!!conversation.unread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{conversation.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 76,
    paddingVertical: 12,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarText: { color: colors.textPrimary, fontSize: 18, fontWeight: "700" },
  platformDot: {
    position: "absolute",
    right: -1,
    bottom: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.background,
  },
  body: { flex: 1, marginLeft: 13, justifyContent: "center" },
  topLine: { flexDirection: "row", justifyContent: "space-between" },
  name: { color: colors.textPrimary, fontSize: 15, fontWeight: "700", flex: 1 },
  time: { color: colors.textMuted, fontSize: 11, marginLeft: 8 },
  bottomLine: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  message: { color: colors.textSecondary, fontSize: 13, flex: 1 },
  actions: { flexDirection: "row", alignItems: "center", gap: 5, marginLeft: 8 },
  actionButton: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.textPrimary, fontSize: 11, fontWeight: "700" },
});
