# Sistema de Gestión de Gastos - Inmobiliaria San Felipe S.A.C

> Sistema completo de gestión de gastos con estructura jerárquica de roles

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3.3-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-8.1.0-green.svg)
![React Native](https://img.shields.io/badge/react--native-0.81.4-blue.svg)
![Expo](https://img.shields.io/badge/expo-~54.0-black.svg)

</div>

---

## DESCRIPCIÓN

Sistema móvil y backend para gestión de gastos en obras de construcción con:

- **Sistema de roles jerárquico**: MODERADOR → ADMIN_OBRA → TRABAJADOR
- **Gestión de proyectos/obras** con presupuestos y seguimiento
- **Asignación de personal** a obras específicas
- **Registro de gastos** con comprobantes fotográficos
- **Flujo de aprobación** de gastos por administradores
- **Notificaciones** en tiempo real
- **Control de presupuestos** y alertas
- **Reportes y estadísticas** por obra y categoría

---

## ARQUITECTURA

```
┌──────────────────────────────────────────────┐
│              FRONTEND (Mobile)                │
│        React Native + Expo + TypeScript      │
│     Zustand + React Navigation + Axios       │
└───────────────────┬──────────────────────────┘
                    │ REST API
                    │ JWT Auth
┌───────────────────▼──────────────────────────┐
│               BACKEND (API)                   │
│       Express + TypeScript + MongoDB         │
│    JWT + Bcrypt + Cloudinary + Multer       │
└───────────────────┬──────────────────────────┘
                    │
          ┌─────────▼────────┐
          │     MongoDB       │
          │   (Base de Datos) │
          └──────────────────┘
```

---

## ESTRUCTURA DEL PROYECTO

```
Proyecto-programacion-Movil-Inmobiliaria-San-Felipe-S.A.C/
│
├── Backend-Inmobiliaria/              # 🔧 Backend API (Node.js + Express)
│   ├── src/
│   │   ├── models/                    # Modelos de MongoDB
│   │   ├── controllers/               # Controladores (lógica de negocio)
│   │   ├── routes/                    # Rutas de la API
│   │   ├── middlewares/               # Auth, validación, errores
│   │   ├── config/                    # Configuración (DB, Cloudinary)
│   │   ├── utils/                     # Utilidades (JWT, formatters)
│   │   ├── types/                     # TypeScript types
│   │   └── server.ts                  # Punto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md                      # Documentación del backend
│
├── Movil-Inmobiliaria/                # 📱 Frontend Mobile (React Native)
│   ├── src/
│   │   ├── features/                  # Features por dominio
│   │   │   ├── auth/                  # Autenticación
│   │   │   ├── projects/              # Gestión de proyectos
│   │   │   ├── expenses/              # Gestión de gastos
│   │   │   └── profile/               # Perfil de usuario
│   │   ├── shared/                    # Componentes compartidos
│   │   │   ├── components/            # UI components
│   │   │   ├── hooks/                 # Custom hooks
│   │   │   └── utils/                 # Utilidades
│   │   ├── core/                      # Infraestructura
│   │   │   ├── api/                   # Cliente API (Axios)
│   │   │   ├── navigation/            # Navegación
│   │   │   └── storage/               # AsyncStorage
│   │   └── App.tsx
│   ├── assets/
│   ├── package.json
│   └── app.json
│
└── README.md                          # Este archivo
```

---

## SISTEMA DE ROLES

### Jerarquía

```
┌────────────────────────────────────────┐
│         MODERADOR (Dueño)              │
│  - Crea proyectos                      │
│  - Asigna administradores              │
│  - Ve y aprueba TODO                   │
└─────────────┬──────────────────────────┘
              │
              │ asigna
              ▼
┌────────────────────────────────────────┐
│   ADMIN_OBRA (Administrador)           │
│  - Asigna trabajadores a SU obra       │
│  - Ve gastos de SU obra                │
│  - Aprueba gastos de SU obra           │
└─────────────┬──────────────────────────┘
              │
              │ asigna
              ▼
┌────────────────────────────────────────┐
│       TRABAJADOR                       │
│  - Registra gastos                     │
│  - Ve solo SUS gastos                  │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│   CONTABILIDAD (Solo lectura)          │
│  - Ve TODO                             │
│  - NO aprueba                          │
└────────────────────────────────────────┘
```

---

## 🚀 INICIO RÁPIDO

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Proyecto-Inmobiliaria-San-Felipe.git
cd Proyecto-programacion-Movil-Inmobiliaria-San-Felipe-S.A.C
```

### 2️⃣ Configurar Backend

```bash
cd Backend-Inmobiliaria
npm install

# Crear un .env en el backend y colocar el

npm run dev
```

**Backend corriendo en:** `http://localhost:3000`

### 3️⃣ Configurar Frontend

```bash
cd ../Movil-Inmobiliaria
npm install
echo "API_URL=http://localhost:3000" > .env
npm start
```

**Expo corriendo en:** `http://localhost:19006`

### Login

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `Admin123456`
- Rol: MODERADOR

---

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/refresh` | Refrescar token |
| GET | `/api/auth/me` | Obtener perfil |

### Proyectos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/projects` | Crear proyecto |
| GET | `/api/projects` | Listar proyectos |
| POST | `/api/projects/:id/assign` | Asignar personal |
| GET | `/api/projects/:id/team` | Ver equipo |

### Gastos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/expenses` | Registrar gasto |
| GET | `/api/expenses` | Listar gastos |
| PUT | `/api/expenses/:id/approve` | Aprobar gasto |
| PUT | `/api/expenses/:id/reject` | Rechazar gasto |

---

### Flujo 1: Configuración de Obra

```
MODERADOR → Crea proyecto "Edificio San Felipe"
         → Asigna Jorge como ADMINISTRADOR
         → Jorge recibe notificación
```

### Flujo 2: Asignación de Personal

```
ADMIN (Jorge) → Ve sus proyectos
              → Asigna Gian y Javier como TRABAJADORES
              → Trabajadores reciben notificación
```

### Flujo 3: Registro de Gasto

```
TRABAJADOR (Gian) → Registra gasto con comprobante
                  → Estado: PENDIENTE
                  → Jorge recibe notificación
```

### Flujo 4: Aprobación de Gasto

```
ADMIN (Jorge) → Ve gastos pendientes
              → Revisa comprobante
              → Aprueba gasto
              → Presupuesto se actualiza
              → Gian recibe notificación
```

## 🛠️ TECNOLOGÍAS

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Base de Datos:** MongoDB + Mongoose
- **Lenguaje:** TypeScript
- **Autenticación:** JWT (jsonwebtoken + bcryptjs)
- **Upload:** Multer + Cloudinary
- **Validación:** Express Validator
- **Seguridad:** Helmet, CORS, Rate Limiting

### Frontend

- **Framework:** React Native
- **Build Tool:** Expo
- **Navegación:** React Navigation
- **Estado:** Zustand
- **HTTP Client:** Axios
- **Lenguaje:** TypeScript
- **Storage:** AsyncStorage
- **UI:** React Native Paper (opcional)

---

## 📊 MODELOS DE DATOS

### User (Usuario)

```typescript
{
  username: string;          // único
  password: string;          // hasheado
  fullName: string;
  role: UserRole;           // MODERADOR | ADMIN_OBRA | TRABAJADOR
  dni: string;              // único
  email: string;            // único
  phone: string;
  isActive: boolean;
  // ... más campos
}
```

### Project (Obra/Proyecto)

```typescript
{
  name: string;
  code: string;             // único (ej: "OBR-2025-001")
  location: string;
  budget: number;           // presupuesto total
  currentSpent: number;     // gasto acumulado
  status: ProjectStatus;    // ACTIVO | PAUSADO | FINALIZADO
  createdBy: ObjectId;      // MODERADOR
  // ... más campos
}
```

### Expense (Gasto)

```typescript
{
  project: ObjectId;
  user: ObjectId;
  description: string;
  amount: number;
  category: ExpenseCategory;
  status: ExpenseStatus;    // PENDIENTE | APROBADO | RECHAZADO
  receiptUrl: string;       // URL de comprobante
  approvedBy: ObjectId;
  // ... más campos
}
```
---

<div align="center">

**Hecho por el equipo de San Felipe SAC**

</div>
