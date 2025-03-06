const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express();
const port = 3003;

require('dotenv').config();

mongoose.connect(process.env.CADENA)
  .then(() => console.log('Connected!'));

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());
app.use(express.static('public'));
app.use('/fotos', express.static('uploads'));
app.set('view engine','ejs');
app.set('views', './views');
const modeloPelicula = require('./models/pelicula');
const User = require("./models/User");

// Ruta para subir archivos
app.post('/subir', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }
  res.json({ message: 'Archivo subido correctamente', file: req.file });
});

app.get('/usuarios', (req,res)=>{
  User.find()
  .then( users=>res.json(users))
  .catch(error=>res.status(500).json({mensaje: error}))
}
)

app.get('/usuario/:id', (req,res)=>{
  const id=req.params.id;
  User.findById(id)
  .then( user=>res.render('usuario',{user}))
  .catch(error=>res.status(500).json({mensaje: error}))
}
)

// Registro de usuario
app.post('/registro', upload.single('foto'), (req, res) => {
  const { name, email, password } = req.body;

  // Encriptar contraseña
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      // Crear usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        foto: req.file.filename
      });

      // Guardar usuario
      return newUser.save();
    })
    .then(() => {
      res.json({ message: 'Usuario registrado correctamente' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Comparar contraseñas
      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
          }
          res.json({ message: 'Usuario autenticado correctamente' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    });
});

// Obtener todas las películas
app.get("/peliculas", (req, res) => {
  modeloPelicula.buscarTodas()
  .then(
    peliculas => res.status(200).json(peliculas)
  )
  .catch(err => res.status(500).send("error"))
});

// Obtener una película por ID
app.get("/peliculas/:id", (req, res) => {
  const peliculaId = req.params.id;
  modeloPelicula.buscarPorId(peliculaId)
  .then(
    pelicula => res.status(200).json(pelicula)
  )
  .catch(err => res.status(500).send("error"))
});

// Crear una nueva película
app.post("/peliculas", (req, res) => {
    titulo = req.body.titulo;
    director = req.body.director;
    anio = req.body.anio;
    genero = req.body.genero;
    modeloPelicula.crearNuevaPelicula(titulo, director, anio, genero)
    .then(
      pelicula => res.status(200).json(pelicula)
    )
    .catch(err => res.status(500).send("error"))
});

// Actualizar una película existente
app.put("/peliculas/:id", (req, res) => {
  const peliculaId = req.params.id;
  pelicula = req.body;
  modeloPelicula.actualizarPelicula(peliculaId, pelicula)
  .then(
    peliculaActualizada => res.status(200).json(peliculaActualizada)
  )
  .catch(err => res.status(500).send("error al actualizar la película"))
});

// Eliminar una película
app.delete("/peliculas/:id", (req, res) => {
  const peliculaId = req.params.id;
  modeloPelicula.borrarPelicula(peliculaId)
  .then(
    pelicula => res.status(200).json(pelicula)
  )
  .catch(err => res.status(500).send("error"))
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
