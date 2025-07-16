const db = require('../db/connection');

const obtenerDetallesPorVenta = async (req, res) => {
  const { id_venta } = req.params;
  try {
    const [detalles] = await db.query(`
      SELECT 
        d.id_detalle,
        d.id_articulo,
        a.nombre AS nombre_articulo,
        d.cantidad,
        d.precio_u,
        d.subtotal
      FROM detalle_ventas d
      JOIN articulos a ON d.id_articulo = a.id_articulo
      WHERE d.id_venta = ?`, [id_venta]);

    res.json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener detalles' });
  }
};

// Eliminar un detalle y actualizar el total
const eliminarDetalle = async (req, res) => {
  const { id_detalle } = req.params;

  try {
    const [[detalle]] = await db.query(
      'SELECT subtotal, id_venta FROM detalle_ventas WHERE id_detalle = ?', 
      [id_detalle]
    );

    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });

    await db.query('DELETE FROM detalle_ventas WHERE id_detalle = ?', [id_detalle]);
    await db.query(
      'UPDATE ventas SET total = total - ? WHERE id_venta = ?', 
      [detalle.subtotal, detalle.id_venta]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar detalle' });
  }
};

// Editar un detalle y actualizar el total
const editarDetalle = async (req, res) => {
  const { id_detalle } = req.params;
  const { cantidad, precio_u } = req.body;
  const nuevoSubtotal = cantidad * precio_u;

  try {
    const [[detalle]] = await db.query(
      'SELECT subtotal, id_venta FROM detalle_ventas WHERE id_detalle = ?', 
      [id_detalle]
    );

    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });

    await db.query(
      'UPDATE detalle_ventas SET cantidad = ?, precio_u = ?, subtotal = ? WHERE id_detalle = ?',
      [cantidad, precio_u, nuevoSubtotal, id_detalle]
    );

    const diferencia = nuevoSubtotal - detalle.subtotal;

    await db.query(
      'UPDATE ventas SET total = total + ? WHERE id_venta = ?',
      [diferencia, detalle.id_venta]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar detalle' });
  }
};

module.exports = {
  obtenerDetallesPorVenta,
  eliminarDetalle,
  editarDetalle,
};
