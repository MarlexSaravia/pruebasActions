# Backend - Inmobiliaria San Felipe S.A.C

Sistema de gestión de gastos con estructura jerárquica de roles para obras de construcción.

## 📋 Características

- **Autenticación JWT** con tokens de acceso y refresh
- **Sistema de roles jerárquico**: MODERADOR → ADMIN_OBRA → TRABAJADOR
- **Gestión de proyectos/obras** con presupuestos
- **Asignación de personal** a obras específicas
- **Registro y aprobación de gastos** con comprobantes
- **Notificaciones** en tiempo real
- **Upload de imágenes** a Cloudinary
- **Validaciones** robustas con MongoDB

## 🏗️ Arquitectura

```
Backend-Inmobiliaria/
├── src/
│   ├── models/              # Modelos de MongoDB (User, Project, Expense, etc.)
│   ├── controllers/         # Lógica de negocio
│   ├── routes/              # Definición de rutas
│   ├── middlewares/         # Auth, autorización, upload, errores
│   ├── services/            # Servicios auxiliares
│   ├── config/              # Configuración (DB, Cloudinary)
│   ├── utils/               # Utilidades (JWT, formatters)
│   ├── types/               # TypeScript types e interfaces
│   └── server.ts            # Punto de entrada
├── uploads/                 # Archivos temporales
├── package.json
├── tsconfig.json
└── .env
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd Backend-Inmobiliaria
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

**Variables críticas:**

```env
MONGODB_URI=mongodb://localhost:27017/inmobiliaria-san-felipe
JWT_SECRET=tu-secret-key-super-segura
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

### 3. Instalar MongoDB

**Opción A: MongoDB Local**

```bash
# Windows (con Chocolatey)
choco install mongodb

# macOS
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb
```

**Opción B: MongoDB Atlas (Cloud)**

1. Ir a [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cuenta gratuita
3. Crear cluster
4. Obtener connection string
5. Actualizar `MONGODB_URI` en `.env`

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

## 📡 Endpoints API

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/register` | Registrar usuario | Sí (MODERADOR/ADMIN) |
| POST | `/api/auth/refresh` | Refrescar token | No |
| GET | `/api/auth/me` | Obtener perfil | Sí |

**Login:**
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "Admin123456"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Proyectos

| Método | Ruta | Descripción | Rol requerido |
|--------|------|-------------|---------------|
| POST | `/api/projects` | Crear proyecto | MODERADOR |
| GET | `/api/projects` | Listar proyectos | Cualquiera |
| POST | `/api/projects/:id/assign` | Asignar personal | MODERADOR/ADMIN |
| GET | `/api/projects/:id/team` | Ver equipo | Cualquiera |

**Crear proyecto:**
```json
POST /api/projects
Authorization: Bearer {accessToken}
{
  "name": "Edificio Los Olivos",
  "code": "OBR-2025-001",
  "location": "Los Olivos, Lima",
  "description": "Construcción de edificio residencial",
  "budget": 500000,
  "startDate": "2025-01-01"
}
```

### Gastos

| Método | Ruta | Descripción | Rol requerido |
|--------|------|-------------|---------------|
| POST | `/api/expenses` | Registrar gasto | Cualquiera (asignado) |
| GET | `/api/expenses` | Listar gastos | Filtrado por rol |
| PUT | `/api/expenses/:id/approve` | Aprobar gasto | MODERADOR/ADMIN |
| PUT | `/api/expenses/:id/reject` | Rechazar gasto | MODERADOR/ADMIN |

**Registrar gasto:**
```json
POST /api/expenses
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
  "projectId": "...",
  "date": "2025-01-15",
  "description": "Compra de cemento",
  "amount": 450.50,
  "category": "MATERIALES",
  "receipt": <archivo imagen>
}
```

**Filtrar gastos:**
```
GET /api/expenses?projectId=123&status=PENDIENTE&startDate=2025-01-01
```

## 🔐 Sistema de Roles

### Jerarquía

```
MODERADOR (Dueño/Gerente)
    ├── Crea proyectos
    ├── Asigna administradores de obra
    ├── Ve TODO
    └── Aprueba TODO

ADMIN_OBRA (Administrador de Obra)
    ├── Asigna trabajadores a SU obra
    ├── Ve gastos de SU obra
    └── Aprueba gastos de SU obra

TRABAJADOR
    ├── Registra gastos
    └── Ve solo SUS gastos

CONTABILIDAD (Solo lectura)
    ├── Ve TODO
    └── NO aprueba
```

### Matriz de Permisos

| Acción | MODERADOR | ADMIN_OBRA | TRABAJADOR | CONTABILIDAD |
|--------|-----------|------------|------------|--------------|
| Crear obra | ✅ | ❌ | ❌ | ❌ |
| Ver todas las obras | ✅ | ❌ | ❌ | ✅ |
| Asignar admin a obra | ✅ | ❌ | ❌ | ❌ |
| Asignar trabajadores | ✅ | ✅ (su obra) | ❌ | ❌ |
| Registrar gasto | ✅ | ✅ | ✅ | ❌ |
| Ver todos los gastos | ✅ | ❌ | ❌ | ✅ |
| Aprobar gastos | ✅ | ✅ (su obra) | ❌ | ❌ |

## 🗄️ Modelos de Datos

### User

```typescript
{
  username: string;          // único
  password: string;          // hasheado
  fullName: string;
  role: UserRole;           // MODERADOR | ADMIN_OBRA | TRABAJADOR | CONTABILIDAD
  area: string;
  dni: string;              // único
  age: number;
  gender: string;
  phone: string;
  email: string;            // único
  address: string;
  profilePhoto?: string;
  isActive: boolean;
  createdBy?: ObjectId;
}
```

### Project

```typescript
{
  name: string;
  code: string;             // único (ej: "OBR-2025-001")
  location: string;
  description: string;
  budget: number;
  currentSpent: number;     // calculado
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;    // ACTIVO | PAUSADO | FINALIZADO
  createdBy: ObjectId;      // MODERADOR
}
```

### Expense

```typescript
{
  project: ObjectId;
  user: ObjectId;
  date: Date;
  description: string;
  amount: number;
  category: ExpenseCategory;  // TRANSPORTE | MATERIALES | etc.
  status: ExpenseStatus;      // PENDIENTE | APROBADO | RECHAZADO
  receiptUrl?: string;
  approvedBy?: ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
}
```

## 🔄 Flujos Principales

### 1. Configuración Inicial

```
1. MODERADOR crea proyecto "Edificio San Felipe"
   POST /api/projects

2. MODERADOR asigna a Jorge como ADMINISTRADOR
   POST /api/projects/{id}/assign
   { userId: "jorge_id", roleInProject: "ADMINISTRADOR" }

3. Jorge recibe notificación
```

### 2. Asignación de Personal

```
1. Jorge (ADMIN) ve su proyecto
   GET /api/projects

2. Jorge asigna a Gian, Javier como TRABAJADORES
   POST /api/projects/{id}/assign
   { userId: "gian_id", roleInProject: "TRABAJADOR" }

3. Trabajadores reciben notificación
```

### 3. Registro y Aprobación de Gasto

```
1. Gian registra gasto con comprobante
   POST /api/expenses
   Form: { projectId, amount: 50, description: "Transporte", receipt: file }

2. Jorge recibe notificación

3. Jorge aprueba gasto
   PUT /api/expenses/{id}/approve

4. Gasto se suma al currentSpent del proyecto
5. Gian recibe notificación de aprobación
```

## 🛡️ Seguridad

- **Contraseñas hasheadas** con bcrypt (10 salt rounds)
- **JWT** con tokens de acceso (24h) y refresh (7d)
- **Validación de entrada** con express-validator
- **NoSQL Injection** prevenida con express-mongo-sanitize
- **Rate limiting** (100 req/15min por IP)
- **CORS** configurado
- **Helmet** para headers de seguridad

## 📝 Scripts

```bash
npm run dev       # Desarrollo con hot-reload
npm run build     # Compilar TypeScript a JS
npm start         # Producción (requiere build)
npm run seed      # Poblar DB con datos iniciales
npm test          # Ejecutar tests
```

## 🧪 Testing

Crear usuarios de prueba:

```bash
# Iniciar servidor
npm run dev

# En otra terminal, hacer requests
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123456"}'
```

## 📦 Deploy

### Opción 1: Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Opción 2: Render

1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Build command: `npm install && npm run build`
4. Start command: `npm start`

## 🐛 Troubleshooting

**MongoDB no conecta:**
```bash
# Verificar que MongoDB esté corriendo
# Windows
sc query MongoDB

# Mac/Linux
brew services list
sudo systemctl status mongod
```

**Error de Cloudinary:**
- Verificar que las credenciales en `.env` sean correctas
- Crear carpeta `uploads/temp` manualmente

**Puerto en uso:**
```bash
# Cambiar puerto en .env
PORT=3001
```

## 📚 Próximas Funcionalidades

- [ ] WebSockets para notificaciones en tiempo real
- [ ] Reportes en PDF con node-pdf
- [ ] Dashboard de estadísticas
- [ ] Exportación de datos a Excel
- [ ] Gráficos de gastos por categoría
- [ ] Sistema de backup automático

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Inmobiliaria San Felipe S.A.C - Uso interno

---

**Desarrollado con ❤️ por el equipo de San Felipe**
