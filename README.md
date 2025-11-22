# Marketplace de Servicios con Insumos

**Trabajo Práctico 2025**

Sistema web desarrollado en React que implementa un marketplace para conectar solicitantes de servicios con proveedores de servicios y proveedores de insumos. Permite gestionar el ciclo completo desde la publicación de servicios hasta la asignación de cotizaciones y la gestión de insumos necesarios.

---

## 📑 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Uso de la Aplicación](#uso-de-la-aplicación)
6. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
7. [Funcionalidades Implementadas](#funcionalidades-implementadas)
8. [Modelos de Datos](#modelos-de-datos)
9. [Gestión de Estado](#gestión-de-estado)
10. [Persistencia de Datos](#persistencia-de-datos)
11. [Estructura de Carpetas](#estructura-de-carpetas)
12. [Scripts Disponibles](#scripts-disponibles)
13. [Seguridad y Rutas Protegidas](#seguridad-y-rutas-protegidas)
14. [Características de UI/UX](#características-de-uiux)
15. [Testing y Validaciones](#testing-y-validaciones)
16. [Notas Técnicas](#notas-técnicas)
17. [Licencia](#licencia)

---

## 📋 Descripción del Proyecto

Este proyecto implementa un **marketplace de servicios** que permite:

- **Solicitantes** publicar servicios con sus requerimientos específicos, incluyendo insumos necesarios
- **Proveedores de servicios** cotizar servicios publicados y gestionar sus ofertas
- **Proveedores de insumos** publicar insumos individuales y crear packs personalizados para servicios específicos
- **Sistema de comparación** para que los solicitantes puedan evaluar y seleccionar la mejor cotización
- **Gestión de stock** automática para insumos cuando se crean packs

La aplicación está desarrollada siguiendo principios de **arquitectura limpia**, **separación de responsabilidades** y **reutilización de componentes**.

---

## 💻 Requisitos del Sistema

### Requisitos Mínimos

- **Node.js**: Versión 18.0.0 o superior
- **npm**: Versión 9.0.0 o superior
- **Navegador moderno**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Verificar Versiones

```bash
node --version
npm --version
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend Framework
- **React 19.2.0** - Biblioteca JavaScript para construir interfaces de usuario
- **React Router DOM 7.9.6** - Enrutamiento declarativo para aplicaciones React

### Estilos y UI
- **Bootstrap 5.3.8** - Framework CSS para diseño responsive
- **CSS3** - Estilos personalizados con animaciones y gradientes

### Herramientas de Desarrollo
- **Vite 7.2.2** - Build tool y servidor de desarrollo de próxima generación
- **ESLint 9.39.1** - Linter para mantener calidad de código
- **UUID 13.0.0** - Generación de identificadores únicos

### Arquitectura
- **Context API** - Gestión de estado global
- **useReducer** - Manejo de estado complejo
- **Feature-based Architecture** - Organización por funcionalidades

---

## 🚀 Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd web
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias definidas en `package.json`.

### Paso 3: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Paso 4: Compilar para Producción (Opcional)

```bash
npm run build
npm run preview
```

---

## 👥 Uso de la Aplicación

### Usuarios de Prueba

El sistema incluye tres usuarios preconfigurados para testing:

| Rol | Email | Contraseña | Descripción |
|-----|-------|------------|-------------|
| **SOLICITANTE** | `solicitante@mail.com` | `123` | Usuario que publica servicios |
| **PROVEEDOR_SERVICIO** | `servicio@mail.com` | `123` | Usuario que cotiza servicios |
| **PROVEEDOR_INSUMOS** | `insumos@mail.com` | `123` | Usuario que vende insumos |

### Flujo de Trabajo Básico

1. **Iniciar sesión** con uno de los usuarios de prueba
2. **Navegar** según el rol asignado
3. **Realizar acciones** específicas de cada rol
4. Los datos se **persisten automáticamente** en localStorage

---

## 🏗️ Arquitectura del Proyecto

### Patrón de Arquitectura

El proyecto sigue una **arquitectura basada en features** (Feature-based Architecture), donde cada funcionalidad está encapsulada en su propia carpeta con sus componentes, páginas y lógica de negocio.

### Principios Aplicados

- **Separación de Responsabilidades**: Cada módulo tiene una responsabilidad única
- **Reutilización**: Componentes UI compartidos en `src/ui/`
- **Mantenibilidad**: Código organizado y fácil de extender
- **Escalabilidad**: Estructura que permite agregar nuevas features fácilmente

### Flujo de Datos

```
Usuario → Componente → API Mock → localStorage → Estado Global (Context) → UI Actualizada
```

---

## ✨ Funcionalidades Implementadas

### 1. Sistema de Autenticación

- Login con validación de credenciales
- Gestión de sesión con localStorage
- Redirección automática según rol
- Protección de rutas basada en roles

### 2. Gestión de Servicios (Solicitante)

#### Publicar Servicio
- Formulario completo con validaciones
- Campos: título, descripción, categoría, dirección, ciudad, fecha preferida
- **Sistema de insumos requeridos**: Agregar múltiples insumos con nombre y cantidad
- Validación de fechas (no permite fechas pasadas)

#### Listar Servicios
- Vista de todos los servicios del solicitante
- Estadísticas: total, publicados, asignados
- Cards con información resumida
- Filtrado y búsqueda

#### Detalle de Servicio
- Información completa del servicio
- Lista de insumos requeridos
- **Packs de insumos disponibles** con precios
- **Cotizaciones recibidas** con detalles del proveedor
- Botón para comparar cotizaciones

### 3. Sistema de Cotizaciones (Proveedor de Servicio)

#### Ver Servicios Disponibles
- Lista de servicios publicados por otros usuarios
- Filtrado automático: excluye servicios ya cotizados
- Acceso directo para cotizar

#### Crear Cotización
- Formulario con precio, plazo y detalles
- Validación: no permite cotizar el mismo servicio dos veces
- Persistencia inmediata en localStorage

#### Mis Cotizaciones
- Vista de todas las cotizaciones enviadas
- Estado de cada cotización (en evaluación, seleccionada)
- Información del servicio relacionado

### 4. Comparador de Cotizaciones

- Ordenamiento por: precio, plazo, rating
- Vista comparativa de todas las ofertas
- Selección de cotización ganadora
- Actualización automática del estado del servicio a "ASIGNADO"

### 5. Gestión de Insumos (Proveedor de Insumos)

#### Publicar Insumo Individual
- Formulario con: nombre, categoría, precio unitario, unidad, stock
- Validaciones de campos obligatorios
- Persistencia en localStorage

#### Crear Pack de Insumos
- Selección de servicio (muestra insumos requeridos)
- Agregar insumos desde catálogo propio o manualmente
- **Validación de stock** antes de crear pack
- **Cálculo automático** del precio total
- **Actualización automática de stock** al crear pack

#### Mis Insumos
- Dashboard con estadísticas:
  - Insumos publicados
  - Packs creados
  - Valor total del inventario
- Lista de insumos individuales con indicadores de stock
- Lista de packs creados con detalles

---

## 📊 Modelos de Datos

### Usuario (User)
```javascript
{
  id: string,
  nombre: string,
  email: string,
  password: string,
  rol: "SOLICITANTE" | "PROVEEDOR_SERVICIO" | "PROVEEDOR_INSUMOS",
  token?: string
}
```

### Servicio (Service)
```javascript
{
  id: string,
  titulo: string,
  descripcion: string,
  categoria: string,
  direccion: string,
  ciudad: string,
  fechaPreferida: string,
  solicitanteId: string,
  estado: "PUBLICADO" | "ASIGNADO",
  cotizacionSeleccionadaId: string | null,
  insumosRequeridos: Array<{ nombre: string, cantidad: string }>,
  createdAt?: string
}
```

### Cotización (Quote)
```javascript
{
  id: string,
  serviceId: string,
  proveedorId: string,
  precio: number,
  plazoDias: number,
  detalle: string,
  ratingProveedorMock: number,
  createdAt: string
}
```

### Insumo (Supply)
```javascript
{
  id: string,
  vendedorId: string,
  nombre: string,
  categoria: string,
  precioUnit: number,
  unidad: string,
  stock: number
}
```

### Pack de Insumos (SupplyPack)
```javascript
{
  id: string,
  vendedorId: string,
  serviceId: string,
  items: Array<{
    nombre: string,
    cantidad: number,
    precioUnit: number,
    insumoId?: string
  }>,
  precioTotal: number,
  createdAt: string
}
```

---

## 🔄 Gestión de Estado

### Context API + useReducer

El proyecto utiliza **Context API** para el estado global combinado con **useReducer** para manejar acciones complejas.

### Estado Global (initialState)
```javascript
{
  currentUser: User | null,
  services: Service[],
  quotes: Quote[],
  supplies: Supply[],
  supplyOffers: SupplyPack[]
}
```

### Acciones Disponibles
- `LOGIN` - Autenticar usuario
- `LOGOUT` - Cerrar sesión
- `ADD_SERVICE` - Agregar nuevo servicio
- `SET_SERVICES` - Establecer lista de servicios
- `ADD_QUOTE` - Agregar nueva cotización
- `SET_QUOTES` - Establecer lista de cotizaciones
- `SELECT_QUOTE` - Seleccionar cotización ganadora
- `ADD_SUPPLY` - Agregar insumo
- `SET_SUPPLIES` - Establecer lista de insumos
- `ADD_SUPPLY_OFFER` - Agregar pack de insumos
- `SET_SUPPLY_OFFERS` - Establecer lista de packs

---

## 💾 Persistencia de Datos

### localStorage

El proyecto utiliza **localStorage** del navegador para persistir datos entre sesiones:

| Key | Descripción |
|-----|-------------|
| `user` | Usuario autenticado actual |
| `servicesDB` | Base de datos de servicios |
| `quotesDB` | Base de datos de cotizaciones |
| `suppliesDB` | Base de datos de insumos |
| `packDB` | Base de datos de packs de insumos |


## 📁 Estructura de Carpetas

```
web/
├── public/                 # Archivos estáticos
├── src/
│   ├── context/           # Gestión de estado global
│   │   ├── AppContext.js
│   │   ├── AppProvider.jsx
│   │   ├── AppReducer.js
│   │   └── initialState.js
│   │
│   ├── core/             # Lógica compartida
│   │   ├── helpers/      # Funciones auxiliares
│   │   │   ├── errorHandler.js
│   │   │   └── getUserName.js
│   │   ├── logic/        # Funciones de negocio
│   │   │   ├── calculatePackPrice.js
│   │   │   ├── filterServices.js
│   │   │   ├── sortQuotes.js
│   │   │   └── validateService.js
│   │   └── models/       # Modelos de datos
│   │       ├── Quote.js
│   │       ├── Service.js
│   │       ├── Supply.js
│   │       └── User.js
│   │
│   ├── features/         # Funcionalidades por dominio
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── authApi.js
│   │   │   └── pages/
│   │   │       └── LoginPage.jsx
│   │   │
│   │   ├── servicios/
│   │   │   ├── api/
│   │   │   │   └── serviciosApi.js
│   │   │   ├── components/
│   │   │   │   ├── ServicioCard.jsx
│   │   │   │   └── InsumosRequeridos.jsx
│   │   │   └── pages/
│   │   │       ├── ListaServicios.jsx
│   │   │       ├── CrearServicio.jsx
│   │   │       └── DetalleServicio.jsx
│   │   │
│   │   ├── cotizaciones/
│   │   │   ├── api/
│   │   │   │   └── cotizacionesApi.js
│   │   │   ├── components/
│   │   │   │   └── CotizacionForm.jsx
│   │   │   └── pages/
│   │   │       ├── ServiciosParaCotizar.jsx
│   │   │       ├── CrearCotizacion.jsx
│   │   │       └── MisCotizaciones.jsx
│   │   │
│   │   ├── insumos/
│   │   │   ├── api/
│   │   │   │   └── insumosApi.js
│   │   │   ├── components/
│   │   │   │   └── SupplyCard.jsx
│   │   │   └── pages/
│   │   │       ├── MisInsumos.jsx
│   │   │       ├── CrearInsumo.jsx
│   │   │       └── CrearPackInsumos.jsx
│   │   │
│   │   └── comparador/
│   │       ├── api/
│   │       │   └── comparadorApi.js
│   │       ├── components/
│   │       │   └── ComparadorCard.jsx
│   │       └── pages/
│   │           └── Comparador.jsx
│   │
│   ├── routes/          # Configuración de rutas
│   │   ├── RouterApp.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── ui/              # Componentes reutilizables
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Navbar.jsx
│   │   └── layout/
│   │       ├── AuthLayout.jsx
│   │       └── DashboardLayout.jsx
│   │
│   ├── styles/          # Estilos globales
│   │   ├── global.css
│   │   └── theme.css
│   │
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 📜 Scripts Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo de Vite en modo hot-reload.

### Producción
```bash
npm run build
```
Compila la aplicación para producción, generando archivos optimizados en la carpeta `dist/`.

```bash
npm run preview
```
Previsualiza el build de producción localmente.

### Calidad de Código
```bash
npm run lint
```
Ejecuta ESLint para verificar la calidad del código y detectar posibles errores.

---

## 🔒 Seguridad y Rutas Protegidas

### Sistema de Protección de Rutas

El proyecto implementa un sistema de **rutas protegidas** basado en roles:

- **`/servicios/*`** - Solo accesible para `SOLICITANTE`
- **`/cotizaciones/*`** - Solo accesible para `PROVEEDOR_SERVICIO`
- **`/insumos/*`** - Solo accesible para `PROVEEDOR_INSUMOS`
- **`/login`** - Ruta pública

Si un usuario intenta acceder a una ruta no autorizada, es redirigido automáticamente al login.

---

## 🎨 Características de UI/UX

### Diseño Responsive
- Adaptable a dispositivos móviles, tablets y desktop
- Breakpoints de Bootstrap 5
- Navegación optimizada para touch

### Animaciones y Transiciones
- Efectos `fadeIn` y `fadeInUp` para carga de contenido
- Hover effects con `scale-hover`
- Transiciones suaves en interacciones

### Componentes Reutilizables
- `EmptyState` - Estado vacío con mensajes personalizados
- `Navbar` - Barra de navegación con menú según rol
- `Card` - Tarjetas con estilos consistentes
- `Button` - Botones con variantes

### Feedback Visual
- Estados de carga con spinners
- Mensajes de error y éxito
- Validaciones en tiempo real
- Indicadores de estado (badges, colores)

---

## 🧪 Testing y Validaciones

### Validaciones Implementadas

#### Formularios
- Campos obligatorios
- Validación de email
- Validación de fechas (no pasadas)
- Validación de números positivos
- Validación de stock disponible

#### Lógica de Negocio
- Prevención de cotizaciones duplicadas
- Validación de stock al crear packs
- Verificación de permisos por rol

---

## 📝 Notas Técnicas

### Mock APIs
Las llamadas a API están simuladas con delays para simular latencia real:
- Delay promedio: 300-350ms
- Simulación de errores de red
- Persistencia en localStorage

### Manejo de Errores
- Sistema centralizado de manejo de errores
- Mensajes amigables para el usuario
- Logging de errores en desarrollo

### Optimizaciones
- Lazy loading de componentes (preparado)
- Código modular y reutilizable
- Minimización de re-renders innecesarios




## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.

---

**Versión:** 1.0.0  
**Última actualización:** 2025
