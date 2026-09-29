import AsyncStorage from "@react-native-async-storage/async-storage";

export type Platform = "Instagram" | "WhatsApp" | "TikTok" | "Facebook";
export type ConnectedAccount = {
  platform: Platform;
  connected: boolean;
  accountName?: string;
};

const KEY = "@conecta/connected-accounts";
const DEFAULTS: ConnectedAccount[] = [
  { platform: "Instagram", connected: false },
  { platform: "WhatsApp", connected: false },
  { platform: "TikTok", connected: false },
  { platform: "Facebook", connected: false },
];

export async function getConnectedAccounts() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : DEFAULTS;
}

export async function setConnectedAccount(platform: Platform, accountName = "Cuenta de prueba") {
  const accounts = await getConnectedAccounts();
  await AsyncStorage.setItem(KEY, JSON.stringify(accounts.map((a: ConnectedAccount) =>
    a.platform === platform ? { ...a, connected: true, accountName } : a
  )));
}

export async function disconnectAccount(platform: Platform) {
  const accounts = await getConnectedAccounts();
  await AsyncStorage.setItem(KEY, JSON.stringify(accounts.map((a: ConnectedAccount) =>
    a.platform === platform ? { platform, connected: false } : a
  )));
}
