const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const verificarToken = require('../middleware');

const{ obtenerDetallesPorVenta, eliminarDetalle, editarDetalle } = require('../controladores/detalle_venta.controlador');

router.get('/detalle/:id_venta',verificarToken ,obtenerDetallesPorVenta);

router.delete('/detalle/:id_detalle',verificarToken, eliminarDetalle); 

router.put('/detalle/:id_detalle', verificarToken, editarDetalle);

router.get('/ventas',verificarToken, async (req, res) => {
  try {
    const [ventas] = await db.query(
  `SELECT 
        v.id_venta,
     DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i') AS fecha,
     v.total,
     c.nombre AS nombre_cliente
   FROM ventas v
   JOIN clientes c ON v.id_cliente = c.id_cliente`
);
    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

router.get('/clientes',verificarToken,async (req, res) => {
  try {
    const [clientes] = await db.query(
      'SELECT id_cliente, nombre FROM clientes WHERE tipo = ?', ['cliente']
    );
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

router.post('/',verificarToken ,async (req, res) => {
  const { id_admin, id_cliente } = req.body;
  if (!id_admin || !id_cliente) {
    return res.status(400).json({ error: 'Faltan datos necesarios' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO ventas (id_admin, id_cliente) VALUES (?, ?)',
      [id_admin, id_cliente]
    );
    res.json({ id_venta: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la venta' });
  }
});


router.post('/detalle', verificarToken, async (req, res) => {
  const { id_venta, id_articulo, cantidad, precio_u } = req.body;
  if (!id_venta || !id_articulo || !cantidad || !precio_u) {
    return res.status(400).json({ error: 'Faltan datos en detalle de venta' });
  }
  if (isNaN(cantidad) || isNaN(precio_u) || cantidad <= 0 || precio_u <= 0) {
    return res.status(400).json({ error: 'Cantidad y precio unitario deben ser mayores a cero y deben ser numericos' });
  }

  try {
     const [articuloRows] = await db.query(
      'SELECT existencia FROM articulos WHERE id_articulo = ?',
      [id_articulo]
    );
    if (articuloRows.length === 0) {
      return res.status(404).json({ error: 'Articulo no encontrado' });
    }
    const existenciaActual = articuloRows[0].existencia;
    if (existenciaActual < cantidad) {
      return res.status(400).json({ error: 'No hay suficiente stock para la cantidad solicitada' });
    }


    const subtotal = cantidad * precio_u;
  
    await db.query(
      'INSERT INTO detalle_ventas (id_venta, id_articulo, cantidad, precio_u, subtotal) VALUES (?, ?, ?, ?, ?)',
      [id_venta, id_articulo, cantidad, precio_u, subtotal]
    );

    await db.query(
      'UPDATE ventas SET total = total + ? WHERE id_venta = ?',
      [subtotal, id_venta]
    );

     await db.query(
      'UPDATE articulos SET existencia = existencia - ? WHERE id_articulo = ?',
      [cantidad, id_articulo]
    );


    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar detalle' });
  }
});

router.delete('/ventas/:id_venta', verificarToken, async (req, res) => {
  const { id_venta } = req.params;

  try {
    // Primero eliminamos los detalles de la venta
    await db.query('DELETE FROM detalle_ventas WHERE id_venta = ?', [id_venta]);

    // Luego eliminamos la venta
    await db.query('DELETE FROM ventas WHERE id_venta = ?', [id_venta]);

    res.json({ success: true, mensaje: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
});

router.put('/actualizar-total/:id_venta', async (req, res) => {
  const { id_venta } = req.params;
  try {
    const [result] = await db.query(
      `UPDATE ventas SET total = (
         SELECT IFNULL(SUM(subtotal), 0)
         FROM detalle_venta
         WHERE id_venta = ?
       ) WHERE id_venta = ?`,
      [id_venta, id_venta]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el total' });
  }
});
module.exports = router;
