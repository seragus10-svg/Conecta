# Conecta — conexión de Instagram

Esta versión incorpora el inicio y retorno del OAuth de Instagram desde **Conectar cuentas**.

Antes de probar: ejecutá el schema actualizado en Supabase, desplegá `backend/`, configurá `EXPO_PUBLIC_CONECTA_BACKEND_URL` y registrá en Meta/Instagram exactamente el mismo callback del backend.

Los secretos viven solo en el backend. El `state` se guarda como hash, se consume una sola vez y el token se cifra con AES-256-GCM antes de guardarlo.
