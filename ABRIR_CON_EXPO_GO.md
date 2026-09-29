# Abrir Conecta en tu teléfono con Expo Go

## 1. En la computadora

Instalá Node.js y luego, dentro de la carpeta del proyecto:

```bash
npm install
```

## 2. Iniciar Conecta

La opción más simple:

```bash
npm start
```

Se abrirá Expo y aparecerá un **código QR** en la terminal o en la página de desarrollo.

## 3. En Android

1. Instalá **Expo Go** desde Google Play.
2. Abrí Expo Go.
3. Elegí **Scan QR code / Escanear código QR**.
4. Escaneá el QR que muestra Expo en la computadora.
5. Esperá a que cargue Conecta.

## Si el teléfono no logra conectarse

Asegurate de que la computadora y el teléfono estén conectados a la misma red Wi‑Fi.

Si aun así no funciona, en la computadora ejecutá:

```bash
npm run start:tunnel
```

Expo generará una conexión mediante túnel. Volvé a escanear el QR.

## Importante

- No hace falta publicar Conecta en Internet para esta prueba.
- El QR es generado por Expo al ejecutar el proyecto.
- Para cambiar el código y ver los cambios, guardá los archivos y Expo actualizará la aplicación.
- El prototipo incluye la pantalla Mensajes, búsqueda, filtros, favoritos, fijados, ordenamiento y estado leído persistente.

## Comando rápido

```bash
npm install
npm run start:tunnel
```

Después: **Expo Go → Escanear QR → apuntar al QR de la computadora**.
