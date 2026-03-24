# OneClickFix

Estado: entorno de pruebas (pre-publicacion).

Este proyecto esta preparado para trabajar con la API de Amazon, pero durante la fase provisional puede operar con datos de respaldo y degradar de forma segura cuando la API no responde.

## Requisitos

- Node.js 20+
- npm 10+

## Scripts principales

- `npm run dev`: arranque local con Vite en puerto 3000
- `npm run start`: arranque con Netlify Dev
- `npm run lint`: lint estricto (errores)
- `npm run lint:warn`: lint completo (errores + warnings)
- `npm run build`: build de produccion
- `npm run preview`: vista previa del build

## Configuracion de Despliegue

El archivo `app-config.js` en la raiz es el punto unico de configuracion para:
- **BASE_PATH**: La subcarpeta donde se aloja la app (ej: `/preview-noworries-2026`).
- **PORT**: Puerto para el servidor de produccion local.

Si cambias el `BASE_PATH`, simplemente ejecuta `npm run build` para que todos los servidores y la propia app se actualicen automaticamente.

## Flujo recomendado antes de publicar

1. `npm install`
2. `npm run lint`
3. `npm run build`
4. `npm run start` o `npm run preview` para validacion manual

## Checklist de pre-lanzamiento

- [ ] Build y lint en verde
- [ ] Rutas criticas comprobadas: home, perfil, detalle
- [ ] Enlaces externos con `rel="noopener noreferrer"` cuando usan `target="_blank"`
- [ ] Variables de entorno revisadas para el entorno de despliegue
- [ ] Fallos de API verificados (mensaje al usuario y fallback funcional)
- [ ] Prueba movil basica en navegadores comunes

## Datos de respaldo

- El unico snapshot de respaldo del dataset secundario es `src/data/recovered_secondary.json`.
- Evitar crear variantes como `old_secondary*.json` para no acumular duplicados.
- El dataset operativo actual sigue siendo `src/data/secondary-products.json`.

## Nota sobre Amazon API

No se han aplicado cambios de arquitectura ni de configuracion en la integracion con Amazon API dentro de esta mejora.
Los ajustes realizados son de calidad, estabilidad y seguridad general del proyecto.
