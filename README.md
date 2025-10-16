# GameTracker Backend 🎮

API REST para gestionar biblioteca personal de videojuegos con sistema de reseñas completo.

## 🚀 Características

- **📚 Gestión de Biblioteca**: Administra tu colección personal de videojuegos
- **⭐ Sistema de Reseñas**: Escribe reseñas detalladas con puntuaciones de 1-5 estrellas
- **🔍 Filtros Avanzados**: Filtra por género, plataforma, estado de completado, etc.
- **📊 Estadísticas**: Visualiza estadísticas detalladas de tu biblioteca
- **✅ Control de Progreso**: Marca juegos como completados
- **⏱️ Seguimiento de Tiempo**: Registra horas jugadas en cada reseña

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB + Mongoose
- **Validación**: Mongoose Schema Validation
- **CORS**: Configurado para desarrollo frontend
- **Datos de Prueba**: Faker.js para generar datos mock

## 🌐 API Endpoints

### 🎮 Videojuegos (`/api/juegos`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/juegos` | Obtener todos los juegos con filtros |
| `GET` | `/api/juegos/stats` | Estadísticas de la biblioteca |
| `GET` | `/api/juegos/:id` | Obtener juego específico |
| `POST` | `/api/juegos` | Agregar nuevo juego |
| `PUT` | `/api/juegos/:id` | Actualizar juego |
| `PATCH` | `/api/juegos/:id/completado` | Marcar como completado |
| `DELETE` | `/api/juegos/:id` | Eliminar juego |

### ⭐ Reseñas (`/api/reseñas`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/reseñas` | Obtener todas las reseñas |
| `GET` | `/api/reseñas/stats` | Estadísticas de reseñas |
| `GET` | `/api/reseñas/juego/:juegoId` | Reseñas de un juego específico |
| `GET` | `/api/reseñas/:id` | Obtener reseña específica |
| `POST` | `/api/reseñas` | Crear nueva reseña |
| `PUT` | `/api/reseñas/:id` | Actualizar reseña |
| `DELETE` | `/api/reseñas/:id` | Eliminar reseña |

## 📄 Ejemplos de Uso

### Crear un Videojuego
```bash
POST /api/juegos
Content-Type: application/json

{
  "titulo": "The Witcher 3: Wild Hunt",
  "genero": "RPG",
  "plataforma": "PC",
  "añoLanzamiento": 2015,
  "desarrollador": "CD Projekt Red",
  "imagenPortada": "https://example.com/witcher3.jpg",
  "descripcion": "Un RPG épico en un mundo abierto lleno de aventuras",
  "completado": true
}
```

### Crear una Reseña
```bash
POST /api/reseñas
Content-Type: application/json

{
  "juegoId": "64f8a1b2c3d4e5f6789a0b1c",
  "puntuacion": 5,
  "textoReseña": "Increíble juego con una historia envolvente y personajes memorables.",
  "horasJugadas": 120,
  "dificultad": "Normal",
  "recomendaria": true
}
```

### Filtrar Juegos
```bash
GET /api/juegos?genero=RPG&plataforma=PC&completado=true&page=1&limit=10
```

## 📊 Modelos de Datos

### Videojuego (Game)
```javascript
{
  _id: ObjectId,
  titulo: String,           // Requerido
  genero: String,           // Enum: ["Acción", "RPG", "Estrategia", ...]
  plataforma: String,       // Enum: ["PC", "PlayStation", "Xbox", ...]
  añoLanzamiento: Number,   // 1970 - actualidad+2
  desarrollador: String,    // Requerido
  imagenPortada: String,    // URL válida
  descripcion: String,      // Máximo 500 caracteres
  completado: Boolean,      // Default: false
  fechaCreacion: Date,      // Auto-generado
  createdAt: Date,          // Timestamp
  updatedAt: Date           // Timestamp
}
```

### Reseña (Review)
```javascript
{
  _id: ObjectId,
  juegoId: ObjectId,        // Referencia a Game
  puntuacion: Number,       // 1-5 estrellas
  textoReseña: String,      // 10-1000 caracteres
  horasJugadas: Number,     // 0-10000
  dificultad: String,       // Enum: ["Fácil", "Normal", "Difícil", "Muy Difícil"]
  recomendaria: Boolean,    // Requerido
  fechaCreacion: Date,      // Auto-generado
  fechaActualizacion: Date, // Auto-actualizado
  createdAt: Date,          // Timestamp
  updatedAt: Date           // Timestamp
}
```

## 🔧 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo (nodemon)
npm run seed       # Poblar base de datos con datos de prueba
```

## 🚦 Estados de Respuesta

- `200` - OK: Operación exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Error de validación o datos
- `404` - Not Found: Recurso no encontrado
- `500` - Internal Server Error: Error del servidor

## 📝 Formato de Respuesta

Todas las respuestas seguirán este formato:

```javascript
// Éxito
{
  "success": true,
  "message": "Descripción de la operación",
  "data": { /* datos solicitados */ },
  "pagination": { /* info de paginación si aplica */ }
}

// Error
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos del error",
  "errors": [ /* errores de validación si aplican */ ]
}
```

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---
