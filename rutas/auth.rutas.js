const express = require('express');
const router = express.Router();
const auth = require('../controladores/auth.controlador');

router.post('/register', auth.registrarCliente);

router.post('/login', auth.login);


module.exports = router;