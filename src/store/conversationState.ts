import AsyncStorage from "@react-native-async-storage/async-storage";
import { conversations as initialConversations } from "../data/mockConversations";

const STORAGE_KEY = "@conecta/conversation-state";

export type ConversationState = {
  read: Record<string, boolean>;
  favorite: Record<string, boolean>;
  pinned: Record<string, boolean>;
};

const defaultState: ConversationState = {
  read: {},
  favorite: {},
  pinned: {},
};

let state: ConversationState = { ...defaultState };

export async function loadConversationState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    state = raw
      ? { ...defaultState, ...JSON.parse(raw) }
      : { ...defaultState };
  } catch {
    state = { ...defaultState };
  }

  return state;
}

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the in-memory state if persistence fails.
  }
}

export function getConversationState() {
  return state;
}

export function getConversationsWithState() {
  return initialConversations.map((conversation) => ({
    ...conversation,
    unread:
      conversation.id in state.read
        ? state.read[conversation.id]
          ? 0
          : conversation.unread
        : conversation.unread,
    favorite:
      conversation.id in state.favorite
        ? state.favorite[conversation.id]
        : Boolean(conversation.favorite),
    pinned:
      conversation.id in state.pinned
        ? state.pinned[conversation.id]
        : Boolean(conversation.pinned),
  }));
}

export async function markConversationAsRead(conversationId: string) {
  state.read[conversationId] = true;
  await persist();
}

export async function setConversationFavorite(
  conversationId: string,
  favorite: boolean
) {
  state.favorite[conversationId] = favorite;
  await persist();
}

export async function setConversationPinned(
  conversationId: string,
  pinned: boolean
) {
  state.pinned[conversationId] = pinned;
  await persist();
}
