import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

const HOME = 'https://futureengineracademy.com'

export default function LogoutPage() {
  const { signOut } = useAuthStore()

  useEffect(() => {
    signOut().finally(() => {
      window.location.href = HOME
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-teal border-t-transparent animate-spin" />
        <p className="font-body text-gray-500 text-sm">Signing you out…</p>
      </div>
    </div>
  )
}
