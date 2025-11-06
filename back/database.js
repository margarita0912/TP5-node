const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error abriendo base de datos:', err.message);
      } else {
        console.log('✅ Conectado a SQLite database:', dbPath);
        this.initTables();
      }
    });
  }

  initTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creando tabla users:', err.message);
      } else {
        console.log('✅ Tabla users lista');
      }
    });
  }

  // Obtener todos los usuarios
  getAllUsers() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, password, created_at FROM users ORDER BY created_at DESC';
      
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  // Crear usuario
  createUser(username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      
      this.db.run(sql, [username, password], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            reject(new Error('El username ya existe'));
          } else {
            reject(err);
          }
        } else {
          resolve({
            id: this.lastID,
            username: username,
            message: 'Usuario creado exitosamente'
          });
        }
      });
    });
  }

  // Obtener usuario por ID
  getUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, password, created_at FROM users WHERE id = ?';
      
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Verificar conexión
  ping() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT 1 as result', [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Cerrar conexión
  close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error cerrando base de datos:', err.message);
        } else {
          console.log('Base de datos cerrada');
        }
        resolve();
      });
    });
  }
}

module.exports = Database;