# Software de ergonomía 3D con módulo RULA

Aplicación web funcional para evaluación ergonómica RULA. Permite ajustar un maniquí técnico 3D interactivo, evaluar posturas individuales por lado corporal, comparar postura antes/después, guardar tareas en `localStorage` y exportar un resumen JSON.

> Nota de entorno: el repositorio incluye una estructura TypeScript modular para la lógica RULA. Para garantizar que `npm install` y `npm run dev` funcionen en este entorno sin acceso fiable al registro npm, la app ejecutable se sirve sin dependencias externas mediante `scripts/dev-server.mjs` y `src/main.js`.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre la URL que muestre el servidor local, normalmente `http://localhost:5173`.

## Configuración RULA

Los rangos angulares, tablas A/B/final, niveles de actuación y recomendaciones se editan en `src/config/rulaConfig.ts`. La lógica de cálculo mantenible está separada en `src/utils/rula.ts`; la app ejecutable replica esos criterios en `src/main.js`.
