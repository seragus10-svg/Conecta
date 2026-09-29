import React, { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { colors } from "@/theme/colors";
import { MessageBubble } from "@/components/MessageBubble";
import { conversations, messages } from "@/data/mockConversations";

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  React.useEffect(() => {
    if (conversationId) {
      markConversationAsRead(conversationId);
    }
  }, [conversationId]);

  const conversation = conversations.find((item) => item.id === conversationId);
  const chatMessages = messages[conversationId ?? ""] ?? [];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <View style={styles.backCircle}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{conversation?.avatar ?? "?"}</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{conversation?.name ?? "Conversación"}</Text>
          <Text style={styles.status}>
            {conversation?.online ? "En línea" : conversation?.platform ?? ""}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
      </View>

      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messages}
        renderItem={({ item }) => (
          <MessageBubble
            text={
              item.type === "image"
                ? "📷  Foto"
                : item.type === "video"
                ? "▶️  Video"
                : item.type === "link"
                ? "🔗  Enlace"
                : item.text
            }
            incoming={item.incoming}
            time={item.time}
          />
        )}
      />

      <View style={styles.composer}>
        <Ionicons name="add-circle-outline" size={25} color={colors.textSecondary} />
        <View style={styles.input}>
          <Text style={styles.placeholder}>Escribí un mensaje...</Text>
        </View>
        <Ionicons name="mic-outline" size={24} color={colors.textSecondary} />
        <View style={styles.send}>
          <Ionicons name="send" size={17} color={colors.textPrimary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 55, paddingBottom: 13, paddingHorizontal: 15,
    backgroundColor: colors.surface, borderBottomWidth: 1,
    borderBottomColor: colors.border, flexDirection: "row", alignItems: "center",
  },
  backCircle: { width: 34, alignItems: "center" },
  avatar: {
    width: 42, height: 42, borderRadius: 21, marginLeft: 3,
    backgroundColor: colors.surfaceElevated, alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: colors.textPrimary, fontWeight: "800" },
  identity: { flex: 1, marginLeft: 10 },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  status: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  messages: { padding: 16, gap: 9 },
  composer: {
    minHeight: 64, paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
    flexDirection: "row", alignItems: "center", gap: 10,
  },
  input: {
    flex: 1, minHeight: 42, borderRadius: 21, backgroundColor: colors.surfaceElevated,
    justifyContent: "center", paddingHorizontal: 16,
  },
  placeholder: { color: colors.textMuted, fontSize: 14 },
  send: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
});
