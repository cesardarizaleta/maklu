# Maklu - Sistema de Generación de Tesis Inteligente

Maklu es una aplicación web desarrollada en Angular que permite generar tesis académicas completas de manera automática utilizando inteligencia artificial. El sistema integra con un backend en NestJS que utiliza Gemini AI para crear contenido académico siguiendo estándares APA 7.

## Características

- **Autenticación Inteligente**: Sistema de API key para acceso seguro
- **Generación Automática**: Crea tesis completas (~50 páginas) desde una idea
- **Panel de Gestión**: Interfaz intuitiva para gestionar todas tus tesis
- **Edición en Tiempo Real**: Modifica secciones específicas de tus tesis
- **Estados de Progreso**: Seguimiento en tiempo real del proceso de generación
- **Diseño Profesional**: Interfaz moderna con tema naranja pastel

## Tecnologías Utilizadas

- **Frontend**: Angular 20 con Signals y Standalone Components
- **Backend**: NestJS con Gemini AI
- **Estilos**: CSS moderno con diseño responsive
- **Arquitectura**: Lazy loading y modularización

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar API Key

La aplicación requiere una API key del backend para funcionar. En desarrollo, puedes obtenerla del backend corriendo en `http://localhost:3000`.

### 3. Ejecutar en Desarrollo

```bash
ng serve
```

Navega a `http://localhost:4200` y configura tu API key en la pantalla de autenticación.

## Configuración de Producción

Para producción, actualiza `src/environments/environment.prod.ts` con la URL del backend de producción:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://maklu-backend.onrender.com/api',
  apiKey: '' // Se configura dinámicamente
};
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── auth/                 # Componente de autenticación
│   ├── dashboard/            # Panel principal
│   ├── create-thesis/        # Creación de tesis
│   ├── thesis-detail/        # Vista de detalle de tesis
│   ├── services/             # Servicios de API
│   ├── models/               # Modelos de datos
│   ├── auth.interceptor.ts   # Interceptor para API key
│   └── app.routes.ts         # Configuración de rutas
├── environments/             # Configuración de entornos
└── styles.css                # Estilos globales
```

## API Endpoints

La aplicación consume los siguientes endpoints del backend:

- `POST /theses/idea` - Crear tesis desde idea
- `GET /theses` - Listar tesis del usuario
- `GET /theses/:id/tree` - Obtener árbol de partes
- `GET /theses/:id/full` - Obtener tesis completa
- `PATCH /thesis/:id/:key` - Actualizar parte específica

## Estados de Tesis

- **generating**: En proceso de generación
- **ready**: Lista para consultar y editar
- **failed**: Error en generación

## Desarrollo

### Generar Componentes

```bash
ng generate component nombre-componente --standalone
```

### Construir para Producción

```bash
ng build --configuration production
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Soporte

Para soporte técnico, contacta al equipo de desarrollo o consulta la documentación del backend.
