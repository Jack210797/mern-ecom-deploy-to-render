import { Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/Layout.jsx'
import AuthLogin from './pages/auth/Login.jsx'
import AuthRegister from './pages/auth/Register.jsx'
import AdminLayout from './components/admin-view/AdminLayout.jsx'
import AdminDashboard from './pages/admin-view/AdminDashboard.jsx'
import AdminFeatures from './pages/admin-view/AdminFeatures.jsx'
import AdminOrdersView from './pages/admin-view/AdminOrdersView.jsx'
import AdminProducts from './pages/admin-view/AdminProducts.jsx'
import ShoppingLayout from './components/shopping-view/ShoppingLayout.jsx'
import NotFound from './pages/not-found/NotFound.jsx'
import ShoppingListing from './pages/shopping-view/ShoppingListing.jsx'
import ShoppingHome from './pages/shopping-view/ShoppingHome.jsx'
import ShoppingCheckOut from './pages/shopping-view/ShoppingCheckout.jsx'
import ShoppingAccount from './pages/shopping-view/ShoppingAccount.jsx'
import CheckAuth from './components/common/CheckAuth.jsx'
import PaypalReturn from './pages/shopping-view/PaypalReturn.jsx'
import PaymentSucces from './pages/shopping-view/PaymentSucces.jsx'
import ShopSearchProducts from './pages/shopping-view/ShopSearchProducts.jsx'
import UnAuthPage from './pages/unauth-page/UnAuth.jsx'

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/auth-slice/index.js'
import { Skeleton } from '@/components/ui/skeleton'

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('token'))
    dispatch(checkAuth(token))
  }, [dispatch])

  if (isLoading) {
    return <Skeleton className="w-[600px] h-[60px] rounded-full" />
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <Routes>
          <Route path="/" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}></CheckAuth>} />

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrdersView />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          <Route path="/shop" element={<ShoppingLayout />}>
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="checkout" element={<ShoppingCheckOut />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="paypal-return" element={<PaypalReturn />} />
            <Route path="payment-success" element={<PaymentSucces />} />
            <Route path="search" element={<ShopSearchProducts />} />
          </Route>

          <Route path="*" element={<NotFound />} />
          <Route path="/unauth-page" element={<UnAuthPage />} />
        </Routes>
      </CheckAuth>
    </div>
  )
}

export default App
