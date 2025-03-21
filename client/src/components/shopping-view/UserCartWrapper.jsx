import { current } from '@reduxjs/toolkit'
import { Button } from '../ui/button'
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet'
import UserCartItemsContent from './UserCartItemsContent'
import { useNavigate } from 'react-router-dom'

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const navigate = useNavigate()

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem.quantity,
          0
        )
      : 0

  return (
    <SheetContent className="sm:max-w-md" aria-describedby="cart-description">
      <SheetHeader>
        <SheetTitle> Your Cart</SheetTitle>
        <SheetDescription id="cart-description" className="sr-only">
          Перегляд товарів у вашому кошику
        </SheetDescription>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => <UserCartItemsContent key={item?.productId} cartItem={item} />)
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate('/shop/checkout')
          setOpenCartSheet(false)
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  )
}

export default UserCartWrapper
