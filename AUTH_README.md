# Conecta — Registro y Login

El prototipo ahora incluye:
- Crear cuenta
- Iniciar sesión
- Mantener la sesión al cerrar y abrir la app
- Cerrar sesión
- Usuarios locales para pruebas

## Base de datos de producción

`database/schema.sql` contiene el esquema PostgreSQL para:
- usuarios
- cuentas sociales conectadas

La implementación local sirve para probar el flujo. Para producción no se deben guardar contraseñas directamente en AsyncStorage; hay que conectar un backend con contraseñas hasheadas y sesiones/tokens seguros.

## Próximo paso de producción

Conectar este flujo a PostgreSQL/Supabase o un backend Node.js, migrando las credenciales a un sistema de autenticación seguro.
