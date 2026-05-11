# Simulador de Ergonomía 3D + Job Strain Index

MVP web creado con React, TypeScript, Vite, Three.js y react-three-fiber para visualizar un modelo humano 3D simplificado, ajustar articulaciones y evaluar tareas manuales repetitivas con la metodología Job Strain Index (JSI).

## Ejecutar localmente

```bash
npm install
npm run dev
```

Luego abre la URL que imprime Vite, normalmente `http://localhost:5173`.

## Funciones principales

- Escena 3D con cámara orbital y vistas frontal, lateral y superior.
- Modelo humano simplificado con controles para cuello, tronco, hombro, codo, muñeca, cadera, rodilla y tobillo.
- Posturas predefinidas: escritorio, levantamiento y alcance.
- Semáforo de riesgo postural con recomendaciones automáticas.
- Panel de tarea ergonómica con factores JSI.
- Cálculo automático del índice JSI por multiplicación de multiplicadores.
- Clasificación visual del JSI y factores críticos.
- Guardado y carga de tareas en `localStorage` como JSON.
- Tres tareas de ejemplo.
- Comparación “antes” y “después”.
- Exportación de resumen JSON de evaluación.

## Configuración del método JSI

Los valores, categorías, multiplicadores y recomendaciones del método están en:

- `src/config/jsiConfig.ts`

Modifica ese archivo para ajustar categorías, textos o multiplicadores de cada factor.
