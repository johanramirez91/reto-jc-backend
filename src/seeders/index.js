const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const { Game, Review } = require('../models');
const connectDB = require('../config/database');

const GENEROS = ['Acción', 'RPG', 'Estrategia', 'Aventura', 'Deportes', 'Simulación', 'Puzzle', 'Plataformas', 'Supervivencia', 'Terror', 'Carreras', 'Lucha'];
const PLATAFORMAS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'PlayStation 5', 'Xbox Series X/S', 'PlayStation 4', 'Xbox One'];
const DESARROLLADORES = [
  'Rockstar Games', 'Valve', 'Blizzard Entertainment', 'Naughty Dog', 'CD Projekt Red',
  'FromSoftware', 'Nintendo', 'Epic Games', 'Bethesda', 'Square Enix',
  'Ubisoft', 'Electronic Arts', 'Activision', 'Sony Interactive', 'Microsoft Studios',
  'Kojima Productions', 'BioWare', 'Bungie', 'Riot Games', 'Mojang Studios'
];

const TITULOS_EJEMPLO = [
  'Grand Theft Auto V', 'The Witcher 3', 'Red Dead Redemption 2', 'Cyberpunk 2077',
  'Elden Ring', 'The Last of Us Part II', 'God of War', 'Spider-Man', 'Horizon Zero Dawn',
  'Ghost of Tsushima', 'Death Stranding', 'Control', 'Hades', 'Among Us',
  'Fall Guys', 'Valorant', 'League of Legends', 'Fortnite', 'Apex Legends',
  'Call of Duty: Warzone', 'Minecraft', 'Terraria', 'Stardew Valley', 'Hollow Knight',
  'Celeste', 'Ori and the Will of the Wisps', 'Assassin\'s Creed Valhalla', 'FIFA 23',
  'NBA 2K23', 'Rocket League', 'Overwatch 2', 'Destiny 2', 'World of Warcraft'
];

const DIFICULTADES = ['Fácil', 'Normal', 'Difícil', 'Muy Difícil'];

const generateGameImage = () => {
  const imageId = faker.number.int({ min: 100, max: 999 });
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  const extension = faker.helpers.arrayElement(extensions);
  return `https://picsum.photos/400/600.${extension}?random=${imageId}`;
};

const generateFakeGame = () => {
  const titulo = faker.helpers.arrayElement(TITULOS_EJEMPLO);
  const genero = faker.helpers.arrayElement(GENEROS);
  const plataforma = faker.helpers.arrayElement(PLATAFORMAS);
  const desarrollador = faker.helpers.arrayElement(DESARROLLADORES);
  
  return {
    titulo: titulo,
    genero: genero,
    plataforma: plataforma,
    añoLanzamiento: faker.number.int({ min: 2010, max: 2024 }),
    desarrollador: desarrollador,
    imagenPortada: generateGameImage(),
    descripcion: faker.lorem.paragraph({ min: 2, max: 4 }),
    completado: faker.datatype.boolean({ probability: 0.3 }),
    fechaCreacion: faker.date.between({ 
      from: new Date('2010-01-01'), 
      to: new Date() 
    })
  };
};

const generateFakeReview = (gameId) => {
  const puntuacion = faker.number.int({ min: 1, max: 5 });
  const recomendaria = puntuacion >= 3 ? faker.datatype.boolean({ probability: 0.8 }) : faker.datatype.boolean({ probability: 0.2 });
  
  return {
    juegoId: gameId,
    puntuacion: puntuacion,
    textoReseña: faker.lorem.paragraphs({ min: 1, max: 3 }, '\n\n'),
    horasJugadas: faker.number.int({ min: 1, max: 500 }),
    dificultad: faker.helpers.arrayElement(DIFICULTADES),
    recomendaria: recomendaria,
    fechaCreacion: faker.date.between({ 
      from: new Date('2020-01-01'), 
      to: new Date() 
    })
  };
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seeder de GameTracker...\n');
    await connectDB();

    console.log('🧹 Limpiando colecciones existentes...');
    await Game.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Colecciones limpiadas\n');

    console.log('🎮 Generando videojuegos...');
    const gamesData = [];
    const TOTAL_GAMES = 25;

    for (let i = 0; i < TOTAL_GAMES; i++) {
      gamesData.push(generateFakeGame());
    }

    const createdGames = await Game.insertMany(gamesData);
    console.log(`✅ ${createdGames.length} videojuegos creados\n`);

    console.log('⭐ Generando reseñas...');
    const reviewsData = [];
    const REVIEWS_PER_GAME = faker.number.int({ min: 0, max: 3 }); 

    for (const game of createdGames) {
      const numberOfReviews = faker.number.int({ min: 0, max: 3 });
      
      for (let i = 0; i < numberOfReviews; i++) {
        reviewsData.push(generateFakeReview(game._id));
      }
    }

    const createdReviews = await Review.insertMany(reviewsData);
    console.log(`✅ ${createdReviews.length} reseñas creadas\n`);

    console.log('📊 ESTADÍSTICAS DE LA BASE DE DATOS:');
    console.log('═'.repeat(50));
    
    const totalGames = await Game.countDocuments();
    const totalReviews = await Review.countDocuments();
    const completedGames = await Game.countDocuments({ completado: true });
    
    console.log(`📚 Total de videojuegos: ${totalGames}`);
    console.log(`⭐ Total de reseñas: ${totalReviews}`);
    console.log(`✅ Juegos completados: ${completedGames}`);
    console.log(`📈 Promedio de reseñas por juego: ${(totalReviews / totalGames).toFixed(1)}`);
    
    const genreStats = await Game.aggregate([
      { $group: { _id: '$genero', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🎯 DISTRIBUCIÓN POR GÉNEROS:');
    genreStats.forEach(genre => {
      console.log(`  ${genre._id}: ${genre.count} juego(s)`);
    });

    const platformStats = await Game.aggregate([
      { $group: { _id: '$plataforma', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🎮 DISTRIBUCIÓN POR PLATAFORMAS:');
    platformStats.forEach(platform => {
      console.log(`  ${platform._id}: ${platform.count} juego(s)`);
    });

    const topGames = await Review.aggregate([
      {
        $group: {
          _id: '$juegoId',
          puntuacionPromedio: { $avg: '$puntuacion' },
          totalReseñas: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'games',
          localField: '_id',
          foreignField: '_id',
          as: 'juego'
        }
      },
      { $unwind: '$juego' },
      { $sort: { puntuacionPromedio: -1 } },
      { $limit: 5 }
    ]);

    if (topGames.length > 0) {
      console.log('\n🏆 TOP 5 JUEGOS MEJOR PUNTUADOS:');
      topGames.forEach((game, index) => {
        console.log(`  ${index + 1}. ${game.juego.titulo} - ${game.puntuacionPromedio.toFixed(1)}⭐ (${game.totalReseñas} reseña(s))`);
      });
    }

    console.log('\n🎉 Seeder completado exitosamente!');
    console.log('📖 Documentación de la API en: http://localhost:3000/api');
    
  } catch (error) {
    console.error('❌ Error durante el seeding:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión a la base de datos cerrada');
    process.exit(0);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, generateFakeGame, generateFakeReview };