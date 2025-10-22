# 💅 StyleBook-Frontend

<div align="center">

![StyleBook Banner](https://via.placeholder.com/1200x300/9333EA/FFFFFF?text=StyleBook+-+Plataforma+de+Reservas+de+Belleza)

**Plataforma moderna de reservas para servicios de belleza y estética**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-F69220?logo=pnpm)](https://pnpm.io/)

[Demo](https://stylebook-demo.vercel.app) · [Documentación](./docs/INDEX.md) · [API Docs](./api-docs/PROJECT_GUIDE.md)

</div>

---

## 🌟 Características

- ✨ **Gradient Flow Design** - Interfaz vibrante con degradados purple → pink → orange
- 🎨 **Tipografía Premium** - Playfair Display + Poppins para máximo impacto
- ⚡ **Next.js 15 App Router** - Renderizado optimizado con React 19
- 🔐 **Autenticación JWT** - Login seguro con tokens bearer
- 📱 **100% Mobile-First** - Diseño optimizado para móvil (80%+ usuarios)
- 🎯 **TypeScript Strict** - Tipado robusto sin `any`
- 🧩 **Componentes Modulares** - Radix UI + shadcn/ui
- 🚀 **Performance** - Optimizado con SWC y code splitting
- 📅 **Manejo de Fechas** - Conversión automática UTC ↔ Local
- 🎭 **Animaciones Fluidas** - Transiciones smooth con CSS

---

## 🚀 Quick Start

### Prerequisitos

- **Node.js** v18+
- **pnpm** v8+
- **Backend API** corriendo en `http://localhost:3001/api`

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/stylebook-frontend.git
cd stylebook-frontend

# Instalar dependencias
pnpm install

# Crear archivo de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🏗️ Estructura del Proyecto

```
stylebook-frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rutas públicas (login, register)
│   ├── (dashboard)/         # Rutas protegidas (client, provider)
│   ├── globals.css          # Estilos globales + Tailwind
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Hero page
├── components/              # Componentes globales reutilizables
│   ├── Button.tsx           # Botón con gradient flow
│   ├── Card.tsx             # Card con animaciones
│   └── Badge.tsx            # Badge con gradient subtle
├── lib/                     # Lógica compartida
│   ├── api/                 # Funciones para llamadas API
│   ├── hooks/               # Custom React hooks
│   ├── types/               # Definiciones TypeScript
│   ├── utils/               # Utilidades (cn, dateUtils)
│   └── constants.ts         # Constantes globales
├── store/                   # Zustand stores
│   └── authStore.ts         # Estado de autenticación
├── public/                  # Archivos estáticos
├── docs/                    # Documentación del proyecto
└── api-docs/                # Docs del backend (read-only)
```

---

## 🎨 Design System

### Paleta de Colores (Gradient Flow)

| Color     | Hex       | RGB             | Uso                |
| --------- | --------- | --------------- | ------------------ |
| Purple    | `#9333EA` | `147, 51, 234`  | Gradient principal |
| Pink      | `#EC4899` | `236, 72, 153`  | Gradient medio     |
| Orange    | `#F97316` | `249, 115, 22`  | Gradient final     |
| Slate-50  | `#F8FAFC` | `248, 250, 252` | Backgrounds        |
| Slate-900 | `#0F172A` | `15, 23, 42`    | Textos principales |

### Tipografías

- **Playfair Display** (600, 700, 800) - Títulos elegantes
- **Poppins** (400, 500, 600, 700, 800) - Textos body

### Responsive Mobile-First

⚠️ **CRÍTICO:** 80%+ de usuarios acceden desde móvil.

**Breakpoints:**

- Default: Móvil (320px-768px)
- `md:` Tablet (768px-1024px)
- `lg:` Desktop (1024px+)

**Ejemplo:**

```tsx
<div className="px-4 md:px-8 lg:px-16">
  <h1 className="text-2xl md:text-4xl lg:text-5xl">Título</h1>
</div>
```

### Componentes Base

```tsx
// Botón con gradient
<Button variant="primary" size="lg">
  Comenzar Ahora
</Button>

// Card con animación
<Card
  icon="🔍"
  title="Búsqueda Inteligente"
  description="Encuentra servicios cerca de ti"
/>

// Badge con gradient subtle
<Badge variant="primary" icon="✨">
  Bienvenido
</Badge>
```

---

## 📦 Stack Tecnológico

### Core

- **Next.js** 15.5.6 - Framework React
- **React** 19.1.0 - Librería UI
- **TypeScript** 5.3.0 - Tipado estático

### Styling

- **Tailwind CSS** 4.0.0 - Utility-first CSS
- **Radix UI** - Componentes headless accesibles
- **CVA** - Component variants authority
- **clsx + tailwind-merge** - Gestión de clases

### State Management

- **Zustand** 4.5.7 - Estado global simple
- **TanStack Query** 5.90.5 - Cache & sincronización API

### Forms & Validation

- **React Hook Form** 7.65.0 - Formularios performantes
- **Zod** 3.25.76 - Validación TypeScript-first

### Date & Time

- **date-fns** 3.6.0 - Utilidades de fechas
- **React Day Picker** 8.10.1 - Selector de fechas

### Developer Experience

- **ESLint** 9.0.0 - Linter
- **Prettier** 3.6.2 - Formateador de código
- **Vitest** 1.6.1 - Testing framework
- **Testing Library** - Testing de componentes

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Servidor desarrollo (localhost:3000)
pnpm build            # Build para producción
pnpm start            # Servidor producción

# Calidad de código
pnpm lint             # Revisar errores ESLint
pnpm lint:fix         # Arreglar errores automáticamente
pnpm format           # Formatear código con Prettier
pnpm type-check       # Verificar tipos TypeScript

# Testing
pnpm test             # Ejecutar tests con Vitest
pnpm test:ui          # Interfaz gráfica de tests
pnpm test:coverage    # Reporte de cobertura
```

---

## 📝 Convenciones de Código

### TypeScript Strict

**❌ Prohibido:**

- `any` - Nunca usar
- `null` - Usar `undefined`
- `void` - Solo en callbacks
- `{}` - Tipo genérico vacío

**✅ Obligatorio:**

- Tipado explícito en todas las funciones
- Return types: `React.ReactNode`, `Promise<Result<T>>`
- Tipos específicos por dominio en `/lib/types/`

### Ejemplo de Componente

```tsx
interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Card({
  title,
  description,
  icon,
  className = '',
}: CardProps): React.ReactNode {
  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="font-playfair text-2xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
```

### Reglas de Fechas

```
1. Usuario SIEMPRE ve fechas en su timezone local
2. Backend almacena TODO en UTC
3. Frontend ENVÍA fechas en local time (NO UTC)
4. NUNCA hacer conversiones UTC manuales
```

### Reglas Responsive

```tsx
// ✅ SIEMPRE - Mobile first
<div className="px-4 py-6 md:px-8 md:py-12 lg:px-16">
  <h1 className="text-2xl md:text-4xl lg:text-5xl">
    Título
  </h1>
</div>

// ✅ SIEMPRE - Stack vertical en móvil
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ❌ NUNCA - Anchos fijos
<div className="w-[500px]"> {/* Se rompe en móvil */}

// ✅ SIEMPRE - Anchos relativos
<div className="w-full max-w-2xl mx-auto">
```

---

## 🔐 Variables de Entorno

Crear archivo `.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Configuración opcional
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_APP_NAME=StyleBook
```

---

## 📚 Documentación

- [**Setup Guide**](./docs/SETUP.md) - Guía de instalación completa
- [**Installation**](./docs/INSTALLATION.md) - Instalación con pnpm
- [**Development Rules**](./.cursor/rules/RULES.md) - Reglas del proyecto
- [**Project Context**](./.cursor/context/CONTEXT.md) - Contexto completo
- [**API Documentation**](./api-docs/PROJECT_GUIDE.md) - Docs del backend

---

## 🚧 Roadmap

### ✅ Fase 1: Base (Completada)

- [x] Configuración inicial del proyecto
- [x] Hero page con Gradient Flow
- [x] Componentes base (Button, Card, Badge)
- [x] Sistema de tipado TypeScript
- [x] Manejo de fechas con date-fns

### 🔄 Fase 2: Autenticación (En Progreso)

- [ ] Página de login
- [ ] Página de registro
- [ ] Middleware de protección de rutas
- [ ] Manejo de sesiones con JWT

### 📋 Fase 3: Dashboard

- [ ] Layout de dashboard
- [ ] Dashboard cliente
- [ ] Dashboard proveedor
- [ ] Perfil de usuario

### 🔍 Fase 4: Funcionalidades Core

- [ ] Búsqueda de servicios
- [ ] Listado de proveedores
- [ ] Sistema de favoritos
- [ ] Reserva de citas
- [ ] Calendario de disponibilidad

### ⭐ Fase 5: Features Avanzadas

- [ ] Sistema de reseñas
- [ ] Notificaciones en tiempo real
- [ ] Chat entre cliente-proveedor
- [ ] Panel de estadísticas

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Asegúrate de:**

- ✅ Seguir las reglas de TypeScript strict
- ✅ Mantener `page.tsx` < 100 líneas
- ✅ **Diseño mobile-first aplicado**
- ✅ **Probado en móvil, tablet y desktop**
- ✅ Ejecutar `pnpm lint` sin errores
- ✅ Ejecutar `pnpm type-check` sin errores
- ✅ Ejecutar `pnpm build` exitoso
- ✅ Agregar tests si es necesario

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Equipo

- **Frontend Lead** - Desarrollo con Next.js + React
- **Backend Team** - API REST con autenticación JWT
- **UI/UX Designer** - Sistema de diseño Gradient Flow

---

## 📞 Contacto

- **Website:** [stylebook.com](https://stylebook.com)
- **Email:** contact@stylebook.com
- **Twitter:** [@StyleBookApp](https://twitter.com/StyleBookApp)

---

<div align="center">

**Hecho con 💜 usando Gradient Flow Design**

[⬆ Volver arriba](#-stylebook-frontend)

</div>
