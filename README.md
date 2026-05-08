# Software de ergonomía 3D con módulo RULA

Aplicación web funcional para evaluación ergonómica RULA. Permite ajustar un modelo humano 3D interactivo, evaluar posturas individuales por lado corporal, comparar postura antes/después, guardar tareas en `localStorage` y exportar un resumen JSON.

> Nota de entorno: el repositorio incluye una estructura TypeScript modular para la lógica RULA. Para garantizar que `npm install` y `npm run dev` funcionen en este entorno sin acceso fiable al registro npm, la app ejecutable se sirve mediante `scripts/dev-server.mjs` y `src/main.js`.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre la URL que muestre el servidor local, normalmente `http://localhost:5173`.

## Modelo humano GLB

El modelo principal debe colocarse en:

```text
public/models/humano-rula-rigged.glb
```

La ruta editable está definida en `src/config/humanModelConfig.ts` (`modelPath`) y replicada en `src/main.js` para la versión ejecutable sin build. La app carga el GLB con Three.js + `GLTFLoader` mediante el import map de `index.html`. Si el GLB no está disponible o el loader no puede inicializarse, se muestra un mensaje claro y se conserva el maniquí CSS-3D anterior como fallback.

Para cambiar por otro modelo:

1. Copia el nuevo `.glb` dentro de `public/models/`.
2. Cambia `modelPath` en `src/config/humanModelConfig.ts`.
3. Ajusta los aliases en `boneAliases` si el rig usa otros nombres de huesos.
4. Ajusta los ejes/signos en `rotations` si alguna articulación flexiona en sentido inverso.

## Configuración RULA

Los rangos angulares, tablas A/B/final, niveles de actuación y recomendaciones se editan en `src/config/rulaConfig.ts`. La lógica de cálculo mantenible está separada en `src/utils/rula.ts`; la app ejecutable replica esos criterios en `src/main.js`.

## Mapeo de huesos

`src/config/humanModelConfig.ts` contiene aliases para cuello, tronco, hombros, brazos, antebrazos, muñecas/manos, caderas, rodillas y tobillos. En ejecución, la consola del navegador muestra `RULA GLB bones mapped` con el nombre real de cada hueso detectado o `null` si no se encontró. Usa esa salida para ajustar aliases o factores de inversión.
