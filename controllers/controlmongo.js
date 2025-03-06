const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://agudomota1314:OyBlrXa8eQRiuTNg@cluster0.eivh7.mongodb.net/')
  .then(() => console.log('Conectado a la base de datos!'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Definimos el esquema del documento
const peliculaSchema = new mongoose.Schema({
    titulo: String,
    director: String,
    genero: String,
    anioEstreno: Number
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema, 'peliculas');

const buscarPrimera = () => {
    Pelicula.findOne()
        .then(pelicula => {
            if (pelicula) {
                console.log('Primera película encontrada:', pelicula);
            } else {
                console.log('No se encontró ningún registro');
            }
        })
        .catch(err => console.error('Error al obtener la película:', err));
};

module.exports = { buscarPrimera };