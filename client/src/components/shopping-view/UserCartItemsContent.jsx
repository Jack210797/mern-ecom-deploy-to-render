import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice'
import { fetchAllFilteredProducts } from '@/store/shop/products-slice'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart)
  const { productList } = useSelector((state) => state.shopProducts)

  const dispatch = useDispatch()
  const { toast } = useToast()

  useEffect(() => {
    if (!productList || productList.length === 0) {
      dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: '' }))
    }
  }, [dispatch, productList])

  const handleCartItemDelete = (getCartItem) => {
    dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: 'Cart item is deleted successfully'
        })
      }
    })
  }

  const handleUpdateQuantity = (getCartItem, typeOfAction) => {
    if (typeOfAction === 'plus') {
      let getCartItems = cartItems.items || []

      if (getCartItems.length) {
        const indexOfCurrentItems = getCartItems.findIndex((item) => item.productId === getCartItem?.productId)

        const getCurrentProductIndex = productList.findIndex((product) => product._id === getCartItem?.productId)

        if (getCurrentProductIndex === -1) {
          toast({
            title: 'Product not found in product list',
            variant: 'destructive'
          })
          return
        }

        const getTotalStock = productList[getCurrentProductIndex].totalStock

        if (indexOfCurrentItems > -1) {
          const getQuantity = getCartItems[indexOfCurrentItems]?.quantity
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: 'destructive'
            })
            return
          }
        }
      }
    }
    const newQuantity = typeOfAction === 'plus' ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity: newQuantity
      })
    )
      .then((data) => {
        if (data?.payload?.success) {
          toast({
            title: 'Cart item is updated successfully'
          })
        } else {
          toast({
            title: 'Failed to update cart item',
            description: data?.payload?.message || 'An error occurred',
            variant: 'destructive'
          })
        }
      })
      .catch((error) => {
        console.error('Error updating cart:', error)
        toast({
          title: 'Failed to update cart item',
          description: 'Network error or server unavailable',
          variant: 'destructive'
        })
      })
  }

  return (
    <div className="flex items-center space-x-4">
      <img src={cartItem?.image} alt={cartItem?.title} className="w-20 h-20 rounded object-cover" />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => handleUpdateQuantity(cartItem, 'minus')}
            disabled={cartItem?.quantity === 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => handleUpdateQuantity(cartItem, 'plus')}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
        </p>
        <Trash onClick={() => handleCartItemDelete(cartItem)} size={20} className="cursor-pointer mt-1" />
      </div>
    </div>
  )
}

export default UserCartItemsContent
