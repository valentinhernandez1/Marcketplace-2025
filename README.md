# 🛒 Marketplace de Servicios con Insumos

Aplicación web desarrollada con React + Vite para gestionar servicios, cotizaciones e insumos según la consigna del trabajo práctico 2025.

## 📋 Descripción

Marketplace que permite a diferentes tipos de usuarios:
- **Solicitantes**: Publicar servicios y recibir cotizaciones
- **Proveedores de Servicios**: Cotizar servicios publicados
- **Proveedores de Insumos**: Publicar insumos y crear packs para servicios

## 🚀 Tecnologías Utilizadas

- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación
- **Bootstrap 5** - Estilos y componentes
- **Context API** - Gestión de estado global
- **LocalStorage** - Persistencia de datos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 👥 Usuarios de Prueba

- **Solicitante**: `solicitante@mail.com` / `123`
- **Proveedor Servicio**: `servicio@mail.com` / `123`
- **Proveedor Insumos**: `insumos@mail.com` / `123`

## ✨ Funcionalidades Implementadas

### Para Solicitantes
- ✅ Publicar servicios con requerimientos de insumos
- ✅ Ver todas las cotizaciones recibidas en el detalle del servicio
- ✅ Comparar cotizaciones (precio, plazo, rating)
- ✅ Seleccionar cotización ganadora
- ✅ Ver packs de insumos disponibles para el servicio
- ✅ Estadísticas de servicios (total, publicados, asignados)

### Para Proveedores de Servicios
- ✅ Ver servicios disponibles para cotizar
- ✅ Enviar cotizaciones con precio, plazo y detalle
- ✅ Validación: no puede cotizar el mismo servicio dos veces
- ✅ Ver mis cotizaciones enviadas
- ✅ Los servicios ya cotizados se filtran automáticamente

### Para Proveedores de Insumos
- ✅ Publicar insumos individuales con stock, precio y categoría
- ✅ Crear packs de insumos para servicios específicos
- ✅ Agregar insumos desde los publicados o manualmente
- ✅ Validación de stock al crear packs
- ✅ Reducción automática de stock al crear packs
- ✅ Ver estadísticas de inventario (cantidad, packs, valor total)
- ✅ Gestión de stock en tiempo real

## 🎨 Mejoras de UI/UX Implementadas

- ✅ Diseño moderno con gradientes y animaciones suaves
- ✅ Cards con efectos hover y sombras profesionales
- ✅ Botones con gradientes y efectos ripple
- ✅ Navbar sticky con efecto glassmorphism
- ✅ Estadísticas con cards con gradientes
- ✅ Empty states mejorados
- ✅ Validaciones y mensajes de error claros
- ✅ Loading states en formularios
- ✅ Diseño responsive

## 🔧 Mejoras Técnicas Implementadas

- ✅ Helpers reutilizables (`getUserName`, `errorHandler`)
- ✅ Validación de stock al crear packs
- ✅ Prevención de cotizaciones duplicadas
- ✅ Persistencia en localStorage
- ✅ Gestión de estado con Context API y Reducer
- ✅ Estructura de carpetas por features
- ✅ Separación de lógica de negocio

## 📁 Estructura del Proyecto

```
src/
├── context/          # Estado global (Context API + Reducer)
├── core/             # Lógica de negocio
│   ├── helpers/      # Funciones auxiliares (getUserName, errorHandler)
│   ├── logic/        # Funciones de cálculo (calculatePackPrice, sortQuotes)
│   └── models/       # Modelos de datos (Service, Quote, Supply, User)
├── features/         # Funcionalidades por dominio
│   ├── auth/         # Autenticación y login
│   ├── servicios/    # CRUD de servicios
│   ├── cotizaciones/ # Gestión de cotizaciones
│   ├── insumos/      # Gestión de insumos y packs
│   └── comparador/   # Comparador de cotizaciones
├── routes/           # Configuración de rutas y protección
├── styles/           # Estilos globales (global.css, theme.css)
└── ui/               # Componentes reutilizables (Navbar, Card, Button, etc.)
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run lint` - Ejecuta el linter (ESLint)

## 📝 Notas Importantes

- Los datos se persisten en `localStorage` (no requiere backend)
- API mockeada con delays simulados
- Diseño responsive y moderno
- Validaciones en frontend

## 📄 Consigna

Este proyecto fue desarrollado según la consigna del "Trabajo Práctico 2025 - Marketplace de Servicios con Insumos".
