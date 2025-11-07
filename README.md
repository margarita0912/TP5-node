# TP05 — Pipeline CI/CD con Azure DevOps + Azure Web Apps

Aplicación full-stack: **React (Vite) + Node.js + Express + SQLite**  
Desplegada con **Azure Pipelines** usando dos entornos:

- **QA** — deployment automático
- **PRODUCCIÓN** — deployment manual con aprobación

---

## URLs de acceso

| Entorno | WebApp URL | Health Check |
|---------|------------|--------------|
| **QA** | https://tp5-webapp-qa-befse5eqbqa8cjdm.brazilsouth-01.azurewebsites.net | `/api/healthz` |
| **PRODUCCIÓN** | https://tp5-webapp-prod-a9bhg2ekf2fgdwdm.brazilsouth-01.azurewebsites.net | `/api/healthz` |

---

## Flujo de despliegue (CI/CD)

`azure-pipelines.yml` contiene 3 stages:

1. **Build**
   - npm ci (front + back)
   - build del frontend (`npm run build --prefix front`)
   - Vite genera el build dentro de `back/dist`
   - Se empaqueta sólo `/back` → `drop-back.zip`

2. **Deploy QA (automático)**
   - ZIP deploy a Azure WebApp (QA)
   - Health check: `GET /api/healthz`

3. **Deploy PROD (manual)**
   - Requiere aprobación en *Environment → prod*
   - ZIP deploy a Azure WebApp (PROD)
   - Health check final
