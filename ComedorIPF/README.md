# Comedor IPF

Trabajo práctico de React Native con Expo Router.

## Ejecutar

```bash
npm install
npx expo start
```

Para abrir en web:

```bash
npm run web
```

## Rutas demostradas

- Tabs: inicio, menú, carrito y turnos.
- Stack: detalle dinámico `/menu/[id]` y búsqueda catch-all `/search/[...term]`.
- Modal: `/login` y `/confirm`.
- Drawer: `/cocina` y `/cocina/ayuda`.
- Protección de ruta: cocina redirige a login si no hay sesión.
- Deep link: `comedoripf://menu/milanesa`.

La explicación teórica está en `RESPUESTAS.md`.
