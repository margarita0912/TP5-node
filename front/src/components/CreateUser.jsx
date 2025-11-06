import { useState } from 'react';
import { createUser } from '../services/api';

const CreateUser = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar mensajes cuando el usuario empieza a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createUser(formData);
      setSuccess(`Usuario ${result.username} creado exitosamente!`);
      setFormData({ username: '', password: '' }); // Limpiar formulario
      
      // Notificar al componente padre que se creó un usuario
      if (onUserCreated) {
        onUserCreated(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user">
      <h2>🆕 Crear Usuario</h2>
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Mínimo 3 caracteres"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 4 caracteres"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.username || !formData.password}
          className="btn btn-primary"
        >
          {loading ? '⏳ Creando...' : '✅ Crear Usuario'}
        </button>
      </form>

      {error && (
        <div className="message error">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="message success">
          ✅ {success}
        </div>
      )}
    </div>
  );
};

export default CreateUser;