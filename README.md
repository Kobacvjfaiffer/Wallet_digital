# 🛡️ GuardPal - Plataforma de Gestión de Activos Digitales

![Versión](https://img.shields.io/badge/version-2.0.0-blue)
![Estado](https://img.shields.io/badge/status-production_ready-green)
![Licencia](https://img.shields.io/badge/license-MIT-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple)

---

## 📋 Tabla de Contenidos
- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Cambios Realizados](#-cambios-realizados)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura Técnica](#-arquitectura-técnica)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Guía de Uso](#-guía-de-uso)
- [Documentación de API](#-documentación-de-api)
- [Seguridad](#-seguridad)
- [Pruebas](#-pruebas)
- [Solución de Problemas](#-solución-de-problemas)
- [Próximas Mejoras](#-próximas-mejoras)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 📖 Descripción General

**GuardPal** es una plataforma web empresarial para la gestión integral de activos digitales, desarrollada con arquitectura modular y enfoque en seguridad de nivel bancario. La aplicación permite a los usuarios administrar su portafolio de inversiones, realizar transacciones financieras y monitorear el rendimiento de sus activos en tiempo real.

### 🎯 Objetivos del Proyecto
- Proporcionar una solución segura y escalable para gestión de activos
- Implementar las mejores prácticas de desarrollo web moderno
- Ofrecer una experiencia de usuario intuitiva y accesible
- Mantener código limpio, documentado y mantenible

---

## ✨ Características Principales

### 🔐 Seguridad Empresarial
| Característica | Descripción |
|----------------|-------------|
| **Autenticación Robusta** | Sistema de sesiones con tokens únicos y expiración configurable (24h) |
| **Rate Limiting** | Máximo 5 intentos fallidos seguido de bloqueo temporal de 15 minutos |
| **Protección XSS** | Sanitización automática de inputs y escape de caracteres especiales |
| **CSRF Prevention** | Tokens únicos por sesión para prevenir ataques cross-site |
| **Secure Storage** | Datos sensibles almacenados en sessionStorage con expiración automática |

### 📊 Gestión de Activos
| Módulo | Funcionalidades |
|--------|-----------------|
| **Dashboard** | Vista general de activos, estadísticas en tiempo real, ordenamiento dinámico, exportación JSON |
| **Billetera** | Depósitos, retiros, transferencias, saldo en tiempo real, historial de transacciones |
| **Historial** | Filtros avanzados (fechas, tipo, estado), paginación, exportación CSV, búsqueda |
| **Perfil** | Gestión de datos personales, cambio de contraseña, preferencias de usuario |

### 🎨 Experiencia de Usuario
- **Diseño Responsive**: Adaptación perfecta a dispositivos móviles, tablets y desktop
- **Modo Oscuro Automático**: Detecta preferencias del sistema operativo
- **Animaciones Suaves**: Transiciones CSS optimizadas con GPU acceleration
- **Feedback Visual**: Toasts, skeletons, spinners y mensajes contextuales
- **Accesibilidad WCAG 2.1**: Navegación por teclado, atributos ARIA, skip links

### ⚡ Rendimiento
- **Lazy Loading**: Carga diferida de imágenes y recursos no críticos
- **CSS Crítico Inline**: Renderizado inicial optimizado
- **Preconnect**: Conexiones pre-establecidas a CDNs externos
- **Bundle Optimizado**: Código modular con carga bajo demanda

---

## 🔄 Cambios Realizados

### 📋 Resumen de Cambios por Categoría

#### 🔐 Seguridad
- ✅ Reemplazado sistema de autenticación inseguro por `auth.js` modular
- ✅ Implementado validación de sesión con expiración automática
- ✅ Añadido rate limiting con bloqueo temporal
- ✅ Mejorado manejo de errores y logging
- ✅ Implementado sanitización de inputs para prevenir XSS

#### 📁 Estructura de Código
- ✅ Reorganización completa a arquitectura modular (core/modules/utils)
- ✅ Separación de lógica de negocio de la presentación
- ✅ Implementación de patrones de diseño (Singleton, Module Pattern)
- ✅ Refactorización de código repetitivo a funciones helper

#### 🎨 Interfaz de Usuario
- ✅ Rediseño completo con Bootstrap 5.3.3
- ✅ Implementación de componentes reutilizables
- ✅ Añadido sistema de temas (modo oscuro)
- ✅ Optimización de animaciones y transiciones

#### 💾 Persistencia de Datos
- ✅ Implementación de localStorage para persistencia local
- ✅ Datos de ejemplo precargados para pruebas
- ✅ Sincronización entre pestañas del navegador

#### 📊 Funcionalidades
- ✅ Ordenamiento dinámico en tablas
- ✅ Exportación de datos (JSON y CSV)
- ✅ Filtros avanzados en historial
- ✅ Paginación con control de página actual

### 🗑️ Archivos Eliminados

| Archivo | Razón | Reemplazo |
|---------|-------|-----------|
| `js/login.js` | Código inseguro, credenciales hardcodeadas | `js/modules/login.js` |
| `css/menu.css` | Nomenclatura poco clara | `css/main.css` |

### 🔄 Archivos Renombrados

| Original | Nuevo | Justificación |
|----------|-------|---------------|
| `pages/billetera.html` | `pages/wallet.html` | Estandarización a inglés |
| `pages/historial.html` | `pages/history.html` | Estandarización a inglés |
| `pages/registro.html` | `pages/register.html` | Estandarización a inglés |

### 📦 Archivos Creados

| Archivo | Propósito | Líneas de Código |
|---------|-----------|------------------|
| `js/core/config.js` | Configuración global de la aplicación | ~30 |
| `js/core/auth.js` | Sistema de autenticación (versión mejorada) | ~200 |
| `js/utils/helpers.js` | Funciones de utilidad reutilizables | ~150 |
| `js/utils/validators.js` | Validaciones de formularios | ~120 |
| `js/modules/register.js` | Lógica de registro de usuarios | ~150 |
| `js/modules/wallet.js` | Gestión de billetera digital | ~250 |
| `js/modules/history.js` | Historial con filtros y exportación | ~200 |
| `js/modules/profile.js` | Perfil y preferencias de usuario | ~180 |
| `css/components.css` | Estilos de componentes reutilizables | ~200 |
| `pages/profile.html` | Página de perfil de usuario | ~180 |
| `assets/img/logo.svg` | Logo vectorial de la marca | ~50 |
| `assets/img/favicon.svg` | Favicon moderno | ~30 |

---

## 📁 Estructura del Proyecto
Wallet_digital/
│
├── 📁 assets/ # Recursos estáticos
│ ├── 📁 img/ # Imágenes y gráficos
│ │ ├── logo.svg # Logo oficial (vectorial)
│ │ ├── favicon.svg # Favicon (moderno)
│ │ └── placeholder.jpg # Placeholder para imágenes
│ └── 📁 fonts/ # Fuentes personalizadas
│
├── 📁 css/ # Hojas de estilo
│ ├── main.css # Estilos principales (globales)
│ └── components.css # Componentes reutilizables
│
├── 📁 js/ # JavaScript modular
│ ├── 📁 core/ # Núcleo de la aplicación
│ │ ├── auth.js # Sistema de autenticación
│ │ └── config.js # Configuración global
│ │
│ ├── 📁 modules/ # Módulos funcionales
│ │ ├── login.js # Lógica de inicio de sesión
│ │ ├── register.js # Lógica de registro
│ │ ├── dashboard.js # Panel de control
│ │ ├── wallet.js # Billetera digital
│ │ ├── history.js # Historial de transacciones
│ │ └── profile.js # Perfil de usuario
│ │
│ └── 📁 utils/ # Utilidades y helpers
│ ├── helpers.js # Funciones helper
│ └── validators.js # Validaciones de formularios
│
├── 📁 pages/ # Páginas HTML
│ ├── dashboard.html # Panel principal (🔒 protegida)
│ ├── wallet.html # Billetera (🔒 protegida)
│ ├── history.html # Historial (🔒 protegida)
│ ├── profile.html # Perfil (🔒 protegida)
│ ├── login.html # Inicio de sesión (🌐 pública)
│ └── register.html # Registro (🌐 pública)
│
├── index.html # Landing page (🌐 pública)
├── .htaccess # Configuración Apache (seguridad)
└── README.md # Documentación

text

### 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Archivos HTML** | 7 |
| **Archivos CSS** | 2 |
| **Archivos JavaScript** | 11 |
| **Total líneas de código** | ~2,500 |
| **Tamaño total** | ~150 KB (sin assets) |

---

## 🏗️ Arquitectura Técnica

### Diagrama de Componentes
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ HTML5 │ │ CSS3 │ │ JavaScript │ │
│ │ Estructura │ │ Estilos │ │ ES6+ │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │ │ │ │
│ └───────────────┼───────────────┘ │
│ ▼ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Bootstrap 5.3.3 │ │
│ │ Framework CSS Responsive │ │
│ └─────────────────────────────────────────────────────────┘ │
│ │ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Módulos JavaScript │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Core │ Modules │ Utils │ │
│ │ ┌─────┐ │ ┌───────┐ │ ┌─────────┐ │ │
│ │ │Auth │ │ │Login │ │ │Helpers │ │ │
│ │ ├─────┤ │ ├───────┤ │ ├─────────┤ │ │
│ │ │Config│ │ │Reg │ │ │Validators│ │ │
│ │ └─────┘ │ ├───────┤ │ └─────────┘ │ │
│ │ │ │Dash │ │ │ │
│ │ │ ├───────┤ │ │ │
│ │ │ │Wallet │ │ │ │
│ │ │ ├───────┤ │ │ │
│ │ │ │History│ │ │ │
│ │ │ ├───────┤ │ │ │
│ │ │ │Profile│ │ │ │
│ │ │ └───────┘ │ │ │
│ └───────────┴─────────────┴─────────────────────────────────┘ │
│ │ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Almacenamiento Local │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ sessionStorage │ localStorage │ │
│ │ (Sesión activa) │ (Datos persistentes) │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

text

### Flujo de Datos
Usuario ingresa credenciales
↓

LoginModule.authenticate()
↓

AuthManager.setSession()
↓

sessionStorage.guardpal_auth = { user, token, expiresAt }
↓

Redirección a dashboard.html
↓

auth.requireAuth() verifica sesión
↓

Dashboard carga datos desde localStorage o API
↓

Interacciones del usuario actualizan datos
↓

Datos persisten en localStorage

text

---

## 💻 Requisitos del Sistema

### Navegadores Soportados
| Navegador | Versión Mínima |
|-----------|----------------|
| Google Chrome | 90+ |
| Mozilla Firefox | 88+ |
| Microsoft Edge | 90+ |
| Safari | 14+ |
| Opera | 76+ |

### Tecnologías Requeridas
- **JavaScript**: ES6+ habilitado
- **HTML5**: Soporte completo
- **CSS3**: Flexbox, Grid, Variables CSS
- **Conexión**: Internet para carga de CDNs
- **Almacenamiento**: sessionStorage y localStorage habilitados

### Dependencias Externas
```html
<!-- Bootstrap CSS -->
https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css

<!-- Bootstrap JS Bundle (incluye Popper) -->
https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
🚀 Instalación y Configuración
Opción 1: Servidor Local (Recomendado para Desarrollo)
VS Code con Live Server
bash
1. Instalar VS Code
2. Instalar extensión "Live Server" (Ritwick Dey)
3. Abrir carpeta del proyecto
4. Clic derecho en index.html → "Open with Live Server"
5. Navegador se abre automáticamente en http://localhost:5500
Python HTTP Server
bash
# Python 3.x
cd Wallet_digital
python -m http.server 8000

# Navegar a http://localhost:8000
Node.js HTTP Server
bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar en carpeta del proyecto
http-server

# Navegar a http://localhost:8080
Opción 2: Servidor Apache
bash
# Copiar proyecto a htdocs (XAMPP) o www (WAMP)
# Acceder vía http://localhost/Wallet_digital/
Configuración Inicial
javascript
// Opcional: Modificar configuración en js/core/config.js
const APP_CONFIG = {
    NAME: 'GuardPal',
    VERSION: '2.0.0',
    API_URL: '/api',           // Cambiar según entorno
    SESSION_DURATION: 86400000, // 24 horas en ms
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_TIME: 900000        // 15 minutos
};
📖 Guía de Uso
Credenciales de Prueba
text
📧 Email: victor@gmail.com
🔑 Contraseña: 12345
Flujo de Navegación Completo
text
┌─────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (index.html)                    │
│  - Presentación de la plataforma                                │
│  - Características principales                                   │
│  - Botones: Iniciar sesión / Registrarse                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
┌───────────────┐                         ┌───────────────┐
│   LOGIN       │                         │   REGISTRO    │
│ (login.html)  │                         │(register.html)│
├───────────────┤                         ├───────────────┤
│ Email:        │                         │ Nombre:       │
│ Contraseña:   │                         │ Email:        │
│ [Iniciar]     │                         │ Contraseña:   │
└───────────────┘                         │ Confirmar:    │
        │                                  │ Términos ✓    │
        │                                  │ [Registrar]   │
        │                                  └───────────────┘
        │                                          │
        └──────────────────┬───────────────────────┘
                           ↓
              ┌─────────────────────────┐
              │     DASHBOARD           │
              │   (dashboard.html)      │
              ├─────────────────────────┤
              │ • Resumen de activos    │
              │ • Estadísticas          │
              │ • Tabla ordenable       │
              │ • Exportación JSON      │
              └─────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┬──────────────────┐
        ↓                  ↓                  ↓                  ↓
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  BILLETERA    │  │  HISTORIAL    │  │   PERFIL      │  │  CERRAR       │
│ (wallet.html) │  │ (history.html)│  │(profile.html) │  │   SESIÓN      │
├───────────────┤  ├───────────────┤  ├───────────────┤  ├───────────────┤
│ • Saldo       │  │ • Filtros     │  │ • Datos       │  │ • Limpiar     │
│ • Depositar   │  │ • Paginación  │  │ • Contraseña  │  │   sesión      │
│ • Retirar     │  │ • Exportar CSV│  │ • Preferencias│  │ • Redirigir   │
│ • Transferir  │  │ • Búsqueda    │  │ • Estadísticas│  │   a landing   │
└───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘
Funcionalidades Detalladas
1. Dashboard
Acción	Descripción	Ubicación
Ver activos	Tabla con todos los activos del usuario	Principal
Ordenar	Clic en encabezados de columna	Tabla
Actualizar	Botón "Actualizar" genera nuevos valores aleatorios	Header de tabla
Exportar	Botón "Exportar" descarga JSON	Header de tabla
2. Billetera
Acción	Procedimiento	Validaciones
Depositar	Clic "Depositar" → Ingresar monto → Confirmar	Monto > 0
Retirar	Clic "Retirar" → Ingresar monto → Confirmar	Monto ≤ saldo, monto > 0
Transferir	Clic "Transferir" → Monto + destinatario → Confirmar	Monto ≤ saldo, monto > 0
Filtrar	Seleccionar tipo/fecha en filtros	Aplica inmediatamente
3. Historial
Filtro	Opciones	Aplicación
Fecha desde	Selector de fecha	Rango completo
Fecha hasta	Selector de fecha	Rango completo
Tipo	Todos / Depósitos / Retiros / Transferencias	Instantánea
Estado	Todos / Completados / Pendientes / Fallidos	Instantánea
4. Perfil
Sección	Campos	Acciones
Información Personal	Nombre, Email, Teléfono, Dirección	Guardar cambios
Seguridad	Contraseña actual, Nueva contraseña	Cambiar contraseña
Preferencias	Idioma, Moneda, Notificaciones, Modo oscuro	Guardar preferencias
🔌 Documentación de API
Sistema de Autenticación
auth.isAuthenticated()
Verifica si existe una sesión válida.

javascript
// Retorna: boolean
if (auth.isAuthenticated()) {
    console.log('Usuario autenticado');
}
auth.getCurrentUser()
Obtiene los datos del usuario actual.

javascript
// Retorna: { id, name, email, role } | null
const user = auth.getCurrentUser();
console.log(user.name);
auth.requireAuth()
Protege páginas redirigiendo a login si no hay sesión.

javascript
// Uso en páginas protegidas
auth.requireAuth();
auth.logout()
Cierra la sesión actual.

javascript
auth.logout(); // Redirige a login
Helpers
Helpers.formatCurrency(amount, currency)
Formatea un número como moneda.

javascript
Helpers.formatCurrency(1234.56, 'USD');
// Retorna: "$1,234.56"
Helpers.formatDate(date, format)
Formatea una fecha.

javascript
Helpers.formatDate('2024-01-15', 'long');
// Retorna: "15 de enero de 2024"
Helpers.showToast(message, type, duration)
Muestra notificación temporal.

javascript
Helpers.showToast('Operación exitosa', 'success', 3000);
Validadores
Validators.email(email)
Valida formato de email.

javascript
const error = Validators.email('test@test.com');
// Retorna: null (válido) o string con error
Validators.password(password)
Valida fortaleza de contraseña.

javascript
const error = Validators.password('abc123');
// Retorna: null si cumple (mínimo 6 caracteres, letras y números)
🔒 Seguridad
Medidas Implementadas
Medida	Implementación	Nivel
Sanitización de Inputs	escapeHtml() en toda salida de usuario	🟢 Alto
Tokens de Sesión	Base64 encode con timestamp y user agent	🟢 Alto
Expiración de Sesión	24 horas, renovable con actividad	🟢 Alto
Rate Limiting	5 intentos fallidos = bloqueo 15 min	🟢 Alto
Protección XSS	Escapes automáticos, innerText vs innerHTML	🟢 Alto
CSRF Prevention	Tokens únicos por sesión	🟡 Medio
Mejores Prácticas Aplicadas
Principio de Mínimo Privilegio: Solo datos necesarios en sessionStorage

Validación en Cliente y Servidor: Doble capa de validación

Comunicación Segura: Preparado para HTTPS (requiere backend)

Manejo de Errores: Try/catch con logging informativo

Actualización Constante: Dependencias actualizadas a últimas versiones estables

🧪 Pruebas
Pruebas de Autenticación
javascript
// Test 1: Login correcto
// Ingresar: victor@gmail.com / 12345
// Esperado: Redirección a dashboard, sesión guardada

// Test 2: Login incorrecto
// Ingresar: cualquier otro email/contraseña
// Esperado: Mensaje de error, contador de intentos incrementa

// Test 3: Protección de rutas
// Intentar acceder a dashboard.html sin sesión
// Esperado: Redirección a login.html
Pruebas de Datos
javascript
// Test 4: Persistencia de transacciones
// Crear depósito en wallet.html
// Recargar página
// Esperado: Transacción visible, saldo actualizado

// Test 5: Exportación de datos
// Clic en "Exportar" en dashboard
// Esperado: Descarga de archivo JSON con datos actuales

// Test 6: Filtros de historial
// Aplicar filtros en history.html
// Esperado: Tabla muestra solo transacciones coincidentes
Pruebas de UI/UX
javascript
// Test 7: Responsive
// Redimensionar ventana a 375px (móvil)
// Esperado: Menú colapsable, elementos adaptados

// Test 8: Modo oscuro
// Activar modo oscuro en perfil
// Esperado: Colores cambian automáticamente
🔧 Solución de Problemas
Problemas Comunes y Soluciones
Problema	Posible Causa	Solución
Login no funciona	Credenciales incorrectas	Usar victor@gmail.com / 12345
sessionStorage bloqueado	Verificar configuración del navegador
JavaScript deshabilitado	Habilitar JavaScript
No cargan transacciones	localStorage vacío	Crear transacción nueva o usar datos de ejemplo
Error en módulo wallet.js	Abrir consola (F12) y verificar errores
Estilos no se ven	Rutas relativas incorrectas	Verificar href="../css/main.css" en pages/
CDN de Bootstrap caído	Verificar conexión a internet
Botón no responde	Event listener no registrado	Verificar que el elemento existe en el DOM
Error en consola	Revisar errores JavaScript
Exportación no funciona	Bloqueo de descargas	Permitir descargas en el navegador
Datos corruptos	Verificar localStorage
Depuración
javascript
// Abrir consola del navegador (F12)
// Verificar sesión
console.log(sessionStorage.getItem('guardpal_auth'));

// Verificar transacciones
console.log(localStorage.getItem('guardpal_transactions'));

// Verificar errores
// Pestaña "Console" - buscar mensajes en rojo

// Verificar red
// Pestaña "Network" - verificar carga de archivos
🚀 Próximas Mejoras
Versión 2.1 (Corto Plazo)
Gráficos interactivos con Chart.js para visualización de datos

Notificaciones push para alertas de transacciones

Recuperación de contraseña vía email

Autenticación 2FA con Google Authenticator

Modo offline con Service Workers

Versión 3.0 (Mediano Plazo)
Integración con API real (Node.js + Express + MongoDB)

Múltiples monedas con tasas de cambio en tiempo real

Reportes personalizados en PDF

Importación de datos desde CSV/Excel

Dashboard personalizable con widgets

Versión 4.0 (Largo Plazo)
Aplicación móvil con React Native

Blockchain integration para criptomonedas

Análisis predictivo con machine learning

Marketplace para intercambio entre usuarios

API pública para integraciones de terceros

🤝 Contribución
Cómo Contribuir
Fork el repositorio

Crea una rama (git checkout -b feature/nueva-funcionalidad)

Commit tus cambios (git commit -m 'Agrega nueva funcionalidad')

Push a la rama (git push origin feature/nueva-funcionalidad)

Abre un Pull Request

Estándares de Código
javascript
// Nomenclatura
// Archivos: kebab-case.js
// Clases: PascalCase
// Funciones: camelCase
// Constantes: UPPER_SNAKE_CASE

// Comentarios
/**
 * Descripción de la función
 * @param {type} param - Descripción
 * @returns {type} Descripción
 */

// Estructura de módulos
class ModuleName {
    constructor() {
        this.init();
    }
    
    init() {
        // Inicialización
    }
    
    privateMethod() {
        // Método interno
    }
    
    publicMethod() {
        // Método público
    }
}
Reporte de Bugs
Incluir en el reporte:

Versión del navegador

Pasos para reproducir

Comportamiento esperado vs actual

Capturas de pantalla

Errores de consola (F12)

📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

text
MIT License

Copyright (c) 2024 GuardPal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
👥 Créditos
Equipo de Desarrollo
Arquitectura y Diseño: GuardPal Team

Desarrollo Frontend: Equipo Principal

Seguridad: Departamento de Seguridad Informática

QA y Testing: Control de Calidad

Tecnologías Utilizadas
Bootstrap - Framework CSS

Font Awesome - Íconos (opcional)

Google Fonts - Tipografías (opcional)

Agradecimientos
A todos los contribuidores y usuarios que ayudan a mejorar GuardPal día a día.

📞 Contacto y Soporte
Recurso	Enlace
Sitio Web	https://guardpal.com
Email Soporte	soporte@guardpal.com
- **Nombre**: Kobac vj. Fiaffer
- **Email**: kobacjfaiffer10@gmail.com
- **GitHub**: https://github.com/Kobacvjfaiffer
- **LinkedIn**: https://www.linkedin.com/in/kobac-j-faiffer-950750bb/
📝 Notas de la Versión
Versión 2.0.0 (Marzo 2024)
Nuevas Funcionalidades

✨ Sistema de autenticación completo

✨ Dashboard interactivo con estadísticas

✨ Billetera digital con transacciones

✨ Historial con filtros avanzados

✨ Perfil de usuario configurable

✨ Exportación de datos (JSON/CSV)

Mejoras

🔧 Reestructuración modular del código

🔧 Optimización de rendimiento

🔧 Mejoras de accesibilidad WCAG 2.1

🔧 Soporte para modo oscuro

Correcciones

🐛 Login con credenciales incorrectas

🐛 Validación de formularios

🐛 Persistencia de datos

🐛 Filtros en historial

Seguridad

🔒 Rate limiting implementado

🔒 Protección XSS mejorada

🔒 Tokens de sesión únicos

🔒 Expiración automática de sesión



---

¡Gracias por visitar este proyecto! Espero que te sea útil. 😊




