const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./rutas/auth.rutas'));

const ventasRoutes = require('./rutas/ventas.rutas');
app.use('/api/ventas', ventasRoutes);

const articulosRoutes = require('./rutas/articulos.rutas');
app.use('/api/articulos', articulosRoutes);

const clientesRoutes = require('./rutas/cliente.rutas');
app.use('/api/clientes', clientesRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
