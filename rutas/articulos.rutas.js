const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const verificarToken = require('../middleware');

const {obtenerArticuloPorId, crearArticulo, actualizarArticulo, eliminarArticulo} = require('../controladores/articulos.controlador');

router.get('/', verificarToken, async (req, res) => {
  try {
    const [articulos] = await db.query(
      `SELECT 
         a.id_articulo,
         a.nombre,
         a.descripcion,
         a.precio,
         a.existencia
       FROM articulos a`
    );
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
});



router.get('/:id', verificarToken , obtenerArticuloPorId);  // Leer uno
router.post('/', verificarToken , crearArticulo);           // Crear
router.put('/:id', verificarToken, actualizarArticulo);    // Actualizar
router.delete('/:id', verificarToken , eliminarArticulo);   // Eliminar


module.exports = router;