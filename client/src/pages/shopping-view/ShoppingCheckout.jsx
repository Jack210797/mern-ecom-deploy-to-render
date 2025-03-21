import Address from '@/components/shopping-view/Address'
import img from '../../assets/account.jpg'
import { useSelector } from 'react-redux'
import UserCartItemsContent from '@/components/shopping-view/UserCartItemsContent'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createNewOrder } from '../../store/shop/order-slice'
import { fetchCartItems } from '../../store/shop/cart-slice'

const ShoppingCheckOut = () => {
  const { cartItems } = useSelector((state) => state.shopCart)
  const cartId = localStorage.getItem('cartId')
  const { user } = useSelector((state) => state.auth)
  const { approvalURL } = useSelector((state) => state.shopOrder)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isPaymentStart, setIsPaymentStart] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const storedCartId = localStorage.getItem('cartId')

    if (!storedCartId && user?.id) {
      dispatch(fetchCartItems(user.id))
    }
  }, [dispatch, user])

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem.quantity,
          0
        )
      : 0

  const handleInitialPaypalPayment = () => {
    const orderData = {
      userId: user?.id,
      cartId: cartId,
      cartItems: cartItems.items.map((singleCartItem) => {
        return {
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          image: singleCartItem?.image,
          price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
          quantity: singleCartItem?.quantity
        }
      }),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        zipcode: currentSelectedAddress?.zipcode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes
      },
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: ''
    }

    dispatch(createNewOrder(orderData))
      .then((data) => {
        if (data?.payload?.success) {
          setIsPaymentStart(true)
        } else {
          console.error('Error creating order:', data?.error || 'Undefined error')
          setIsPaymentStart(false)
        }
      })
      .catch((error) => {
        console.error('Error creating order:', error)
      })
  }

  if (approvalURL) {
    window.location.href = approvalURL
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="w-full h-full object-cover object-center" alt="Header" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectedId={currentSelectedAddress?._id} setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((Item, index) => (
              <UserCartItemsContent key={`${Item.productId}-${index}`} cartItem={Item} />
            ))
          ) : (
            <p>Your cart is empty!</p>
          )}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitialPaypalPayment}
              className="w-full"
              disabled={!currentSelectedAddress || !cartItems?.items?.length || !cartId}
            >
              {isPaymentStart ? 'Processing Paypal Payment...' : 'Checkout with Paypal'}
            </Button>
            {!currentSelectedAddress && <p className="text-red-500 mt-2">Please select an address</p>}
            {!cartItems?.items?.length && <p className="text-red-500 mt-2">Your cart is empty</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckOut
