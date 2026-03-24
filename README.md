# noworries

Estado: entorno de pruebas (pre-publicacion).

Este proyecto puede operar con la API de Amazon cuando este disponible y, mientras tanto, degradar de forma segura con datos de respaldo.

## Requisitos

- Node.js 20+
- npm 10+

## Scripts principales

- `npm run dev`: arranque local con Vite en puerto 3000
- `npm run build`: build de produccion
- `npm run start`: arranque del servidor Node/Express para servir `dist`
- `npm run preview`: vista previa del build con Vite
- `npm run lint`: lint estricto (errores)
- `npm run lint:warn`: lint completo (errores + warnings)

## Configuracion de despliegue

El archivo `app-config.js` en la raiz es el punto unico de configuracion para:
- **BASE_PATH**: subcarpeta donde se aloja la app (ejemplo: `/preview-noworries-2026`).
- **PORT**: puerto para el servidor de produccion local.

Si cambias `BASE_PATH`, ejecuta `npm run build` para regenerar el output con la ruta correcta.

## Flujo recomendado antes de publicar

1. `npm install`
2. `npm run lint`
3. `npm run build`
4. `npm run start` o `npm run preview` para validacion manual

## Checklist de pre-lanzamiento

- [ ] Build y lint en verde
- [ ] Rutas criticas comprobadas: home, perfil y detalle
- [ ] Enlaces externos con `rel="noopener noreferrer"` cuando usan `target="_blank"`
- [ ] Variables de entorno revisadas para el entorno de despliegue
- [ ] Fallos de API verificados (mensaje al usuario y fallback funcional)
- [ ] Prueba movil basica en navegadores comunes

## Datos de respaldo

- El unico snapshot de respaldo del dataset secundario es `src/data/recovered_secondary.json`.
- Evitar crear variantes como `old_secondary*.json` para no acumular duplicados.
- El dataset operativo actual sigue siendo `src/data/secondary-products.json`.

## Nota sobre Amazon API

El frontend esta preparado para usar el endpoint configurado en `VITE_API_URL` o `/api/products`.
Si la API no responde o no esta activa, la aplicacion usa fallback para mantener la experiencia funcional.
