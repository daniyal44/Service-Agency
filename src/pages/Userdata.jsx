import React, { useState } from 'react'
import { useClientsData } from '../contexts/ClientsDataContext'

function Userdata() {
  const { currentUser, login, logout, addClient, getClients } = useClientsData()
  const [name, setName] = useState('')
  const [role, setRole] = useState('client') // 'admin' or 'client'

  function handleLogin(e) {
    e.preventDefault()
    if (!name) return
    const id = Date.now().toString()
    login({ id, name, role })
    setName('')
  }

  function handleAddSampleClient() {
    try {
      addClient({ id: Date.now().toString(), name: 'New Client ' + Date.now(), meta: {} })
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      {!currentUser ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Name: </label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label>Role: </label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <div>Signed in as: {currentUser.name} ({currentUser.role})</div>
          <button onClick={logout}>Logout</button>
          {currentUser.role === 'admin' && (
            <button onClick={handleAddSampleClient} style={{ marginLeft: 8 }}>
              Add sample client (admin only)
            </button>
          )}
          <h3>Visible clients</h3>
          <ul>
            {getClients().map(c => (
              <li key={c.id}>{c.name} - {c.id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Userdata
