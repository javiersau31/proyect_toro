const db = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registrarCliente = async (req, res) => {
  const { nombre, direccion, telefono, email, usuario, contrasena } = req.body;
  try {
    const [existente] = await db.query('SELECT * FROM clientes WHERE usuario = ?', [usuario]);
    if (existente.length > 0) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    await db.query(
      'INSERT INTO clientes (nombre, direccion, telefono, email, usuario, contrasena) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, direccion, telefono, email, usuario, hash]
    );

    res.status(201).json({ mensaje: 'Cliente registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el registro' });
  }
};


exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const [clientes] = await db.query('SELECT * FROM clientes WHERE usuario = ?', [usuario]);

    if (clientes.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario o contraseña inválidos' });
    }

    const cliente = clientes[0];
    const esValida = await bcrypt.compare(contrasena, cliente.contrasena);

    if (!esValida) {
      return res.status(401).json({ mensaje: 'Usuario o contraseña inválidos' });
    }

    const token = jwt.sign({ id_cliente: cliente.id_cliente }, process.env.JWT_SECRET, {
      expiresIn: '10h'
    });


    res.json({
      token,
      cliente: {
        id_cliente: cliente.id_cliente,
        nombre: cliente.nombre,
        email: cliente.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el login' });
  }
};
