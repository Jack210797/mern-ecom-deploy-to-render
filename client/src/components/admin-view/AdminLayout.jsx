import AdminSidebar from './AdminSidebar.jsx'
import AdminHeader from './AdminHeader.jsx'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false)
  return (
    <div className="flex min-h-screen w-full">
      {/* admin Sidebar */}
      <AdminSidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <AdminHeader setOpenSidebar={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
