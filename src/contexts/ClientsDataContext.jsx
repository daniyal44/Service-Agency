import React, { createContext, useContext, useEffect, useState } from 'react'

/*
  Simple clients/login data store.
  - Persists to localStorage
  - Admin-only access to sensitive fields (passwordHash, loginEntries, profile)
  - Provides functions: login, logout, addClient (admin only), getClients (filtered), getLoginEntries (admin only), updateClientProfile (admin only)
  Note: This is an example/demo store. Replace the simple hash with a secure server-side auth in production.
*/

const STORAGE_KEY = 'clients_data_v1'

const ClientsDataContext = createContext(null)

function simpleHash(password) {
  // lightweight reversible-ish transform for demo only (NOT secure)
  try {
    return btoa(unescape(encodeURIComponent(password || '')))
  } catch {
    return String(password || '')
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { clients: {}, users: {} }
  } catch {
    return { clients: {}, users: {} }
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function ClientsDataProvider({ children }) {
  const [state, setState] = useState(() => loadFromStorage())
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    saveToStorage(state)
  }, [state])

  // internal helpers
  function _getClient(id) {
    return state.clients[id] ? { ...state.clients[id] } : null
  }

  function _putClient(client) {
    setState(prev => {
      const next = { ...prev, clients: { ...prev.clients, [client.id]: client } }
      return next
    })
  }

  // Public API

  // login(payload: { id, name, role, password? })
  function login(payload) {
    if (!payload || !payload.id || !payload.name) {
      throw new Error('Invalid login payload')
    }

    const existing = _getClient(payload.id)

    if (existing) {
      // if client has a passwordHash, require matching password
      if (existing.passwordHash) {
        if (!payload.password) throw new Error('Password required')
        if (existing.passwordHash !== simpleHash(payload.password)) {
          throw new Error('Invalid credentials')
        }
      }
      // record login entry
      const entry = { time: Date.now(), by: payload.name, note: payload.note || null }
      existing.loginEntries = existing.loginEntries || []
      existing.loginEntries.push(entry)
      _putClient(existing)
      setCurrentUser({ id: existing.id, name: existing.name, role: existing.role || 'client' })
      return
    }

    // new user: create a client record (no password unless provided)
    const client = {
      id: payload.id,
      name: payload.name,
      role: payload.role || 'client',
      passwordHash: payload.password ? simpleHash(payload.password) : null,
      profile: payload.profile || {},
      loginEntries: [{ time: Date.now(), by: payload.name, note: payload.note || 'first login' }],
      meta: payload.meta || {},
    }
    _putClient(client)
    setCurrentUser({ id: client.id, name: client.name, role: client.role })
  }

  function logout() {
    setCurrentUser(null)
  }

  // admin-only: addClient({id,name,role,password,profile,meta})
  function addClient(client) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admin can add clients')
    }
    if (!client || !client.id || !client.name) {
      throw new Error('Invalid client')
    }
    if (state.clients[client.id]) {
      throw new Error('Client with this id already exists')
    }
    const stored = {
      id: client.id,
      name: client.name,
      role: client.role || 'client',
      passwordHash: client.password ? simpleHash(client.password) : null,
      profile: client.profile || {},
      loginEntries: client.loginEntries || [],
      meta: client.meta || {},
    }
    _putClient(stored)
  }

  // getClients returns filtered view depending on caller role
  function getClients() {
    const all = Object.values(state.clients || {})
    if (currentUser && currentUser.role === 'admin') {
      // admin sees full objects
      return all.map(c => ({ ...c }))
    }
    // non-admins see limited public fields
    return all.map(c => ({ id: c.id, name: c.name }))
  }

  // admin-only: get detailed login entries for a client
  function getLoginEntries(clientId) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admin can access login entries')
    }
    const c = _getClient(clientId)
    return c ? (c.loginEntries || []) : []
  }

  // admin-only: update a client's profile (sensitive info)
  function updateClientProfile(clientId, updates = {}) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admin can update profile')
    }
    const c = _getClient(clientId)
    if (!c) throw new Error('Client not found')
    c.profile = { ...c.profile, ...updates }
    _putClient(c)
  }

  return (
    <ClientsDataContext.Provider
      value={{
        currentUser,
        login,
        logout,
        addClient,
        getClients,
        getLoginEntries,
        updateClientProfile,
        // internals useful for debugging in UI (admin-only will still enforce when called)
        _rawState: state,
      }}
    >
      {children}
    </ClientsDataContext.Provider>
  )
}

export function useClientsData() {
  const ctx = useContext(ClientsDataContext)
  if (!ctx) throw new Error('useClientsData must be used within ClientsDataProvider')
  return ctx
}