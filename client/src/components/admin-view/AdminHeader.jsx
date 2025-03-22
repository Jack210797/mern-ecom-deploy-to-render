import { AlignJustify, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux'
import { logoutUser, resetTokenAndCredentials } from '../../store/auth-slice/index.js'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({ setOpenSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials())
    localStorage.clear()
    navigate('/auth/login')
  }
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpenSidebar(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader
