const db = require('../db/connection');
const bcrypt = require('bcryptjs');

const obtenerClientes = async (req, res) => {
  try {
    const [clientes] = await db.query(
      'SELECT id_cliente,nombre,direccion,email,telefono from clientes WHERE tipo = ?', ['cliente']
    );
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
}
const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [[cliente]] = await db.query('SELECT id_cliente,nombre,email,telefono,direccion,usuario FROM clientes WHERE id_cliente = ?', [id]);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

// Crear cliente
const crearCliente = async (req, res) => {
  const { nombre, direccion, telefono, email,tipo } = req.body;
  let { usuario, contrasena } = req.body; 

  if (!nombre || nombre.trim() === '' || !direccion || direccion.trim() === '' || !telefono || telefono.trim() === '' || !email || email.trim() === '') {
    return res.status(400).json({ error: 'Faltan datos necesarios' });
  }

   if (!usuario) {
    usuario = `user_${Date.now()}`;
  }
  if (!contrasena) {
    contrasena = 'temporal123';
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await db.query(
      'INSERT INTO clientes (nombre, direccion, telefono, email, usuario, contrasena, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre.trim(), direccion.trim(), telefono.trim(), email.trim(), usuario, hashedPassword , tipo || 'cliente']
    );

    res.json({ success: true, message: 'Cliente creado correctamente' });
  } catch (error) {
    console.error('ERROR AL CREAR CLIENTE:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

// Actualizar cliente
const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, email } = req.body;

  if (!nombre || nombre.trim() === '' || !direccion || direccion.trim() === '' || !telefono || telefono.trim() === '' || !email || email.trim() === '') {
    return res.status(400).json({ error: 'Faltan datos' });  }

  try {
    await db.query(
      'UPDATE clientes SET nombre = ?, direccion = ?, telefono = ?, email = ? WHERE id_cliente = ?',
      [nombre.trim(), direccion.trim(), telefono.trim(), email.trim(), id]
    );
    res.json({ success: true, message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const [ventas] = await db.query('SELECT * FROM ventas WHERE id_cliente = ?', [id]);
    if (ventas.length > 0) {
      return res.status(400).json({ error: 'Este cliente tiene ventas registradas y no puede ser eliminado.' });
    }
    await db.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    res.json({ success: true, message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};