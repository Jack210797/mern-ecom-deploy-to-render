import { useState, useEffect } from 'react'
import { HousePlug, Menu, ShoppingCart, UserCog, LogOut } from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Sheet, SheetTrigger, SheetContent } from '../ui/sheet'
import { Button } from '../ui/button'
import { shoppingViewHeaderMenuItems } from '../../config'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenuItem, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { logoutUser, resetTokenAndCredentials } from '../../store/auth-slice/index.js'
import UserCartWrapper from './UserCartWrapper'
import { fetchCartItems } from '../../store/shop/cart-slice'
import { Label } from '../ui/label'

const MenuItems = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleNavigate = (getCurrentMenuItem) => {
    sessionStorage.removeItem('filters')
    const currentfilter =
      getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== 'products' && getCurrentMenuItem.id !== 'search'
        ? { category: [getCurrentMenuItem.id] }
        : null

    sessionStorage.setItem('filters', JSON.stringify(currentfilter))

    location.pathname.includes('listing') && currentfilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`))
      : navigate(getCurrentMenuItem.path)
  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row ">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  )
}

const HeaderRightContent = () => {
  const [openCartSheet, setOpenCartSheet] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart)
  const userInitial = user?.userName ? user.userName[0].toUpperCase() : '?'

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials())
    localStorage.clear()
    navigate('/auth/login')
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id))
  }, [dispatch])

  const cartItemsToDisplay = cartItems?.items || []

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button className="relative" onClick={() => setOpenCartSheet(true)} variant="outline" size="icon">
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute top-[-5px] right-[2px] text-sm font-bold">{cartItemsToDisplay.length || 0}</span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItemsToDisplay} />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">{userInitial}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56 cursor-pointer flex flex-col gap-1">
          <DropdownMenuLabel className="font-semibold text-sm px-0 py-1">
            Logged in as {user?.userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center h-10"
            onClick={() => {
              navigate('/shop/account')
              setOpenCartSheet(false)
            }}
          >
            <UserCog className="mr-2 h-4 w-4 flex" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center h-10" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/show/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  )
}

export default ShoppingHeader
