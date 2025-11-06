import { useState } from 'react'
import './App.css'
import ServerStatus from './components/ServerStatus'
import CreateUser from './components/CreateUser'
import UserList from './components/UserList'
import SearchUser from './components/SearchUser'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Función para refrescar la lista cuando se crea un usuario
  const handleUserCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>APP USUARIOS!</h1>
        <ServerStatus />
      </header>

      <main className="app-main">
        <div className="container">
          <div className="section">
            <CreateUser onUserCreated={handleUserCreated} />
          </div>
          
          <div className="section">
            <SearchUser />
          </div>
          
          <div className="section">
            <UserList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>💻 Desarrollado con React + Vite | 🔗 API Node.js + SQLite</p>
      </footer>
    </div>
  )
}

export default App
