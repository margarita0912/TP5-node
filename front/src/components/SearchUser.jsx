import { useState } from 'react';
import { getUserById } from '../services/api';

const SearchUser = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      setError('Por favor ingresa un ID de usuario');
      return;
    }

    setLoading(true);
    setError('');
    setUser(null);
    setHasSearched(true);

    try {
      const userData = await getUserById(userId.trim());
      setUser(userData);
    } catch (err) {
      if (err.message.includes('Error: 404')) {
        setError(`Usuario con ID ${userId} no encontrado`);
      } else {
        setError('Error al buscar usuario: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUserId('');
    setUser(null);
    setError('');
    setHasSearched(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="search-user">
      <h2>🔍 Buscar Usuario</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="number"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              if (error) setError('');
              if (hasSearched) setHasSearched(false);
              if (user) setUser(null);
            }}
            placeholder="Ingresa el ID del usuario (ej: 1, 2, 3...)"
            min="1"
            disabled={loading}
            className="search-input"
          />
          <button 
            type="submit" 
            disabled={loading || !userId.trim()}
            className="btn btn-search"
          >
            {loading ? '⏳' : '🔍'} {loading ? 'Buscando...' : 'Buscar'}
          </button>
          {(user || hasSearched) && (
            <button 
              type="button" 
              onClick={handleClear}
              className="btn btn-clear"
              disabled={loading}
            >
              🗑️ Limpiar
            </button>
          )}
        </div>
      </form>

      {/* Resultados */}
      <div className="search-results">
        {loading && (
          <div className="loading">
            ⏳ Buscando usuario con ID {userId}...
          </div>
        )}

        {error && (
          <div className="message error">
            ❌ {error}
          </div>
        )}

        {user && (
          <div className="user-found">
            <div className="message success">
              ✅ Usuario encontrado
            </div>
            <div className="user-card search-result">
              <div className="user-info">
                <h3>🧑‍💻 {user.username}</h3>
                <div className="user-details">
                  <p><strong>🆔 ID:</strong> {user.id}</p>
                  <p><strong>📅 Creado:</strong> {formatDate(user.created_at)}</p>
                  <p><strong>🔑 Password:</strong> {user.password}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !user && !loading && !error && (
          <div className="message error">
            ❌ No se encontró ningún usuario con ID {userId}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUser;