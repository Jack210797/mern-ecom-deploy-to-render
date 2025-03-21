import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import ProductFilter from '../../components/shopping-view/ProductFilter'
import { Button } from '@/components/ui/button'
import { ArrowDownUp } from 'lucide-react'
import { sortOptions } from '../../config/index.js'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts } from '../../store/shop/products-slice'
import ShoppingProductTile from '@/components/shopping-view/ShoppingProductTile'
import { useSearchParams } from 'react-router-dom'
import { fetchProductDetails } from '../../store/shop/products-slice/index.js'
import ProductDetails from '../../components/shopping-view/ProductDetails.jsx'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { useToast } from '@/hooks/use-toast'

const createSearchParamsHelper = (filterParams) => {
  const queryParams = []

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',')

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
    }
  }

  return queryParams.join('&')
}

const ShoppingListing = () => {
  const dispatch = useDispatch()
  const { productList, productDetails } = useSelector((state) => state.shopProducts)
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart)

  const [filters, setFilter] = useState({})
  const [sort, setSort] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const { toast } = useToast()

  const categorySearchParam = searchParams.get('category')

  const handleSort = (value) => {
    setSort(value)
  }

  const handleFilter = (getSectionId, getCurrentOption) => {
    let copyFilters = { ...filters }
    const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId)

    if (indexOfCurrentSection === -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption]
      }
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOption)
      if (indexOfCurrentOption === -1) copyFilters[getSectionId].push(getCurrentOption)
      else copyFilters[getSectionId].splice(indexOfCurrentOption, 1)
    }

    setFilter(copyFilters)
    sessionStorage.setItem('filters', JSON.stringify(copyFilters))
  }

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

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

  useEffect(() => {
    setSort('price-lowtohigh')
    setFilter(JSON.parse(sessionStorage.getItem('filters')) || {})
  }, [categorySearchParam])

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters)
      setSearchParams(new URLSearchParams(createQueryString))
    }
  }, [filters])

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }))
  }, [dispatch, sort, filters])

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true)
  }, [productDetails])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filter={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold ">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowDownUp className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  key={productItem._id}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetails open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  )
}

export default ShoppingListing
