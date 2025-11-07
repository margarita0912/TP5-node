# 🚀 TP05 — Pipeline CI/CD con Azure DevOps + Azure Web Apps

Aplicación full-stack: **React (Vite) + Node.js + Express + SQLite**  
Desplegada con **Azure Pipelines** usando dos entornos:

- ✅ **QA** — deployment automático
- ✅ **PRODUCCIÓN** — deployment manual con aprobación

---

## 🌐 URLs de acceso

| Entorno | WebApp URL | Health Check |
|---------|------------|--------------|
| **QA** | https://tp5-webapp-qa-XXXXXX.region-01.azurewebsites.net | `/api/healthz` |
| **PRODUCCIÓN** | https://tp5-webapp-prod-XXXXXX.region-01.azurewebsites.net | `/api/healthz` |