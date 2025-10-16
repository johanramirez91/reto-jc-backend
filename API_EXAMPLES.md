# GameTracker API - Ejemplos de Uso

Esta es una colección de ejemplos de cómo usar la API de GameTracker. Puedes usar estos ejemplos con herramientas como Postman, Insomnia, curl, o cualquier cliente HTTP.

## 🌐 URL Base
```
http://localhost:3000
```

## 📋 Índice de Ejemplos

1. [Información General](#información-general)
2. [Videojuegos](#videojuegos)
3. [Reseñas](#reseñas)
4. [Estadísticas](#estadísticas)

---

## Información General

### Ver información de la API
```http
GET http://localhost:3000/
```

### Ver documentación completa de endpoints
```http
GET http://localhost:3000/api/
```

---

## Videojuegos

### 1. Obtener todos los videojuegos
```http
GET http://localhost:3000/api/juegos
```

### 2. Obtener videojuegos con filtros
```http
# Filtrar por género
GET http://localhost:3000/api/juegos?genero=RPG

# Filtrar por plataforma
GET http://localhost:3000/api/juegos?plataforma=PC

# Filtrar juegos completados
GET http://localhost:3000/api/juegos?completado=true

# Combinar múltiples filtros con paginación
GET http://localhost:3000/api/juegos?genero=Acción&plataforma=PlayStation&page=1&limit=5
```

### 3. Obtener un videojuego específico
```http
GET http://localhost:3000/api/juegos/{ID_DEL_JUEGO}
```

### 4. Agregar un nuevo videojuego
```http
POST http://localhost:3000/api/juegos
Content-Type: application/json

{
  "titulo": "The Legend of Zelda: Breath of the Wild",
  "genero": "Aventura",
  "plataforma": "Nintendo Switch",
  "añoLanzamiento": 2017,
  "desarrollador": "Nintendo EPD",
  "imagenPortada": "https://example.com/zelda-botw.jpg",
  "descripcion": "Un juego de aventura en mundo abierto que redefine la serie Zelda con exploración libre y mecánicas innovadoras.",
  "completado": false
}
```

### 5. Actualizar un videojuego
```http
PUT http://localhost:3000/api/juegos/{ID_DEL_JUEGO}
Content-Type: application/json

{
  "titulo": "The Legend of Zelda: Breath of the Wild - Edición Completa",
  "completado": true,
  "descripcion": "Un juego de aventura en mundo abierto que redefine la serie Zelda. ¡Ya completado al 100%!"
}
```

### 6. Marcar juego como completado/no completado
```http
PATCH http://localhost:3000/api/juegos/{ID_DEL_JUEGO}/completado
```

### 7. Eliminar un videojuego
```http
DELETE http://localhost:3000/api/juegos/{ID_DEL_JUEGO}
```

---

## Reseñas

### 1. Obtener todas las reseñas
```http
GET http://localhost:3000/api/resenas
```

### 2. Obtener reseñas con filtros
```http
# Filtrar por puntuación
GET http://localhost:3000/api/resenas?puntuacion=5

# Filtrar por dificultad
GET http://localhost:3000/api/resenas?dificultad=Normal

# Filtrar reseñas recomendadas
GET http://localhost:3000/api/resenas?recomendaria=true
```

### 3. Obtener reseñas de un juego específico
```http
GET http://localhost:3000/api/reseñas/juego/{ID_DEL_JUEGO}
```

### 4. Obtener una reseña específica
```http
GET http://localhost:3000/api/resenas/{ID_DE_LA_RESEÑA}
```

### 5. Crear una nueva reseña
```http
POST http://localhost:3000/api/resenas
Content-Type: application/json

{
  "juegoId": "ID_DEL_JUEGO_AQUÍ",
  "puntuacion": 5,
  "textoReseña": "¡Increíble juego! La historia es envolvente, los gráficos son impresionantes y la jugabilidad es muy fluida. Definitivamente uno de los mejores RPGs que he jugado. La libertad de exploración es fantástica y cada misión secundaria se siente significativa.",
  "horasJugadas": 85,
  "dificultad": "Normal",
  "recomendaria": true
}
```

### 6. Actualizar una reseña
```http
PUT http://localhost:3000/api/resenas/{ID_DE_LA_RESEÑA}
Content-Type: application/json

{
  "puntuacion": 4,
  "textoReseña": "Después de más tiempo jugando, ajusto mi reseña. Sigue siendo un excelente juego, pero encontré algunos bugs menores que afectan la experiencia.",
  "horasJugadas": 120,
  "dificultad": "Difícil"
}
```

### 7. Eliminar una reseña
```http
DELETE http://localhost:3000/api/resenas/{ID_DE_LA_RESEÑA}
```

---

## Estadísticas

### 1. Estadísticas generales de la biblioteca
```http
GET http://localhost:3000/api/juegos/stats
```

**Respuesta ejemplo:**
```json
{
  "success": true,
  "data": {
    "totalJuegos": 25,
    "juegosCompletados": 9,
    "porcentajeCompletado": 36,
    "distribuccionGeneros": {
      "RPG": 5,
      "Acción": 4,
      "Aventura": 3
    },
    "distribuccionPlataformas": {
      "PC": 8,
      "PlayStation": 6,
      "Xbox": 5
    }
  }
}
```

### 2. Estadísticas de reseñas
```http
GET http://localhost:3000/api/resenas/stats
```

**Respuesta ejemplo:**
```json
{
  "success": true,
  "data": {
    "totalReseñas": 33,
    "puntuacionPromedio": 3.8,
    "horasTotalesJugadas": 2450,
    "porcentajeRecomendacion": 72,
    "distribuccionPuntuaciones": {
      "5": 12,
      "4": 8,
      "3": 7,
      "2": 4,
      "1": 2
    },
    "topJuegosPuntuacion": [
      {
        "titulo": "The Witcher 3",
        "puntuacionPromedio": 4.8,
        "totalReseñas": 3
      }
    ]
  }
}
```

### Crear una reseña
```bash
curl -X POST "http://localhost:3000/api/reseñas" \
  -H "Content-Type: application/json" \
  -d '{
    "juegoId": "ID_DEL_JUEGO",
    "puntuacion": 5,
    "textoReseña": "¡Excelente juego!",
    "horasJugadas": 60,
    "dificultad": "Difícil",
    "recomendaria": true
  }'
```

¡Disfruta usando la API de GameTracker! 🎮