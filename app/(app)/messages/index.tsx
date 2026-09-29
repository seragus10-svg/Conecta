import React, { FlatList, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { ConversationItem } from "@/components/ConversationItem";
import { SearchBar } from "@/components/SearchBar";
import { FilterChip } from "@/components/FilterChip";
import { conversations, messages, Platform } from "@/data/mockConversations";

const filters: Array<"Todos" | Platform> = [
  "Todos",
  "Instagram",
  "WhatsApp",
  "TikTok",
  "Facebook",
];

export default function MessagesScreen() {
  React.useEffect(() => {
    loadConversationState().then(() => {
      setConversationList(getConversationsWithState());
    });
  }, []);

  const [conversationList, setConversationList] = useState(getConversationsWithState());

  useFocusEffect(
    React.useCallback(() => {
      setConversationList(getConversationsWithState());
    }, [])
  );

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"Todos" | Platform>("Todos");
  const [sortMode, setSortMode] = useState<"recent" | "unread">("recent");
  const [conversationState, setConversationState] = useState(
    () =>
      Object.fromEntries(
        conversations.map((conversation) => [
          conversation.id,
          { favorite: !!conversation.favorite, pinned: !!conversation.pinned },
        ])
      ) as Record<string, { favorite: boolean; pinned: boolean }>
  );

  const toggleFavorite = (conversationId: string) => {
    setConversationState((current) => ({
      ...current,
      [conversationId]: {
        ...(current[conversationId] ?? { favorite: false, pinned: false }),
        favorite: !(current[conversationId]?.favorite ?? false),
      },
    }));
  };

  const togglePinned = (conversationId: string) => {
    setConversationState((current) => ({
      ...current,
      [conversationId]: {
        ...(current[conversationId] ?? { favorite: false, pinned: false }),
        pinned: !(current[conversationId]?.pinned ?? false),
      },
    }));
  };

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    const filtered = conversationList.filter((conversation) => {
      const matchesPlatform =
        activeFilter === "Todos" || conversation.platform === activeFilter;

      if (!matchesPlatform) return false;
      if (!query) return true;

      const conversationMessages = messages[conversation.id] ?? [];
      const matchesName = conversation.name.toLocaleLowerCase().includes(query);
      const matchesPreview = conversation.message
        .toLocaleLowerCase()
        .includes(query);
      const matchesMessage = conversationMessages.some((message) =>
        message.text.toLocaleLowerCase().includes(query)
      );

      return matchesName || matchesPreview || matchesMessage;
    });

    return [...filtered].sort((a, b) => {
      // Fijados siempre quedan arriba.
      if (Boolean(a.pinned) !== Boolean(b.pinned)) {
        return a.pinned ? -1 : 1;
      }

      // Dentro de cada grupo, favoritos tienen prioridad.
      if (Boolean(a.favorite) !== Boolean(b.favorite)) {
        return a.favorite ? -1 : 1;
      }

      if (sortMode === "unread") {
        const unreadA = a.unread ?? 0;
        const unreadB = b.unread ?? 0;

        if (unreadA !== unreadB) {
          return unreadB - unreadA;
        }
      }

      // Los datos de prueba ya están ordenados de más reciente a más antiguo.
      return 0;
    });
  }, [activeFilter, search, sortMode, conversationList]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Conecta</Text>
          <Text style={styles.subtitle}>Todo en un solo lugar</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons
            name="ellipsis-horizontal"
            size={22}
            color={colors.textPrimary}
          />
        </View>
      </View>

      <SearchBar
        placeholder="Buscar por nombre o mensaje..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.sortRow}>
        <Text style={styles.sectionTitle}>Conversaciones</Text>
        <View style={styles.sortControl}>
          <FilterChip
            label="Más recientes"
            active={sortMode === "recent"}
            onPress={() => setSortMode("recent")}
          />
          <FilterChip
            label="No leídas"
            active={sortMode === "unread"}
            onPress={() => setSortMode("unread")}
          />
        </View>
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <FlatList
            horizontal
            data={filters}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
            renderItem={({ item }) => (
              <FilterChip
                label={item}
                active={activeFilter === item}
                onPress={() => setActiveFilter(item)}
              />
            )}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="search-outline"
                size={26}
                color={colors.primaryLight}
              />
            </View>
            <Text style={styles.emptyTitle}>No encontramos conversaciones</Text>
            <Text style={styles.emptyText}>
              Probá con otro nombre, mensaje o filtro.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const previous = filteredConversations[index - 1];
          const isStartPinned =
            Boolean(item.pinned) && !Boolean(previous?.pinned);
          const isStartUnread =
            Boolean(item.unread) &&
            !Boolean(previous?.unread) &&
            !Boolean(item.pinned);
          const isStartOther =
            !item.pinned &&
            !item.unread &&
            (index === 0 || Boolean(previous?.pinned) || Boolean(previous?.unread));

          return (
            <View>
              {isStartPinned && (
                <SectionHeader icon="pin" label="Fijadas" />
              )}
              {isStartUnread && (
                <SectionHeader icon="mail-unread" label="No leídas" />
              )}
              {isStartOther && (
                <SectionHeader
                  icon="chatbubbles-outline"
                  label="Otras conversaciones"
                />
              )}
              <ConversationItem
                conversation={item}
                onPress={() =>
                  router.push(`/(app)/messages/conversation/${item.id}`)
                }
                onToggleFavorite={async () => {
                  const next = !Boolean(item.favorite);
                  await setConversationFavorite(item.id, next);
                  setConversationList(getConversationsWithState());
                }}
                onTogglePinned={async () => {
                  const next = !Boolean(item.pinned);
                  await setConversationPinned(item.id, next);
                  setConversationList(getConversationsWithState());
                }}
              />
            </View>
          );
        }}
        contentContainerStyle={[
          styles.list,
          filteredConversations.length === 0 && styles.listEmpty,
        ]}
      />

      <View style={styles.fab}>
        <Ionicons name="create-outline" size={24} color={colors.textPrimary} />
      </View>
    </View>
  );
}

function SectionHeader({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={16} color={colors.primaryLight} />
      <Text style={styles.sectionHeaderText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 58,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 2,
    fontSize: 13,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  filters: {
    gap: 8,
    paddingVertical: 14,
  },
  sortRow: {
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  sortControl: {
    flexDirection: "row",
    gap: 6,
  },
  list: {
    paddingBottom: 90,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
  },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 82,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
