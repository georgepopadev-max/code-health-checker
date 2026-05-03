# 🔍 Code Health Checker

**Análisis de calidad y complejidad en repositorios GitHub**

[![Java](https://img.shields.io/badge/Java-21-blue.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)

---

## 📖 Descripción

Plataforma que analiza repositorios GitHub y genera informes detallados de calidad de código. El análisis cubre cobertura de tests, complejidad ciclomática, deuda técnica, patrones problemáticos y mantenimiento histórico, todo presentado en un dashboard visual con radar charts y listas de hallazgos priorizados.

**Problema que resuelve:** Los equipos de desarrollo necesitan visibilidad objetiva sobre la salud de sus repositorios antes de iniciar nuevos features o durante code reviews. Esta herramienta automatiza lo que tradicionalmente requiere varias herramientas (SonarQube, JaCoCo, Lizard)整合 en una sola plataforma con informe unificado.

---

## 🧰 Tech Stack

| Capa | Tecnología |
|---|---|
| **Frontend** | Angular 17 · TypeScript · Chart.js |
| **Backend** | Spring Boot 3.2 · Java 21 |
| **Parser** | JavaParser (AST analysis) |
| **Integración** | GitHub REST API |
| **Visualización** | Chart.js Radar Chart · Gauge indicators |
| **Métricas** | Complejidad ciclomática · ABC Complexity |

---

## ✨ Features

- **Radar chart de 6 dimensiones:** Cobertura, Complejidad, Deuda técnica, Mantenibilidad, Documentación, Seguridad — visualizados en un único gráfico.
- **Análisis de complejidad:** Cálculo de complejidad ciclomática por método, clase y archivo. Identificación de métodos candidatos a refactor.
- **Detección de tech debt:** Flags sobre code smells (métodos largos, parámetros excesivos, complejidad excesiva, DTOs anémicos).
- **Informe de recomendaciones:** Acciones concretas priorizadas por impacto (alta/media/baja) con enlace al archivo y línea de código.
- **Soporte multi-repositorio:** Análisis de múltiples repositorios con comparación lado a lado.

---

## 🎨 Demo

El dashboard presenta:

1. **Health score global** — Indicador circular (0-100) con color codificado: verde (>80), amarillo (50-80), rojo (<50).
2. **Radar chart** — Gráfico de radar interactivo con las 6 dimensiones. Cada eje es clickeable para filtrar hallazgos.
3. **Lista de hallazgos** — Tabla ordenable con: severidad, archivo, línea, descripción del code smell y recomendación.
4. **Timeline de commits** — Gráfico de línea con frecuencia de commits y tendencia de salud del código.

---

## 🏗️ Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│                 Frontend (Angular 17)                    │
│    DashboardComponent · RadarChart · FindingsList        │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP REST
┌────────────────────────▼────────────────────────────────┐
│                  Backend (Spring Boot)                    │
│    RepositoryAnalysisController · HealthReportService    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Analysis Engine                         │
│  GitHubClient · JavaParser · MetricsCalculator           │
│  ComplexityAnalyzer · TechDebtDetector                   │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup

### Requisitos

- **Java 21**
- **Node.js 18+** y **npm**
- **Angular CLI 17**
- **Token de GitHub** (para repos privados; públicos no requieren token)

### Backend

```bash
cd code-health-checker/backend
./mvnw spring-boot:run
# API disponible en http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Frontend

```bash
cd code-health-checker/frontend
npm install
ng serve
# App disponible en http://localhost:4200
```

### Configurar token de GitHub

```bash
# Variable de entorno
export GITHUB_TOKEN=gho_tu_token_aqui

# O en backend/src/main/resources/application.yml
# github:
#   token: gho_tu_token_aqui
```

---

## 📂 Estructura del proyecto

```
code-health-checker/
├── backend/
│   ├── src/main/java/.../
│   │   ├── controller/     # RepositoryAnalysisController
│   │   ├── service/         # HealthReportService
│   │   ├── parser/          # JavaParser integration
│   │   ├── metrics/         # ComplexityCalculator
│   │   ├── github/          # GitHubClient
│   │   └── model/           # HealthReport, Finding, Metric
│   └── src/main/resources/
└── frontend/
    ├── src/app/
    │   ├── dashboard/       # Componente principal
    │   ├── radar-chart/     # Gráfico radar Chart.js
    │   ├── findings-list/   # Tabla de hallazgos
    │   └── repo-selector/   # Selector de repositorios
    └── src/assets/
```

---

## 📬 Contacto

- ✉️ **Email:** [georgepopadev@gmail.com](mailto:georgepopadev@gmail.com)
- 💻 **GitHub:** [github.com/georgepopadev/code-health-checker](https://github.com/georgepopadev/code-health-checker)
