'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)

    if (data.user) {
      fetchAgents()
    }
  }

  async function login() {
    const { error } = await supabase.auth.signInWithOtp({
      email: email
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for login link!')
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function fetchAgents() {
    const { data } = await supabase
      .from('agents')
      .select('*')

    setAgents(data || [])
  }

  // 🔐 LOGIN SCREEN
if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <h1 className="text-xl font-bold mb-4 text-center">
          Agent Portal Login
        </h1>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  )
}


  // ✅ DASHBOARD AFTER LOGIN
// DASHBOARD UI
return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Agent Portal Dashboard
        </h1>

        <div className="text-right">
          <p className="text-sm text-gray-500">{user.email}</p>
          <button 
            onClick={logout}
            className="text-red-500 text-sm mt-1 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <p className="text-gray-600">
          Total Agents: 
          <span className="font-semibold ml-2">{agents.length}</span>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-3">{agent.id}</td>
                <td className="p-3">{agent.name}</td>
                <td className="p-3">{agent.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      agent.status === 'Online'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    {agent.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
)

}