import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api';

const UserList = ({ refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]); // Recargar cuando refreshTrigger cambie

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="user-list">
        <h2>👥 Lista de Usuarios</h2>
        <div className="loading">⏳ Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list">
        <h2>👥 Lista de Usuarios</h2>
        <div className="message error">❌ {error}</div>
        <button onClick={fetchUsers} className="btn btn-secondary">
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>👥 Lista de Usuarios ({users.length})</h2>
      
      <button onClick={fetchUsers} className="btn btn-secondary refresh-btn">
        🔄 Actualizar
      </button>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>📭 No hay usuarios registrados aún.</p>
          <p>¡Crea el primer usuario usando el formulario de arriba!</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3>🧑‍💻 {user.username}</h3>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Creado:</strong> {formatDate(user.created_at)}</p>
                <p><strong>Password:</strong> {user.password}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;