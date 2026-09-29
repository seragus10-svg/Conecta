export type Platform = "Instagram" | "WhatsApp" | "TikTok" | "Facebook";

export type Message = {
  id: string;
  conversationId: string;
  text: string;
  time: string;
  incoming: boolean;
  read: boolean;
  type?: "text" | "image" | "video" | "voice" | "link";
};

export type Conversation = {
  id: string;
  name: string;
  message: string;
  time: string;
  platform: Platform;
  avatar: string;
  unread?: number;
  favorite?: boolean;
  pinned?: boolean;
  online?: boolean;
};

export const conversations: Conversation[] = [
  {
    id: "001",
    name: "Sofía Martínez",
    message: "¿Llegaste bien? Avisame cuando puedas.",
    time: "00:42",
    platform: "WhatsApp",
    avatar: "SM",
    unread: 2,
    favorite: true,
    pinned: true,
    online: true,
  },
  {
    id: "002",
    name: "Martín López",
    message: "Mirá este video 😂",
    time: "00:31",
    platform: "TikTok",
    avatar: "ML",
    unread: 1,
  },
  {
    id: "003",
    name: "Taller SAG",
    message: "Tenemos novedades para vos.",
    time: "23:48",
    platform: "Instagram",
    avatar: "TS",
    favorite: true,
  },
  {
    id: "004",
    name: "Lucía Fernández",
    message: "Gracias! Nos vemos mañana.",
    time: "Ayer",
    platform: "Facebook",
    avatar: "LF",
  },
  {
    id: "005",
    name: "Nico",
    message: "Te mandé las fotos del viaje.",
    time: "Ayer",
    platform: "WhatsApp",
    avatar: "N",
    unread: 4,
  },
  {
    id: "006",
    name: "Agus ⭐",
    message: "Ese lugar está buenísimo.",
    time: "Lun",
    platform: "Instagram",
    avatar: "A",
    favorite: true,
    pinned: true,
  },
  {
    id: "007",
    name: "Carla",
    message: "¿Viste mi último mensaje?",
    time: "Dom",
    platform: "Facebook",
    avatar: "C",
    unread: 1,
  },
  {
    id: "008",
    name: "Tomás",
    message: "https://conecta.app",
    time: "Dom",
    platform: "TikTok",
    avatar: "T",
  },
  {
    id: "009",
    name: "Familia",
    message: "Mamá: Mañana almorzamos a las 13.",
    time: "Sáb",
    platform: "WhatsApp",
    avatar: "F",
    unread: 3,
    pinned: true,
  },
  {
    id: "010",
    name: "Valen",
    message: "❤️",
    time: "Vie",
    platform: "Instagram",
    avatar: "V",
  },
];

export const messages: Record<string, Message[]> = {
  "001": [
    { id: "001-1", conversationId: "001", text: "Holaa 👋 ¿Cómo estás?", time: "00:35", incoming: true, read: true },
    { id: "001-2", conversationId: "001", text: "Todo bien! Recién llegué.", time: "00:37", incoming: false, read: true },
    { id: "001-3", conversationId: "001", text: "¿Llegaste bien? Avisame cuando puedas.", time: "00:42", incoming: true, read: false },
    { id: "001-4", conversationId: "001", text: "Sí, tranqui. Gracias 😊", time: "00:43", incoming: false, read: true },
  ],
  "002": [
    { id: "002-1", conversationId: "002", text: "Encontré este video y me acordé de vos 😂", time: "00:28", incoming: true, read: false, type: "video" },
    { id: "002-2", conversationId: "002", text: "JAJAJA no puede ser 😂", time: "00:30", incoming: false, read: true },
    { id: "002-3", conversationId: "002", text: "Mirá este video 😂", time: "00:31", incoming: true, read: false, type: "video" },
  ],
  "003": [
    { id: "003-1", conversationId: "003", text: "Hola! ¿Cómo estás?", time: "23:40", incoming: true, read: true },
    { id: "003-2", conversationId: "003", text: "Todo bien, ¿qué novedades tienen?", time: "23:43", incoming: false, read: true },
    { id: "003-3", conversationId: "003", text: "Tenemos novedades para vos.", time: "23:48", incoming: true, read: true },
    { id: "003-4", conversationId: "003", text: "Te paso una foto para que la veas.", time: "23:49", incoming: true, read: true, type: "image" },
  ],
  "004": [
    { id: "004-1", conversationId: "004", text: "¿Te parece bien mañana?", time: "18:10", incoming: true, read: true },
    { id: "004-2", conversationId: "004", text: "Sí, perfecto. A las 10 entonces.", time: "18:14", incoming: false, read: true },
    { id: "004-3", conversationId: "004", text: "Gracias! Nos vemos mañana.", time: "18:15", incoming: true, read: true },
  ],
  "005": [
    { id: "005-1", conversationId: "005", text: "Llegamos hace un rato.", time: "16:20", incoming: true, read: true },
    { id: "005-2", conversationId: "005", text: "Buenísimo! ¿Cómo estuvo el viaje?", time: "16:24", incoming: false, read: true },
    { id: "005-3", conversationId: "005", text: "Muy bueno. Te mandé las fotos del viaje.", time: "16:29", incoming: true, read: false, type: "image" },
  ],
  "006": [
    { id: "006-1", conversationId: "006", text: "Ese lugar está buenísimo.", time: "14:05", incoming: true, read: true },
    { id: "006-2", conversationId: "006", text: "Mal! Tenemos que ir algún día.", time: "14:08", incoming: false, read: true },
  ],
  "007": [
    { id: "007-1", conversationId: "007", text: "Te escribí antes.", time: "11:32", incoming: true, read: false },
    { id: "007-2", conversationId: "007", text: "¿Viste mi último mensaje?", time: "11:35", incoming: true, read: false },
  ],
  "008": [
    { id: "008-1", conversationId: "008", text: "Te dejo el enlace que te comenté.", time: "09:15", incoming: true, read: true, type: "link" },
    { id: "008-2", conversationId: "008", text: "Dale, lo miro después.", time: "09:20", incoming: false, read: true },
  ],
  "009": [
    { id: "009-1", conversationId: "009", text: "¿Compramos algo para mañana?", time: "20:10", incoming: true, read: true },
    { id: "009-2", conversationId: "009", text: "Yo llevo la bebida.", time: "20:13", incoming: false, read: true },
    { id: "009-3", conversationId: "009", text: "Mamá: Mañana almorzamos a las 13.", time: "20:20", incoming: true, read: false },
  ],
  "010": [
    { id: "010-1", conversationId: "010", text: "Me encantó la foto ❤️", time: "19:40", incoming: true, read: true },
    { id: "010-2", conversationId: "010", text: "Gracias ❤️", time: "19:43", incoming: false, read: true },
    { id: "010-3", conversationId: "010", text: "❤️", time: "19:44", incoming: true, read: true },
  ],
};
