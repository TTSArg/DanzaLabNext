# DevOps y pipeline

## Estructura propuesta

- CI con GitHub Actions para validar cada push y PR.
- Node 22 fijado para evitar warnings de Supabase y mantener compatibilidad.
- Build de producción con `npm run build`.
- Dockerfile para packaging y despliegue en un entorno de contenedores o VM.

## Secrets requeridos

Configurar en GitHub > Settings > Secrets and variables > Actions:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Flujo sugerido

1. Cada push a `main` o `master` dispara la CI.
2. La pipeline ejecuta `npm ci`, `npm run lint` y `npm run build`.
3. Si pasa, la app queda lista para desplegar en un host o en Vercel.
4. Se puede conectar un deploy posterior a un entorno de staging o production.

## Comandos locales

```bash
npm install
npm run lint
npm run build
```

## Docker

```bash
docker build -t danzalab-ensaya .
docker run -p 3000:3000 --env-file .env.local danzalab-ensaya
```
