# Conecta — Base online con Supabase

## 1. Crear el proyecto
1. Entrá al dashboard de Supabase.
2. Creá un proyecto nuevo.
3. Abrí **Connect** y copiá el Project URL y la Publishable Key.

## 2. Crear las tablas
1. Abrí **SQL Editor**.
2. Copiá todo el archivo `database/schema-supabase.sql`.
3. Ejecutá el SQL.

Esto crea `profiles` y `connected_accounts`, con Row Level Security para que cada usuario pueda acceder únicamente a sus propios datos.

## 3. Configurar Conecta
Copiá `.env.example` como `.env` y completá:

EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...

No publiques claves secretas en la app.

## 4. Instalar dependencias
npm install

## 5. Ejecutar
npm run start:tunnel

Cuando las variables estén configuradas, el registro/login usará Supabase automáticamente. Si no están configuradas, Conecta mantiene el modo local para pruebas.

## 6. Correo de confirmación
En producción conviene mantener activa la confirmación de correo. Supabase puede crear la cuenta sin entregar una sesión hasta que el correo sea confirmado, por lo que la app muestra ese mensaje al usuario.

## Seguridad
Supabase Auth gestiona las contraseñas. No se deben guardar contraseñas en `AsyncStorage` en producción.
