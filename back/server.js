const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('./database');

const app = express();
const port = process.env.PORT || 8080;
const allowedOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5173';

// Inicializar base de datos
const db = new Database();

// Middleware
app.use(express.json());

// Configurar CORS solo para desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: allowedOrigins.split(','),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept'],
    credentials: true
  }));
}

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, 'dist');
try {
  app.use(express.static(frontendPath));
  console.log('📁 Sirviendo frontend desde:', frontendPath);
} catch (error) {
  console.log('⚠️ Frontend dist no encontrado, solo API disponible');
}

// Rutas de la API (con prefijo /api)

// Health check
app.get('/api/healthz', async (req, res) => {
  try {
    await db.ping();
    res.json({
      status: 'ok',
      database: 'sqlite',
      timestamp: new Date().toISOString(),
      port: port
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      error: error.message,
      database: 'sqlite'
    });
  }
});

// GET /api/users - Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

// POST /api/users - Crear usuario
app.post('/api/users', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación
    if (!username || !password) {
      return res.status(400).json({
        error: 'Se requieren username y password'
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        error: 'El username debe tener al menos 3 caracteres'
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        error: 'El password debe tener al menos 4 caracteres'
      });
    }

    // Crear usuario
    const result = await db.createUser(username.trim(), password);
    
    res.status(201).json({
      message: result.message,
      id: result.id,
      username: result.username
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    
    if (error.message === 'El username ya existe') {
      res.status(409).json({
        error: error.message
      });
    } else {
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  }
});

// GET /api/users/:id - Obtener usuario por ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

// Ruta de información de la API
app.get('/api', (req, res) => {
  res.json({
    message: '🚀 API Node.js + SQLite funcionando',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/healthz',
      users: 'GET /api/users',
      createUser: 'POST /api/users',
      getUser: 'GET /api/users/:id'
    }
  });
});

// Fallback para el frontend (SPA)
app.get('*', (req, res) => {
  // Si es una ruta de API que no existe, devolver 404 JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'Endpoint de API no encontrado',
      method: req.method,
      path: req.originalUrl
    });
  }
  
  // Para cualquier otra ruta, servir el frontend
  try {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } catch (error) {
    res.status(404).json({
      error: 'Frontend no disponible',
      message: 'Ejecuta el build del frontend primero'
    });
  }
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await db.close();
  process.exit(0);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor Full-Stack iniciado en puerto ${port}`);
  console.log(`📊 Base de datos: SQLite`);
  console.log(`🌐 Aplicación: http://localhost:${port}`);
  console.log(`📍 Health check: http://localhost:${port}/api/healthz`);
  console.log(`👥 API Usuarios: http://localhost:${port}/api/users`);
  console.log(`📁 Frontend: http://localhost:${port}`);
});