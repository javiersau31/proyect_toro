const express = require('express');
const router = express.Router();
const db = require('../db/connection');

const{obtenerClientes, obtenerClientePorId, crearCliente, actualizarCliente, eliminarCliente} = require('../controladores/clientes.controlador');
const verificarToken = require('../middleware');

router.get('/',verificarToken ,obtenerClientes);
router.get('/:id',verificarToken ,obtenerClientePorId);
router.post('/',verificarToken ,crearCliente);
router.put('/:id',verificarToken ,actualizarCliente);
router.delete('/:id',verificarToken ,eliminarCliente);

module.exports = router;