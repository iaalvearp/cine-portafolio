# To Talk — Demo de portafolio de cine

Proyecto de portafolio 100% estático para Cloudflare Pages. Simula la experiencia completa de una cartelera de cine: el visitante elige ciudad y cine, película, función, asientos y snacks, realiza un **pago simulado** y descarga su ticket en PDF.

No hay backend, base de datos real ni servicios externos de pago. Todos los datos son inventados y viven en archivos locales de TypeScript.

## Tecnologías

- **Astro 5** (salida estática)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- `html2canvas` + `jsPDF` para la descarga del ticket
- `sonner` para los avisos

## Puesta en marcha

```bash
pnpm install
pnpm dev
```

El servidor de desarrollo queda disponible en `http://localhost:4321`.

Para generar el sitio estático:

```bash
pnpm build
```

El resultado se escribe en `dist/`. En Cloudflare Pages usa:

- **Build command:** `pnpm build`
- **Build output directory:** `dist`

## Datos y sesión demo

- Las películas, cines, salas, funciones, snacks, promociones y beneficios se generan desde `src/data/seed/`.
- Las funciones se calculan en tiempo de ejecución para los próximos 7 días, con asientos ocupados de ejemplo deterministas.
- La sesión entra automáticamente como **Invitado**. Si cierras sesión, se muestra el login con credenciales públicas de demo: `invitado@demo.com` / `demo1234`.
- "Crear cuenta" no crea nada: muestra un aviso de permisos de la demo.
- Las reservas del visitante se guardan solo en `localStorage` (`cine_reservas`); el estado de la reserva en curso se mantiene en `sessionStorage`.
- El formulario de pago usa una tarjeta de prueba y no envía ni guarda datos reales.

## Migración desde el proyecto original

La lógica original en **Spring Boot 3 / Java 17 / PostgreSQL** fue migrada a datos locales y a un adaptador que imita la API REST (`src/lib/localApi.ts`). Las rutas se centralizan en `src/config/api.ts`. Las operaciones de escritura que no corresponden a la demo responden con un aviso de permisos en lugar de un error roto.

El panel de administración y la gestión real de usuarios fueron eliminados: el visitante solo consulta y simula su compra.

## Documentación adicional

- `THEME_SYSTEM.md`: sistema de temas claro / oscuro / automático.
