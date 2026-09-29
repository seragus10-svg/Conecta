import React from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { startInstagramOAuth } from "../../../../src/lib/instagramOAuth";
import { colors } from "../../../../src/theme/colors";
import { ConnectedAccount, Platform, disconnectAccount, getConnectedAccounts, setConnectedAccount } from "../../../../src/store/connectedAccounts";

const META: Record<Platform, { icon: string; color: string; description: string }> = {
  Instagram: { icon: "◎", color: "#E1306C", description: "Conectá tu cuenta compatible de Instagram." },
  WhatsApp: { icon: "◉", color: "#25D366", description: "Preparado para WhatsApp Business." },
  TikTok: { icon: "♪", color: "#FFFFFF", description: "Preparado para las funciones compatibles de TikTok." },
  Facebook: { icon: "f", color: "#1877F2", description: "Conectá tu cuenta compatible de Facebook." },
};

export default function ConnectAccountsScreen() {
  const [accounts, setAccounts] = React.useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState<Platform | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setAccounts(await getConnectedAccounts());
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
    const subscription = Linking.addEventListener("url", ({ url }) => handleInstagramOAuthReturn(url));
    Linking.getInitialURL().then((url) => { if (url) handleInstagramOAuthReturn(url); });
    return () => subscription.remove();
  }, [load]);

  async function handleInstagramOAuthReturn(url: string) {
    const parsed = Linking.parse(url);
    if (parsed.scheme !== "conecta" || parsed.path !== "oauth/instagram") return;
    if (parsed.queryParams?.success === "1") {
      await load();
      Alert.alert("Instagram conectado", "La cuenta de Instagram quedó conectada correctamente.");
      return;
    }
    const error = parsed.queryParams?.error;
    Alert.alert("No se pudo conectar Instagram", typeof error === "string" ? error : "La autorización no se completó.");
  }

  async function connect(platform: Platform) {
    setBusy(platform);
    try {
      if (platform === "Instagram") {
        const authorizationUrl = await startInstagramOAuth();
        await Linking.openURL(authorizationUrl);
        return;
      }
      await setConnectedAccount(platform, `Cuenta de prueba de ${platform}`);
      await load();
      Alert.alert(platform, "Esta plataforma todavía está en modo de prueba.");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "No se pudo iniciar la conexión.");
    } finally {
      setBusy(null);
    }
  }

  function disconnect(platform: Platform) {
    Alert.alert(`Desconectar ${platform}`, "¿Querés desconectar esta cuenta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Desconectar", style: "destructive", onPress: async () => {
        setBusy(platform);
        await disconnectAccount(platform);
        await load();
        setBusy(null);
      }},
    ]);
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.primaryLight}/><Text style={styles.muted}>Cargando cuentas...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹</Text></TouchableOpacity>
        <View><Text style={styles.title}>Conectar cuentas</Text><Text style={styles.subtitle}>Reuní tus plataformas en un solo lugar.</Text></View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Tus cuentas</Text>
        <Text style={styles.infoText}>Acá vas a ver qué plataformas están vinculadas a Conecta.</Text>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.platform}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const meta = META[item.platform];
          const isBusy = busy === item.platform;
          return (
            <View style={styles.card}>
              <View style={[styles.icon, { borderColor: meta.color }]}>
                <Text style={[styles.iconText, { color: meta.color }]}>{meta.icon}</Text>
              </View>
              <View style={styles.content}>
                <View style={styles.nameRow}>
                  <Text style={styles.platform}>{item.platform}</Text>
                  <View style={[styles.status, item.connected ? styles.on : styles.off]}>
                    <View style={[styles.dot, item.connected ? styles.dotOn : styles.dotOff]}/>
                    <Text style={[styles.statusText, item.connected ? styles.textOn : styles.textOff]}>
                      {item.connected ? "Conectada" : "No conectada"}
                    </Text>
                  </View>
                </View>
                {item.accountName && <Text style={styles.account}>{item.accountName}</Text>}
                <Text style={styles.description}>{meta.description}</Text>
                <TouchableOpacity
                  disabled={isBusy}
                  onPress={() => item.connected ? disconnect(item.platform) : connect(item.platform)}
                  style={[styles.action, item.connected ? styles.disconnect : styles.connect]}
                >
                  {isBusy ? <ActivityIndicator color="#fff"/> : <Text style={styles.actionText}>{item.connected ? "Desconectar" : "Conectar"}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background,paddingHorizontal:20,paddingTop:22},
  center:{flex:1,backgroundColor:colors.background,justifyContent:"center",alignItems:"center"},
  muted:{color:colors.textSecondary,marginTop:10},
  header:{flexDirection:"row",alignItems:"center",marginBottom:22},
  back:{width:42,height:42,borderRadius:14,backgroundColor:colors.surface,alignItems:"center",justifyContent:"center",marginRight:12},
  backText:{color:colors.textPrimary,fontSize:34,lineHeight:36},
  title:{color:colors.textPrimary,fontSize:25,fontWeight:"800"},
  subtitle:{color:colors.textSecondary,fontSize:14,marginTop:4},
  info:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:18,padding:16,marginBottom:16},
  infoTitle:{color:colors.textPrimary,fontSize:16,fontWeight:"700"},
  infoText:{color:colors.textSecondary,fontSize:13,lineHeight:19,marginTop:5},
  card:{flexDirection:"row",backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:20,padding:15,marginBottom:12},
  icon:{width:48,height:48,borderRadius:16,borderWidth:1,alignItems:"center",justifyContent:"center",marginRight:13},
  iconText:{fontSize:25,fontWeight:"800"},
  content:{flex:1},
  nameRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  platform:{color:colors.textPrimary,fontSize:17,fontWeight:"700"},
  status:{flexDirection:"row",alignItems:"center",paddingHorizontal:8,paddingVertical:5,borderRadius:999},
  on:{backgroundColor:"rgba(34,197,94,0.12)"},off:{backgroundColor:"rgba(161,161,181,0.10)"},
  dot:{width:7,height:7,borderRadius:4,marginRight:5},dotOn:{backgroundColor:colors.success},dotOff:{backgroundColor:colors.textMuted},
  statusText:{fontSize:11,fontWeight:"700"},textOn:{color:colors.success},textOff:{color:colors.textSecondary},
  account:{color:colors.primaryLight,fontSize:12,marginTop:6},
  description:{color:colors.textSecondary,fontSize:12,lineHeight:17,marginTop:6},
  action:{minHeight:40,borderRadius:12,alignItems:"center",justifyContent:"center",marginTop:11},
  connect:{backgroundColor:colors.primary},disconnect:{backgroundColor:colors.surfaceElevated,borderWidth:1,borderColor:colors.border},
  actionText:{color:colors.textPrimary,fontSize:14,fontWeight:"700"},
});
