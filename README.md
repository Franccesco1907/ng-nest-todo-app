# README - Proyecto Todo App Fullstack

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Características Principales](#características-principales)
3. [Tech Stack](#tech-stack)
4. [Arquitectura Backend (Hexagonal)](#arquitectura-backend-hexagonal)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Empezando](#empezando)
  - [Prerrequisitos](#prerrequisitos)
  - [Instalación y Ejecución](#instalación-y-ejecución)
  - [Configuración de Entorno Backend](#configuración-de-entorno-backend)
7. [Scripts Útiles](#scripts-útiles)
  - [Frontend (Angular)](#frontend-angular)
  - [Backend (NestJS)](#backend-nestjs)
8. [Pruebas](#pruebas)
9. [API Documentation (Swagger)](#api-documentation-swagger)
10. [CI/CD Pipeline (GitHub Actions)](#cicd-pipeline-github-actions)
11. [Deployment](#deployment)
12. [Cumplimiento de Requisitos del Challenge](#cumplimiento-de-requisitos-del-challenge)
13. [Consideraciones Adicionales](#consideraciones-adicionales)

---

## Descripción General

Este proyecto es una aplicación completa de gestión de tareas (To-Do App) con una arquitectura **frontend-backend**. El objetivo es demostrar habilidades fullstack aplicando buenas prácticas de desarrollo, arquitecturas limpias y herramientas modernas.

- **Frontend**: Desarrollado con **Angular** y **Angular Material** para una experiencia de usuario moderna y responsiva.
- **Backend**: Construido con **NestJS**, siguiendo los principios de **Arquitectura Hexagonal** para asegurar desacoplamiento, testeabilidad y mantenibilidad.
- **Base de Datos**: Firebase Firestore.
- **Contenerización**: Docker y Dev Containers para facilitar el desarrollo y despliegue.

---

## Características Principales

- **Gestión de Usuarios**: Inicio de sesión simple por correo.
- **Gestión de Tareas (CRUD)**: Crear, editar, eliminar y marcar tareas como completadas.
- **Interfaz Responsiva**: Adaptable a diferentes tamaños de pantalla.
- **API RESTful Segura**: Endpoints protegidos con autenticación basada en JWT.
- **Documentación API**: Generada automáticamente con Swagger.
- **Pruebas**: Unitarias y de integración tanto en frontend como en backend.
- **CI/CD**: Pipelines automatizados para build, test y análisis de código.

---

## Tech Stack

### Frontend

- **Framework**: Angular
- **UI Kit**: Angular Material
- **Estado/Reactividad**: RxJS
- **Testing**: Karma, Jasmine
- **Lenguaje**: TypeScript

### Backend

- **Framework**: NestJS
- **Base de Datos**: Firebase Firestore
- **Autenticación**: JWT (Passport.js)
- **Validación**: class-validator, class-transformer
- **Documentación API**: Swagger
- **Testing**: Jest
- **Lenguaje**: TypeScript

### Otros

- **Contenerización**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: Railway (o similar)

---

## Arquitectura Backend (Hexagonal)

El backend implementa la Arquitectura Hexagonal para separar la lógica de negocio (dominio) de los detalles de infraestructura.

### Componentes Clave

1. **Dominio (`domain`)**: Contiene las entidades, interfaces de repositorios y lógica de negocio pura.
2. **Aplicación (`application`)**: Orquesta los flujos de trabajo (casos de uso).
3. **Infraestructura (`infrastructure`)**: Implementa los detalles técnicos como controladores, repositorios, DTOs y mappers.

Este enfoque facilita la testeabilidad, mantenibilidad y flexibilidad del sistema.

---

## Estructura del Proyecto

El repositorio está organizado como un monorepo con carpetas separadas para `frontend` y `backend`.

```plaintext
.
├── .github/workflows/      # Workflows de CI/CD
├── .devcontainer/          # Configuración de Dev Containers
├── backend/                # Proyecto NestJS
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── common/         # Utilidades compartidas
│   │   ├── config/         # Configuración
│   │   ├── database/       # Módulo de Firestore
│   │   ├── modules/        # Módulos funcionales (Auth, Todo)
│   │   └── main.ts
├── frontend/               # Proyecto Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # CoreModule
│   │   │   ├── modules/    # Feature Modules (Auth, Todo)
│   │   │   └── shared/     # SharedModule
│   │   ├── assets/
│   │   ├── environments/
│   │   └── main.ts
├── docker-compose.local.yml  # Docker Compose para desarrollo
├── docker-compose.prod.yml   # Docker Compose para producción
└── README.md
```

---

## Empezando

### Prerrequisitos

- **Docker & Docker Compose**: Necesarios para ejecutar la aplicación en contenedores.
- **VS Code & Dev Containers**: Recomendado para una experiencia de desarrollo fluida.

### Instalación y Ejecución

1. Clonar el repositorio:
  ```bash
  git clone https://github.com/Franccesco1907/ng-nest-todo-app.git
  cd ng-nest-todo-app
  ```

2. Abrir en Dev Container (opcional):
  - Abre la carpeta del proyecto en VS Code.
  - Selecciona "Reopen in Container".

3. Iniciar los servicios:
  ```bash
  docker-compose -f docker-compose.local.yml up --build -d
  ```

  Esto levantará:
  - Frontend: `http://localhost:4200`
  - Backend: `http://localhost:3000`
  - Swagger API: `http://localhost:3000/docs`

4. Para simular producción:
  ```bash
  docker-compose -f docker-compose.prod.yml up --build -d
  ```

### Configuración de Entorno Backend

1. Navega a la carpeta `backend`:
  ```bash
  cd backend
  ```

2. Crea el archivo `.env`:
  ```bash
  cp .env.example .env
  ```

3. Edita las variables necesarias, como credenciales de Firebase y secretos JWT.

---

## Scripts Útiles

### Frontend (Angular)

- **Instalar dependencias**:
  ```bash
  npm install
  ```
- **Iniciar servidor de desarrollo**:
  ```bash
  npm start
  ```
- **Construir para producción**:
  ```bash
  npm run build
  ```
- **Ejecutar pruebas**:
  ```bash
  npm run test
  ```

### Backend (NestJS)

- **Instalar dependencias**:
  ```bash
  npm install
  ```
- **Iniciar servidor de desarrollo**:
  ```bash
  npm run start:dev
  ```
- **Construir para producción**:
  ```bash
  npm run build
  ```
- **Ejecutar pruebas**:
  ```bash
  npm run test
  ```

---

## Pruebas

- **Frontend**: Pruebas unitarias con Karma y Jasmine.
- **Backend**: Pruebas unitarias y de integración con Jest.

---

## API Documentation (Swagger)

La documentación de la API está disponible en:

- **Local**: `http://localhost:3000/docs`
- **Producción**: `todo-backend-production-aa75.up.railway.app/docs`

---

## CI/CD Pipeline (GitHub Actions)

Se han configurado workflows para:

- **Backend**: Linter, pruebas unitarias y build.
- **Frontend**: Linter, pruebas unitarias y build.

---

## Deployment

- **Frontend**: `todo-frontend-production-0d51.up.railway.app`
- **Backend**: `todo-backend-production-aa75.up.railway.app`
- **Swagger API**: `todo-backend-production-aa75.up.railway.app/docs`

---

## Cumplimiento de Requisitos del Challenge

- **CRUD Tareas**: Implementado en frontend y backend.
- **Buenas Prácticas**: Uso de Angular Material, arquitectura modular y principios SOLID.
- **Autenticación**: Implementada con JWT.
- **Despliegue**: Configurado con Docker y Railway.

---

## Consideraciones Adicionales

- **Estilo de Código**: Uso de ESLint y Prettier.
- **Extensibilidad**: Arquitectura modular y hexagonal.
- **Gestión de Errores**: Interceptors en frontend y filtros en backend.

