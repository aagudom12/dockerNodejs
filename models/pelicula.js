const mongoose = require('mongoose');

// Definimos el esquema del documento
const peliculaSchema = new mongoose.Schema({
    titulo: String,
    director: String,
    genero: String,
    anioEstreno: Number
});

// Creamos el modelo
const Pelicula = mongoose.model('Pelicula', peliculaSchema, 'peliculas');

const buscarPrimera = () => {
    return Pelicula.findOne()
        .then(pelicula => {
            if (pelicula) {
                console.log('Primera película encontrada', pelicula);
            } else {
                console.log('No se encontró ningún registro');
            }
        })
        .catch(err => console.error('Error al obtener la película', err));
};

const buscarTodas = () => {
    return Pelicula.find()
        .then(peliculas => {
            if (peliculas.length > 0) {
                console.log('Películas encontradas', peliculas);
                return peliculas;
            } else {
                console.log('No se encontró ningún registro');
                return null;
            }
        })
        .catch(err => {
            console.error('Error al obtener las películas', err);
            throw err;
        });
};

const buscarPorId = (id) => {
    return Pelicula.findById(id)
        .then(pelicula => {
            if (pelicula) {
                console.log('Película encontrada', pelicula);
                return pelicula;
            } else {
                console.log('No se encontró ninguna película con el ID ' + id);
                return null;
            }
        })
        .catch(err => {
            console.error('Error al obtener la película con ID ' + id, err);
            throw err;
        });
};

const buscarPorAnioMinimo = (anioMinimo) => {
    Pelicula.find({ anioEstreno: { $gte: anioMinimo } })
        .then(peliculas => {
            if (peliculas.length > 0) {
                console.log('Películas encontradas con año de estreno mayor o igual a ' + anioMinimo, peliculas);
            } else {
                console.log('No se encontró ningún registro');
            }
        })
        .catch(err => console.error('Error al obtener las películas', err));
};

const crearNuevaPelicula = (titulo, director, genero, anioEstreno) => {
    const nuevaPelicula = new Pelicula({
        titulo,
        director,
        genero,
        anioEstreno
    });

    return nuevaPelicula.save()
        .then(pelicula => {
            console.log('Película guardada:', pelicula);
            return pelicula;
        })
        .catch(err => {
            console.error('Error al guardar la película:', err);
            throw err;
        });
};

const actualizarPelicula = (idPelicula, datosActualizados) => {
    return Pelicula.findByIdAndUpdate(idPelicula, datosActualizados, { new: true })
        .then(peliculaActualizada => {
            if (peliculaActualizada) {
                console.log('Película actualizada:', peliculaActualizada);
                return peliculaActualizada;
            } else {
                console.log('No se encontró ninguna película con ese ID.');
                return null;
            }
        })
        .catch(err => console.error('Error al actualizar la película:', err));
};

const borrarPelicula = (idPelicula) => {
    return Pelicula.findByIdAndDelete(idPelicula)
        .then(peliculaEliminada => {
            if (peliculaEliminada) {
                console.log('Película eliminada:', peliculaEliminada);
                return peliculaEliminada;
            } else {
                console.log('No se encontró ninguna película con ese ID.');
                return null;
            }
        })
        .catch(err => {
            console.error('Error al eliminar la película:', err);
            throw err;
        });
};

module.exports = {
    buscarPrimera,
    buscarTodas,
    buscarPorId,
    buscarPorAnioMinimo,
    crearNuevaPelicula,
    actualizarPelicula,
    borrarPelicula,
    Pelicula
};
