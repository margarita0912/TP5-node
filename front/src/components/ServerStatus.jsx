import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

const ServerStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const healthData = await checkHealth();
      setStatus(healthData);
    } catch (error) {
      setStatus({ status: 'error', error: 'Servidor no disponible' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Verificar estado cada 30 segundos
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="server-status loading">
        ⏳ Verificando servidor...
      </div>
    );
  }

  const isOnline = status?.status === 'ok';

  return (
    <div className={`server-status ${isOnline ? 'online' : 'offline'}`}>
      <div className="status-indicator">
        {isOnline ? '🟢' : '🔴'} 
        Servidor: {isOnline ? 'En línea' : 'Fuera de línea'}
      </div>
      {isOnline && status && (
        <div className="status-details">
          <small>
            Base de datos: {status.database} | 
            Puerto: {status.port} | 
            Última verificación: {new Date(status.timestamp).toLocaleTimeString()}
          </small>
        </div>
      )}
      <button onClick={fetchStatus} className="btn btn-small">
        🔄
      </button>
    </div>
  );
};

export default ServerStatus;