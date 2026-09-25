# Respuestas teóricas

## A. Pila

Una pila aplica LIFO: el último elemento agregado es el primero que sale. En la app, `history` guarda copias del carrito antes de cada cambio. `undo` recupera la última copia, por eso deshace en orden inverso.

## B. Cola

Una cola aplica FIFO: el primer elemento que entra es el primero que se atiende. `turns` conserva los turnos en orden de llegada y la pantalla de cocina muestra el primero como `PREPARANDO`.

## C. Expo Router

1. `Link` es declarativo y útil para enlaces visibles; `router.push()` permite navegar desde una acción o callback; `router.replace()` reemplaza el historial y es adecuado al iniciar sesión; `router.dismiss()` cierra una pantalla modal.
2. Un `[id].tsx` recibe un parámetro dinámico con `useLocalSearchParams`. Un `[...term].tsx` captura varios segmentos y resuelve búsquedas o rutas variables.
3. Los layouts anidados permiten componer una raíz Stack, un grupo Tabs y un Drawer independiente. La opción `presentation: 'modal'` presenta login y confirmación como modales.
4. `Redirect` protege la ruta de cocina: si no existe sesión, dirige a login antes de renderizar el panel.
5. Un deep link como `comedoripf://menu/milanesa` resuelve la ruta `/menu/[id]` mediante el esquema declarado en `app.json`.

## D. Decisiones de la entrega

La app usa datos locales para ser demostrable sin backend. El estado global está en `StoreProvider`, evitando duplicar carrito, sesión y turnos entre pantallas. Las rutas están separadas por responsabilidad y las pantallas de error incluyen una redirección visible al inicio.

## G. Desarrollo del sistema: “Comedor IPF”

### G1. Rutas requeridas

El árbol de rutas se organiza para separar la navegación principal del sistema en una raíz `Stack`, una sección de tabs para la parte pública y un `Drawer` para cocina. La idea es que la app responda a URLs claras y que cada flujo tenga su propia jerarquía.

```text
src/app/
  _layout.tsx                  // Provider raíz + layouts
  +not-found.tsx               // 404
  login.tsx                    // modal de acceso de cocina
  confirmar.tsx                // modal resumen del pedido
  turno/[numero].tsx           // detalle del turno
  buscar.tsx                  // búsqueda en la URL
  carrito.tsx                 // tab carrito
  carrito/nota.tsx            // aclaración para cocina
  pedido.tsx                  // redirect a /carrito
  cocina/
    _layout.tsx               // Drawer de cocina
    index.tsx                 // orden actual
    atendidos.tsx             // historial de atendidos
  ayuda/
    index.tsx                 // índice de ayuda
    [...slug].tsx             // ayuda profunda
  menu/
    index.tsx                 // lista del menú
    [id].tsx                  // detalle del plato
  categorias/
    [categoria].tsx           // filtros por categoría
  (tabs)/
    _layout.tsx               // tabs: Inicio, Menú, Carrito, Turnos
    index.tsx                 // inicio
    menu.tsx                  // agrupado por categoría
    cart.tsx                  // carrito del tab
    turnos.tsx                // turnos del alumno
```

La app debe responder exactamente a las URLs pedidas:

- `/` → Inicio con acceso rápido.
- `/menu` → listado de platos.
- `/menu/[id]` → detalle del plato.
- `/categorias/[categoria]` → filtros por categoría.
- `/buscar?q=&categoria=` → pantalla con búsqueda en la URL.
- `/carrito` → resumen del carrito.
- `/carrito/nota` → aclaración para cocina.
- `/confirmar` → resumen del pedido en modal.
- `/turno/[numero]` → turno asignado.
- `/login` → ingreso del personal.
- `/cocina` → pantalla protegida para cocinar.
- `/cocina/atendidos` → pedidos ya atendidos.
- `/ayuda` y `/ayuda/...` → artículos de ayuda.
- `/pedido` → redirige a `/carrito`.
- cualquier otra URL → `+not-found.tsx`.

### G2. Requisitos funcionales

1. Estructuras de datos propias

   En `src/estructuras/` se implementan `Pila` y `Cola` con campos privados `#items` para encapsular el estado. Ambas clases deben exponer:
   - `push(...)` / `enqueue(...)`
   - `pop()` / `dequeue()`
   - `tope()` / `frente()`
   - `vacia`
   - `tamanio` getter
   - `aArray()` que devuelve una copia del contenido sin mutar la estructura interna

   La cola no usa `shift()` porque eso tiene $O(n)$ y rompe la intención de mantener la fila eficiente. La solución se basa en apuntar al primer elemento y avanzar con un índice o una estructura circular.

2. Cola de pedidos

   Cuando el usuario confirma un pedido, se genera un número correlativo y el pedido entra a la cola. La cocina trabaja con el frente de la cola y solo atiende el pedido más antiguo:
   - `pedido.numero` = correlativo
   - `pedido.items` = platos del carrito
   - `pedido.total` = suma del pedido
   - `pedido.estado` = `pendiente` / `atendido`

   La pantalla `/cocina` muestra el primer pedido y el botón “Atender siguiente” lo desencola. Esto garantiza que nadie “se colase” y que la entrega siga el orden de llegada.

3. Pila de deshacer

   Cada vez que agrego un plato al carrito, se hace un `push` en una pila de acciones. La operación se registra como un snapshot del item agregado, por ejemplo:

   ```ts
   const accion = { tipo: "agregar", item, cantidad: 1 };
   piladeshacer.push(accion);
   ```

   Si el usuario pulsa “Deshacer último”, se ejecuta `pop()`. Ese último item se elimina del carrito y el botón queda deshabilitado cuando la pila está vacía. Esto cumple la lógica LIFO de la pila.

4. Historial de atendidos

   Cuando un pedido se atiende, se guarda en una segunda pila de historial; al mostrar `/cocina/atendidos` se recorre desde el tope hacia la base, mostrando primero el pedido más reciente. Esto se corresponde con la lógica de una pila: el último atendido es el primero en verse.

5. Navegación correcta

   Se usa `<Link>` cuando el usuario toca un elemento navegable del UI y `router` cuando la navegación depende de lógica del programa. En particular, al confirmar el pedido se usa `router.replace(`/turno/${numero}`)` para pasar de `/confirmar` a `/turno/[numero]` sin dejar la confirmación en el historial; así, al presionar “Atrás” no se regresa a la pantalla de confirmación. Esto es más correcto que `push` porque la confirmación ya no es una pantalla previa en la pila.

6. Rutas dinámicas y validación

   /menu/[id] y /categorias/[categoria] reciben parámetros como texto porque la URL siempre llega en formato string. Antes de renderizar el contenido, se validan:
   - si el `id` no existe en la lista de platos, mostrar un mensaje “No existe el producto”
   - si la categoría no coincide con `desayuno | almuerzo | bebidas | kiosco`, mostrar un error de validación

   La validación evita que una URL inválida abra un detalle vacío o una categoría inexistente.

7. Buscador con parámetros

   La pantalla `/buscar` lee `q` y `categoria` con `useLocalSearchParams()`, aplica el filtro correspondiente y actualiza la URL con `router.setParams({ q, categoria })` en lugar de `router.push`. Esto mantiene la búsqueda en la URL, a la vez que no empuja otra pantalla a la pila. La URL resultante se puede compartir por link o copiar/pegar.

8. Rutas protegidas

   `cocina` y `login` se controlan con `Stack.Protected` o un layout protegido. La lógica es:
   - si no hay sesión, cualquiera intenta entrar a `/cocina` se redirige a `/login`
   - si el usuario inicia sesión, el login se cierra y la ruta `/cocina` queda disponible
   - si se cierra sesión desde cocina, la sección desaparece del historial y la app vuelve a la pantalla pública

   Esto evita que la parte privada quede accesible sin autenticación.

9. Estado global

   La sesión, el carrito, la cola y las pilas viven en un `Context` o `StoreProvider` ubicado en el layout raíz. El proveedor centraliza el estado para que todas las pantallas compartan la misma fuente de verdad. Esto evita duplicación de estado y mantiene sincronizado el carrito, la cola de pedidos y el historial de cocina.

10. Componente “¿Dónde estoy?”

Se crea `src/components/DondeEstoy.tsx` y muestra:

- `usePathname()`
- `useSegments()`
- `useLocalSearchParams()`

Se lo agrega al final de cada pantalla para depurar la navegación. Si se quiere ocultarlo en producción, se usa una constante `DEBUG` y se evita renderizarlo cuando sea `false`.

### G3. Requisitos técnicos

- Proyecto creado con `npx create-expo-app@latest`, usando Expo SDK 57 y TypeScript.
- Los paquetes se instalan con `npx expo install` y no con `npm install` directo para evitar incompatibilidades de dependencias.
- `Tabs` se importan desde `expo-router/js-tabs` y se usan íconos de `@expo/vector-icons`.
- `Drawer` se importa desde `expo-router/drawer`.
- El layout raíz envuelve la app en `GestureHandlerRootView` para que el drawer funcione correctamente.
- En `src/app` solo viven las rutas; en `src/components` van los componentes reutilizables; en `src/data` van los datos de ejemplo; en `src/estructuras` van las clases Pila y Cola; en `src/context` va el estado global.
- Se configura el scheme `comedoripf` en `app.json`.
- Un deep link como `comedoripf://categorias/bebidas` debe dejar las tabs debajo en la pila, por eso el `anchor` se define en `(tabs)`.
- Las rutas activas se tipan con strings compatibles para evitar errores de TypeScript y `href` escritos a mano.
- La app incluye al menos 12 platos de ejemplo repartidos en: desayuno, almuerzo, bebidas y kiosco.

### G4. Desafíos opcionales

1. Contador de pila

   Se puede mostrar en el título del header la cantidad de pantallas que hay en la pila usando `useNavigation().getState()`. Esto permite que el usuario vea cuántas pantallas quedan en la navegación actual.

2. Tab protegida

   Con `Tabs.Protected`, la pestaña “Cocina” solo aparece cuando hay una sesión activa. Si no hay sesión, la pestaña no está disponible; al iniciar sesión, se habilita automáticamente.

   Esta solución mejora la experiencia de usuario y mantiene la navegación consistente con la parte privada de la app.

En conjunto, el sistema cumple la idea del trabajo práctico: combina una `Cola` para atender pedidos por orden de llegada y una `Pila` para deshacer acciones en el carrito, mientras usa Expo Router como mecanismo de navegación, seguridad y persistencia de estado en la URL.
