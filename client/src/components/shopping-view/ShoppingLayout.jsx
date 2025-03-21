import { Outlet } from 'react-router-dom'
import ShoppingHeader from './ShoppingHeader.jsx'

const ShoppingLayout = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* {common header} */}
      <ShoppingHeader />
      <main className="flex-col flex w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default ShoppingLayout
