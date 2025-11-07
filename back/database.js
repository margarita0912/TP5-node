// back/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const AZURE_PATH = process.env.SQLITE_PATH || '/home/site/data/app.sqlite';
const LOCAL_PATH = path.join(__dirname, 'database.sqlite');

// Ruta final a usar (si hay SQLITE_PATH usamos esa; local usa archivo del repo)
const targetPath = process.env.SQLITE_PATH ? AZURE_PATH : LOCAL_PATH;

// Asegura carpeta destino (sobre todo en Azure)
fs.mkdirSync(path.dirname(targetPath), { recursive: true });

// Si estamos en Azure (SQLITE_PATH seteado) y no existe aún la DB en /home,
// pero sí existe la del repo (/back/database.sqlite), la copiamos una vez.
try {
  if (process.env.SQLITE_PATH && !fs.existsSync(targetPath) && fs.existsSync(LOCAL_PATH)) {
    fs.copyFileSync(LOCAL_PATH, targetPath);
    console.log(`📦 Copiada DB inicial desde ${LOCAL_PATH} → ${targetPath}`);
  }
} catch (e) {
  console.warn('⚠️ No se pudo copiar DB inicial:', e.message);
}

class Database {
  constructor() {
    this.db = new sqlite3.Database(targetPath, (err) => {
      if (err) {
        console.error('❌ Error abriendo base de datos:', err.message);
      } else {
        console.log('✅ Conectado a SQLite:', targetPath);
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
      if (err) console.error('❌ Error creando tabla users:', err.message);
      else console.log('🧱 Tabla users lista');
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, password, created_at FROM users ORDER BY created_at DESC';
      this.db.all(sql, [], (err, rows) => err ? reject(err) : resolve(rows || []));
    });
  }

  createUser(username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      this.db.run(sql, [username, password], function (err) {
        if (err) {
          if (String(err.message).includes('UNIQUE constraint failed')) {
            reject(new Error('El username ya existe'));
          } else reject(err);
        } else {
          resolve({ id: this.lastID, username, message: 'Usuario creado exitosamente' });
        }
      });
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, password, created_at FROM users WHERE id = ?';
      this.db.get(sql, [id], (err, row) => err ? reject(err) : resolve(row));
    });
  }

  ping() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT 1 as result', [], (err, row) => err ? reject(err) : resolve(row));
    });
  }

  close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) console.error('❌ Error cerrando base:', err.message);
        else console.log('🔚 Base de datos cerrada');
        resolve();
      });
    });
  }
}

module.exports = Database;
