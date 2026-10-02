# Notas del proyecto Comedor IPF

## 1. Resumen

Comedor IPF es una aplicación de demostración para consultar un menú de comedor, filtrar platos y postres, armar un carrito, confirmar un pedido y reservar turnos. También incluye una pantalla de acceso de demostración y un área de cocina protegida por un estado de sesión local.

Está construida con React Native, TypeScript y Expo. Expo Router resuelve las rutas según la estructura de archivos dentro de `app/`. La interfaz usa componentes de React Native, por lo que puede ejecutarse en web y en plataformas móviles compatibles con Expo.

**Alcance actual:** es un prototipo local. Los platos están definidos en código y el carrito, el acceso y los turnos viven solo en memoria mientras la aplicación permanece abierta. No hay servidor, base de datos, autenticación real ni almacenamiento persistente.

## 2. Cómo se ejecuta

Requisitos: Node.js y npm.

```bash
npm install
npx expo start
```

Para iniciar directamente la versión web:

```bash
npm run web
```

Los scripts `android` e `ios` de `package.json` inician Expo apuntando a esas plataformas:

```bash
npm run android
npm run ios
```

El punto de entrada configurado en `package.json` es `index.ts`, que importa `expo-router/entry`. Por eso las rutas de `app/` son la aplicación efectiva. `App.tsx` contiene una pantalla de ejemplo de Expo, pero **no es la entrada usada por la configuración actual**.

## 3. Tecnologías y paquetes

### Dependencias de ejecución

- `expo`: herramientas y entorno de ejecución de Expo para iniciar y desarrollar la aplicación.
- `expo-router`: navegación basada en archivos, rutas, enlaces, parámetros, grupos de rutas y layouts.
- `expo-status-bar`: componente para controlar la barra de estado; aparece en el `App.tsx` de ejemplo, no en las pantallas servidas por Expo Router.
- `react` y `react-dom`: React y su integración con el renderizado web.
- `react-native`: componentes de interfaz multiplataforma (`View`, `Text`, `Pressable`, `ScrollView`, `TextInput`, `Image`, estilos, etc.).
- `react-native-web`: implementación de React Native para el navegador.
- `react-native-safe-area-context`: soporte de áreas seguras en dispositivos; es una dependencia instalada, aunque la aplicación no la importa directamente en sus archivos fuente.
- `react-native-screens`: integración de pantallas nativas usada por el sistema de navegación; no se importa directamente en las pantallas.
- `expo-constants` y `expo-linking`: dependencias de Expo instaladas para configuración y enlaces; no tienen importaciones directas en el código actual.

### Dependencias de desarrollo

- `typescript`: compilador y comprobador de tipos.
- `@types/react`: definiciones TypeScript de React.

La configuración estricta de TypeScript está en `tsconfig.json`, que extiende la configuración base de Expo y habilita `strict`.

## 4. Configuración de Expo

`app.json` define los metadatos y opciones de la aplicación:

- `name`: nombre visible, `Comedor IPF`.
- `slug`: identificador de proyecto de Expo, `comedor-ipf`.
- `scheme`: esquema de enlaces profundos, `comedoripf`.
- `version`: versión declarada, `1.0.0`.
- `orientation`: orientación vertical.
- `icon`: icono general en `assets/icon.png`.
- `userInterfaceStyle`: tema claro.
- `ios.supportsTablet`: declara soporte para tabletas iOS.
- `android.adaptiveIcon`: imágenes y fondo del icono adaptativo de Android.
- `android.predictiveBackGestureEnabled`: opción de gesto de retroceso predictivo.
- `web.favicon`: favicon de la versión web.
- `plugins`: incluye `expo-router` para configurar su integración con Expo.

El esquema `comedoripf` se usa para enlaces profundos. El README incluye como ejemplo `comedoripf://menu/milanesa`.

## 5. Rutas y navegación

Expo Router convierte los archivos de `app/` en rutas. Los nombres entre paréntesis, como `(tabs)`, agrupan pantallas sin agregar ese nombre a la URL.

| Archivo | Ruta | Propósito |
| --- | --- | --- |
| `app/(tabs)/index.tsx` | `/` | Inicio, resumen del carrito, platos destacados y acceso al menú o a turnos. |
| `app/(tabs)/menu.tsx` | `/menu` | Lista de platos y postres, búsqueda y filtros. |
| `app/(tabs)/cart.tsx` | `/cart` | Contenido, total, deshacer cambios y paso a confirmación. |
| `app/(tabs)/turnos.tsx` | `/turnos` | Lista los turnos locales y permite agregar uno. |
| `app/menu/[id].tsx` | `/menu/:id` | Detalle de un plato identificado por su `id`. |
| `app/search/[...term].tsx` | `/search/*` | Búsqueda avanzada que acepta un parámetro de ruta catch-all. |
| `app/login.tsx` | `/login` | Formulario visual de acceso a cocina; no valida credenciales. |
| `app/confirm.tsx` | `/confirm` | Modal para confirmar o cancelar el pedido. |
| `app/cocina/index.tsx` | `/cocina` | Vista de cocina basada en turnos; redirige a login si no hay sesión. |
| `app/cocina/ayuda.tsx` | `/cocina/ayuda` | Ayuda para el área de cocina. |
| `app/+not-found.tsx` | Ruta no encontrada | Pantalla 404 con enlace para volver al inicio. |

### Layouts

- `app/_layout.tsx` es el layout raíz. Envuelve el árbol en `StoreProvider`, declara el `Stack`, configura estilos comunes y registra las pantallas y modales.
- `app/(tabs)/_layout.tsx` registra las cuatro pantallas principales con `Tabs`, pero oculta la barra de pestañas nativa con `tabBarStyle: { display: 'none' }`. La navegación visible la dibuja `InstitutionalHeader`.
- `app/cocina/_layout.tsx` configura un `Stack` para cocina y ayuda, con una cabecera verde.

**Nota sobre la documentación anterior:** `README.md` dice que cocina usa un drawer y que la ayuda tiene una ruta catch-all. El código actual configura un `Stack` para cocina y la ruta de ayuda es `app/cocina/ayuda.tsx` (sin segmento catch-all). Las notas describen el código que existe, no esas afirmaciones desactualizadas del README.

## 6. Estado compartido y funcionamiento

`lib/store.tsx` centraliza los datos compartidos en un contexto React. `StoreProvider` se monta en el layout raíz para que las pantallas puedan acceder al mismo carrito, sesión e información de turnos.

### Tipos del estado

- `CartItem`: todos los campos de un `Dish` más `quantity`, la cantidad de unidades del plato.
- `Turn`: `id`, nombre asociado, hora (`time`) y cantidad de personas (`people`).
- `Store`: forma pública del contexto: estados y funciones disponibles para las pantallas.

### Variables de estado

- `loggedIn`: indica si la sesión de demostración está activa. Comienza en `false`.
- `cart`: platos agregados, cada uno con cantidad. Comienza vacío.
- `history`: instantáneas previas del carrito para deshacer modificaciones.
- `turns`: turnos locales; inicia con un ejemplo disponible a las 12:30.

### Funciones expuestas por `useStore`

- `add(dish)`: agrega el plato al carrito. Si ya existe, incrementa su cantidad; si no, lo agrega con cantidad uno.
- `remove(id)`: resta una unidad del plato indicado y lo elimina cuando su cantidad llega a cero.
- `undo()`: recupera la instantánea anterior del carrito si existe.
- `clearCart()`: registra el cambio y deja vacío el carrito.
- `login()` / `logout()`: activan o desactivan la sesión local.
- `takeTurn(name, people)`: agrega un turno con identificador basado en la hora actual y hora fija `13:00`.

La función interna `change(next)` guarda el carrito anterior en `history` antes de guardar el nuevo. `StoreContext` empieza como `null`; `useStore()` lee el contexto con `useContext` y lanza un error explícito si se usa fuera de `StoreProvider`.

**Limitaciones importantes:** el contexto no se guarda en almacenamiento local, por lo que al reiniciar se pierden los cambios. `login()` no comprueba usuario ni contraseña. Los horarios de turnos son ejemplos fijos, no se validan contra disponibilidad real.

## 7. Catálogo y precios

`lib/data.ts` contiene el tipo `Dish`, el arreglo `dishes` y `formatPrice`.

Cada `Dish` tiene:

- `id`: identificador estable usado para buscar el plato y como clave de listas.
- `name`: nombre para mostrar.
- `category`: modalidad (por ejemplo, `Clásico`, `Celíaco` o `Vegetariano`).
- `mealType`: tipo literal `Plato` o `Postre`.
- `description`: descripción visible.
- `price`: valor numérico usado para calcular el total.
- `emoji`: ilustración textual usada en las tarjetas y detalles.
- `tags`: etiquetas como `Popular`, `Sin TACC` o `Veggie`.

El arreglo es el catálogo estático de demostración; contiene platos principales y postres. `formatPrice(price)` formatea el valor usando la configuración regional `es-AR` y antepone `$`.

## 8. Hooks del proyecto

Un hook es una función de React (o de una biblioteca compatible) que permite que un componente use capacidades como estado, contexto, navegación o información de la pantalla. Los hooks se llaman dentro de componentes funcionales u otros hooks. En este proyecto sirven para conservar datos entre renderizados, compartir información entre pantallas y reaccionar a la ruta y al tamaño de pantalla.

### `useState` — guardar estado local

`useState` crea un valor de estado y una función para actualizarlo. Cuando se actualiza, React vuelve a renderizar el componente para reflejar el nuevo valor. El proyecto lo usa en tres áreas:

- **Estado compartido en `lib/store.tsx`:**
  - `loggedIn` / `setLoggedIn`: recuerda si se inició la sesión de demostración. `login()` lo cambia a `true` y `logout()` a `false`; cocina consulta este valor para decidir si redirige al login.
  - `cart` / `setCart`: conserva los artículos y cantidades del carrito. Agregar, quitar, deshacer o confirmar modifica este estado y actualiza las pantallas que lo consumen.
  - `history` / `setHistory`: guarda copias anteriores del carrito para permitir deshacer cambios.
  - `turns` / `setTurns`: contiene los turnos registrados durante la sesión actual y se comparte entre el formulario de turnos y la vista de cocina.
- **Filtros del menú en `app/(tabs)/menu.tsx`:**
  - `query` / `setQuery`: conserva el texto que se escribe en el buscador.
  - `category` / `setCategory`: identifica el filtro seleccionado (`Todos`, `Clásico`, `Celíaco` o `Vegetariano`).
  - `mealType` / `setMealType`: alterna entre `Plato` y `Postre`.
  Cada actualización vuelve a calcular `filtered`, por lo que la lista visible coincide con los filtros actuales.
- **Formulario de turnos en `app/(tabs)/turnos.tsx`:**
  - `name` / `setName`: conserva el nombre ingresado mientras se completa el formulario.
  - `people` / `setPeople`: conserva como texto la cantidad de personas escrita en el campo.
  Al reservar se pasan los valores a `takeTurn`; el nombre se limpia después de agregarse.
- **Hover del encabezado en `components/ui.tsx`:**
  - `hoveredHref` / `setHoveredHref`: guarda el enlace sobre el que está el cursor en web. `onHoverIn` y `onHoverOut` actualizan el valor para aplicar el color de resaltado; no reemplaza la selección de la pestaña activa.

### `useContext` — leer estado compartido

`useContext(StoreContext)` obtiene el valor del contexto creado en `lib/store.tsx`. El contexto permite que pantallas alejadas en el árbol compartan el mismo carrito, sesión e información de turnos sin pasar todas esas propiedades manualmente por cada componente intermedio. El valor lo proporciona `StoreProvider`, que se monta alrededor de la navegación en `app/_layout.tsx`.

### `useStore` — hook propio para acceder a la tienda

`useStore()` es un hook personalizado del proyecto, definido en `lib/store.tsx`. Por dentro usa `useContext(StoreContext)` y devuelve el estado y las operaciones tipadas de la tienda. Las pantallas lo llaman para leer o modificar datos compartidos. Si se llama fuera de `StoreProvider`, arroja un error para señalar la configuración incorrecta en vez de devolver un valor vacío.

### `useRouter` — navegar mediante acciones

`useRouter()` de Expo Router da acceso a métodos de navegación sin necesitar un enlace visible. El proyecto lo usa cuando una acción debe cambiar de pantalla:

- En `app/(tabs)/index.tsx`, los controles abren el menú o la página de turnos.
- En `app/(tabs)/cart.tsx`, el botón de confirmación abre `/confirm`.
- En `app/menu/[id].tsx`, agregar un plato al carrito navega a `/cart`.
- En `app/login.tsx`, tras activar el acceso de demostración, `router.replace('/cocina')` cambia a cocina y reemplaza la ruta de login en el historial.
- En `app/confirm.tsx`, `router.dismiss()` cierra el modal después de confirmar o al volver a editar.

### `usePathname` — conocer la ruta actual

`usePathname()` de Expo Router devuelve la ruta que se está mostrando. `InstitutionalHeader` la compara con las rutas de navegación para pintar la pestaña activa en verde. También reconoce rutas internas como `/menu/milanesa` como parte de la sección `/menu`.

### `useWindowDimensions` — adaptar la interfaz al tamaño

`useWindowDimensions()` de React Native devuelve las dimensiones actuales de la ventana y se actualiza si cambian. `InstitutionalHeader` usa `width` para decidir si muestra el encabezado compacto cuando el ancho es menor que 620 px. La pantalla de inicio también consulta el ancho para aplicar estilos compactos a su portada.

### `useLocalSearchParams` — leer parámetros de la ruta

`useLocalSearchParams()` de Expo Router lee los parámetros de la ruta que está abierta:

- `app/menu/[id].tsx` obtiene `id` para encontrar el plato correcto en el catálogo.
- `app/search/[...term].tsx` obtiene `term`, incluso cuando la ruta catch-all entrega una lista de segmentos, y lo usa para buscar resultados.
- `app/cocina/ayuda.tsx` lee `slug` opcional para mostrar el tema de ayuda.



## 9. APIs y componentes de Expo Router

Además de sus hooks, Expo Router aporta elementos de navegación usados directamente:

- `Link` crea enlaces declarativos entre pantallas y permite que las tarjetas y opciones de navegación sean seleccionables.
- `Redirect` cambia automáticamente a `/login` cuando se intenta mostrar cocina sin sesión de demostración.
- `Stack` configura la navegación apilada y las opciones de cabecera de las pantallas.
- `Tabs` registra el grupo de cuatro secciones principales; en este diseño su barra nativa está oculta y los enlaces visibles están en `InstitutionalHeader`.
- `router.dismiss()` (método del objeto devuelto por `useRouter`) cierra el modal de confirmación.

## 10. Pantallas y variables de interfaz

### Inicio

`app/(tabs)/index.tsx` consulta `cart` y `loggedIn` con `useStore()` para mostrar métricas, consulta el ancho de ventana para elegir el tamaño compacto y usa `useRouter()` para navegar. Presenta una imagen remota como hero, una selección de tres platos, hasta tres postres y un enlace a cocina.

### Menú

`app/(tabs)/menu.tsx` filtra el catálogo de acuerdo con:

- `query`: texto que se busca en el nombre, categoría y etiquetas.
- `category`: categoría seleccionada o `Todos`.
- `mealType`: `Plato` o `Postre`.
- `filtered`: resultado calculado con esos criterios.
- `categories`: opciones disponibles para el filtro de modalidad.

Si hay texto de búsqueda, ofrece abrir la ruta de búsqueda avanzada. `DishCard` presenta cada resultado.

### Tarjetas y controles comunes

`components/ui.tsx` reúne elementos reutilizados:

- `Header`: encabezado de sección con título y subtítulo opcional (`eyebrow`).
- `InstitutionalHeader`: identidad del comedor y enlaces principales.
- `DishCard`: tarjeta enlazada al detalle del plato.
- `Button`: botón primario o secundario configurable.
- `screen`: estilos base de contenedor, contenido y scroll.
- `colors`: paleta compartida por encabezados, pantallas, botones y tarjetas.

En `InstitutionalHeader`, `pathname` determina la pestaña activa, `hoveredHref` determina el enlace bajo el cursor y `compact` activa la disposición compacta cuando `width < 620`. En web, el evento hover permite resaltar al pasar el cursor; en móvil permanece resaltada la ruta activa.

### Carrito y detalle

`app/(tabs)/cart.tsx` obtiene `cart`, `remove`, `undo` e `history` del contexto. `total` suma `price * quantity` de cada elemento. Si el carrito está vacío muestra un enlace al menú; si tiene elementos muestra cantidades, total, confirmación y opción de deshacer.

`app/menu/[id].tsx` obtiene `id` mediante `useLocalSearchParams`, busca el elemento correspondiente en `dishes` y muestra un fallback si no existe. El botón agrega el plato al contexto y navega al carrito.

### Turnos y cocina

`app/(tabs)/turnos.tsx` muestra `turns` y mantiene `name` y `people` como cadenas de texto del formulario. Solo intenta reservar cuando el nombre no está vacío; luego pasa el nombre recortado y el número convertido (o uno como fallback) a `takeTurn` y limpia el nombre.

`app/cocina/index.tsx` revisa `loggedIn`: sin sesión devuelve un `Redirect` a `/login`; con sesión muestra los turnos y etiqueta el primero como `PREPARANDO` y los siguientes como `EN COLA`. Esos estados son una presentación calculada por posición, no un flujo de trabajo persistido.

### Login, confirmación y búsqueda avanzada

- `app/login.tsx`: los campos Usuario y Contraseña son visuales. El botón llama `login()` sin validar los campos y reemplaza la ruta por `/cocina`.
- `app/confirm.tsx`: cuenta las unidades del carrito. Confirmar limpia el carrito y cierra el modal; seguir editando solo lo cierra.
- `app/search/[...term].tsx`: normaliza el parámetro catch-all a un texto y busca coincidencias sin distinguir mayúsculas en nombre, categoría o descripción.
- `app/cocina/ayuda.tsx`: presenta una orientación y muestra el `slug` si está presente.
- `app/+not-found.tsx`: pantalla para rutas inexistentes.

## 11. Colores y estilos

La paleta común está en `components/ui.tsx`:

| Variable | Valor | Uso general |
| --- | --- | --- |
| `ink` | `#244c4b` | Texto principal y títulos. |
| `cream` | `#f4f8f7` | Fondo de pantallas y cabeceras. |
| `paper` | `#ffffff` | Superficies de tarjetas, formularios y encabezado. |
| `green` | `#008f89` | Acento verde y precios. |
| `coral` | `#0a9f98` | Color de acción, títulos de acento y botones. |
| `gold` | `#d6b35a` | Acento dorado. |
| `muted` | `#647978` | Texto secundario y enlaces inactivos. |
| `line` | `#d8e6e3` | Bordes y separadores. |
| `navy` | `#173f4a` | Identidad institucional. |

Cada pantalla define además un `StyleSheet` local para sus componentes propios. Se usan `StyleSheet.create` y arreglos de estilos para combinar el estilo base con variantes como activo, secundario o compacto. Los fondos y logos destacados de la portada/cabecera se cargan desde URLs remotas.

## 12. Mapa de archivos principales

```text
app/
  _layout.tsx             Layout raíz, proveedor global y stack principal
  +not-found.tsx          Ruta 404
  confirm.tsx             Modal de confirmación
  login.tsx               Modal de acceso de demostración
  (tabs)/
    _layout.tsx           Grupo de las cuatro pantallas principales
    index.tsx             Inicio
    menu.tsx              Catálogo, filtros y búsqueda
    cart.tsx              Carrito y total
    turnos.tsx            Reserva de turnos
  menu/[id].tsx           Detalle dinámico de plato
  search/[...term].tsx    Resultados catch-all
  cocina/
    _layout.tsx           Stack de cocina
    index.tsx              Vista protegida de cocina
    ayuda.tsx              Ayuda de cocina
components/
  ui.tsx                  Paleta, estilos y componentes compartidos
lib/
  data.ts                 Tipo Dish, catálogo y formato de precios
  store.tsx               Contexto y estado global en memoria
assets/                   Iconos de aplicación, favicon y splash
App.tsx                   App de ejemplo, no utilizada por la entrada actual
index.ts                  Entrada expo-router/entry
app.json                  Configuración de Expo
package.json              Paquetes y scripts
tsconfig.json             Configuración TypeScript estricta
README.md                 Instrucciones iniciales y rutas resumidas
RESPUESTAS.md             Material teórico del trabajo práctico
```

## 13. Límites y próximos pasos posibles

- Conectar catálogo, pedidos, turnos y usuarios a una API o base de datos.
- Persistir sesión y carrito si el producto lo requiere.
- Implementar validación real de credenciales, autorización y manejo seguro de sesión.
- Validar que la cantidad de personas sea un entero válido y definir disponibilidad real de turnos.
- Guardar estados reales de pedido en vez de inferirlos desde el índice del turno.
- Agregar pruebas automatizadas para filtros, cálculos del carrito y acciones de contexto.
- Revisar `README.md` para que sus referencias a drawer y rutas de ayuda coincidan con los layouts implementados.
