import { Input } from '@/components/ui/input'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { getSearchResults, resetSearchResults } from '../../store/shop/search-slice'
import ShoppingProductTile from '@/components/shopping-view/ShoppingProductTile'
import { useToast } from '@/hooks/use-toast'
import { fetchCartItems } from '../../store/shop/cart-slice'
import { fetchProductDetails } from '../../store/shop/products-slice'
import { addToCart } from '../../store/shop/cart-slice'
import ProductDetails from '../../components/shopping-view/ProductDetails.jsx'

const ShopSearchProducts = () => {
  const [keyword, setKeyword] = useState('')
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { searchResults } = useSelector((state) => state.shopSearch)
  const { productDetails } = useSelector((state) => state.shopProducts)

  const { cartItems } = useSelector((state) => state.shopCart)
  const { user } = useSelector((state) => state.auth)
  const timeoutRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (keyword && keyword.trim() !== '' && keyword.trim().length > 3) {
      timeoutRef.current = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
        dispatch(getSearchResults(keyword))
      }, 1000)
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
      dispatch(resetSearchResults())
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [keyword, dispatch, setSearchParams])

  const handleAddtoCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || []

    if (getCartItems.length) {
      const indexOfCurrentItems = getCartItems.findIndex((item) => item.productId === getCurrentProductId)

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

    if (!user) return console.log('user not logged in')
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id))
        toast({
          title: 'Product is added to cart'
        })
      }
    })
  }

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true)
  }, [productDetails])
  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>

      {!searchResults.length ? <h1 className="w-full text-center text-5xl font-extrabold">No result found</h1> : null}

      <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddtoCart={handleAddtoCart}
            key={item._id}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetails open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  )
}

export default ShopSearchProducts
