import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChartNoAxesCombined, LayoutDashboard, ShoppingBasket, BadgeCheck, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const adminSidebarMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <LayoutDashboard />
  },
  {
    id: 'products',
    label: 'Products',
    path: '/admin/products',
    icon: <ShoppingBasket />
  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/admin/orders',
    icon: <BadgeCheck />
  }
]

function MenuItems({ setOpenSidebar }) {
  const navigate = useNavigate()

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path)
            setOpenSidebar ? setOpenSidebar(false) : null
          }}
          className="flex text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground cursor-pointer hover:bg-muted hover:text-muted-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  )
}

function AdminSidebar({ openSidebar, setOpenSidebar }) {
  const navigate = useNavigate()
  return (
    <Fragment>
      <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpenSidebar={setOpenSidebar} />
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden lg:flex w-64 flex-col border-r bg-background p-6 ">
        <div onClick={() => navigate('/admin/dashboard')} className="flex cursor-pointer items-center gap-2">
          <ChartNoAxesCombined />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  )
}

export default AdminSidebar
