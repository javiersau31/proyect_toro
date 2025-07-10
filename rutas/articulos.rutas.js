const express = require('express');
const router = express.Router();
const articulos = require('../controladores/articulos.controlador');

// CRUD de articulos
router.get('/', articulos.obtenerArticulos);         // Leer todos
router.get('/:id', articulos.obtenerArticuloPorId);  // Leer uno
router.post('/', articulos.crearArticulo);           // Crear
router.put('/:id', articulos.actualizarArticulo);    // Actualizar
router.delete('/:id', articulos.eliminarArticulo);   // Eliminar

module.exports = router;