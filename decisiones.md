# TP05 — CI/CD con Azure DevOps + Azure Web Apps

## Objetivo
Implementar un pipeline CI/CD con despliegue automático a QA y despliegue manual a Producción,
con variables de entorno y persistencia de datos usando SQLite.

---

## Decisiones técnicas

### 1. Arquitectura
Se unificó el frontend (Vite + React) y backend (Express + SQLite) en una sola WebApp.
El backend sirve el build del frontend desde `/back/dist`.

Motivo:
- Menos servicios a administrar
- Permite un ZIP deploy sencillo a Azure Web Apps

---

### 2. Base de datos
Se usa **SQLite** y se guarda en:

/home/site/data/app.sqlite

Motivo:
- `wwwroot` se sobrescribe en cada deploy
- `/home/site/data` es persistente por WebApp en Azure

Resultado:
- QA y PROD tienen **bases independientes** sin modificar el código

---

### 3. Variables y secrets por entorno

| Variable | QA | PROD |
|----------|----|------|
| `NODE_ENV` | `qa` | `production` |
| `SQLITE_PATH` | `/home/site/data/app.sqlite` | `/home/site/data/app.sqlite` |
| `PORT` | `8080` | `8080` |
| `ADMIN_TOKEN` (secret) | `qa-<random>` | `prod-<random>` |

Motivo:
- Separación de configuración sin cambiar código.
- No se exponen secretos al repositorio.

---

### 4. Pipeline (azure-pipelines.yml)

Stages implementados:

1. **Build**
   - `npm ci`
   - `npm run build --prefix front`
   - El build del front cae en `back/dist`
   - Se empaqueta solo `/back` como artefacto

2. **Deploy QA (automático)**
   - Health check contra `/api/healthz`

3. **Deploy PROD (manual)**
   - Aprobación en `Environment: prod`

---

### 5. Rollback

Rollback = `Redeploy` desde Azure DevOps:

Pipelines → Runs → elegir build anterior → Redeploy

Alternativa: descargar artefacto `.zip` y subirlo desde Azure Portal → WebApp → Deployment Center.

Motivo: mantener un rollback rápido y sin reconstruir.

---

## Resultados finales

- QA y Producción tienen WebApps independientes
- CI/CD funcionando con aprobación manual
- Base SQLite persistente y separada por entorno
- Health checks automáticos