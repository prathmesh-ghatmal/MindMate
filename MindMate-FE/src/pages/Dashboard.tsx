
import { useAuth } from "@/context/AuthProvider"

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h1>

        {user ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.first_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>

            <button
              onClick={logout}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-gray-600">You are not logged in.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
