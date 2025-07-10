const conexion = require('../db/conexion');

// Obtener todos los artículos
exports.obtenerArticulos = async (req, res) => {
  try {
    const [rows] = await conexion.query('SELECT * FROM articulos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener artículos', error });
  }
};

// Obtener un artículo por ID
exports.obtenerArticuloPorId = async (req, res) => {
  try {
    const [rows] = await conexion.query('SELECT * FROM articulos WHERE id_articulo = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el artículo', error });
  }
};

// Crear un nuevo artículo
exports.crearArticulo = async (req, res) => {
  try {
    const { nombre, descripcion, precio, existencia } = req.body;
    const [result] = await conexion.query(
      'INSERT INTO articulos (nombre, descripcion, precio, existencia) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, existencia]
    );
    res.json({ mensaje: 'Artículo creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el artículo', error });
  }
};

// Actualizar un artículo
exports.actualizarArticulo = async (req, res) => {
  try {
    const { nombre, descripcion, precio, existencia } = req.body;
    await conexion.query(
      'UPDATE articulos SET nombre = ?, descripcion = ?, precio = ?, existencia = ? WHERE id_articulo = ?',
      [nombre, descripcion, precio, existencia, req.params.id]
    );
    res.json({ mensaje: 'Artículo actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el artículo', error });
  }
};

// Eliminar un artículo
exports.eliminarArticulo = async (req, res) => {
  try {
    await conexion.query('DELETE FROM articulos WHERE id_articulo = ?', [req.params.id]);
    res.json({ mensaje: 'Artículo eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el artículo', error });
  }
};
