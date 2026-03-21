// config.js - Configuración global del sistema
const APP_CONFIG = {
    // Información de la aplicación
    NAME: 'GuardPal',
    VERSION: '2.0.0',
    
    // URLs
    API_URL: '/api', // Cambiar según entorno
    BASE_URL: '/',
    
    // Autenticación
    AUTH_KEY: 'guardpal_auth',
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 horas
    
    // Seguridad
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutos
    
    // Rutas
    ROUTES: {
        PUBLIC: ['/', '/index.html', '/login.html', '/register.html'],
        PROTECTED: ['/dashboard.html', '/wallet.html', '/history.html', '/profile.html']
    }
};

// Exportar para uso global
window.APP_CONFIG = APP_CONFIG;