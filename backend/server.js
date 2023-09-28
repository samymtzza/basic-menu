// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('./middleware');
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('password123', 8)
    }
];

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });


// Endpoint de autenticación
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ accessToken: null, message: 'Contraseña inválida' });
    }

    const token = jwt.sign({ id: user.id }, 'super_secret_key', {
        expiresIn: 86400  // Expira en 24 horas
    });

    res.status(200).json({ id: user.id, username: user.username, accessToken: token });
});

// Endpoint para obtener todas las secciones
app.get('/secciones', async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM secciones");
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para obtener todos los platillos

app.get('/platillos', async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM platillos");
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para agregar un platillo
app.post('/platillos', verifyToken, upload.single('imagen'), async (req, res) => {
    console.log("Datos recibidos:", req.body);
    const { nombre, descripcion, precio, seccion_id } = req.body;

    // Asignar la ruta del archivo si existe, o null si no se envió imagen
    const imagePath = req.file ? req.file.path : null;  // Aquí se guarda la ruta de la imagen, si fue enviada

    try {
        const [results] = await db.query("INSERT INTO platillos (nombre, descripcion, precio, imagen, seccion_id) VALUES (?, ?, ?, ?, ?)", [nombre, descripcion, precio, imagePath, seccion_id]);
        res.json({ id: results.insertId, ...req.body, imagen: imagePath });
    } catch (error) {
        console.error("Error al insertar:", error);
        res.status(500).json({ error: error.message });
    }
});


// Endpoint para actualizar un platillo
app.put('/platillos/:id', verifyToken, upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    const id = req.params.id;

    let updateFields = [];
    let updateValues = [];

    if (nombre !== undefined) {
        updateFields.push("nombre = ?");
        updateValues.push(nombre);
    }

    if (descripcion !== undefined) {
        updateFields.push("descripcion = ?");
        updateValues.push(descripcion);
    }

    if (precio !== undefined) {
        updateFields.push("precio = ?");
        updateValues.push(precio);
    }

    if (req.file && req.file.path) {
        updateFields.push("imagen = ?");
        updateValues.push(req.file.path);
    }

    // Si no hay cambios, enviar una respuesta adecuada.
    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    const updateQuery = `UPDATE platillos SET ${updateFields.join(", ")} WHERE id = ?`;
    updateValues.push(id);

    try {
        await db.query(updateQuery, updateValues);
        res.json({ message: 'Platillo actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ error: error.message });
    }
    console.log(updateQuery, updateValues);
});




// Endpoint para borrar un platillo
app.delete('/platillos/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM platillos WHERE id = ?", [id]);
        res.json({ message: 'Platillo borrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware de manejo de errores:
app.use((err, req, res, next) => {
    console.error("Error detallado:", err);
    res.status(500).send('¡Algo salió mal!');
});


const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

