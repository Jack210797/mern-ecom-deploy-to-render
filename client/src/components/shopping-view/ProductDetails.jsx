import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { StarIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, fetchCartItems } from '../../store/shop/cart-slice'
import { useToast } from '@/hooks/use-toast'
import { setProductDetails } from '@/store/shop/products-slice'
import { Label } from '@radix-ui/react-label'
import StarRating from '../common/StarRating'
import { useEffect, useState } from 'react'
import { addReview, getReviews } from '@/store/shop/review-slice'

const ProductDetails = ({ open, setOpen, productDetails }) => {
  const [reviewMsg, setReviewMsg] = useState('')
  const [rating, setRating] = useState(0)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { toast } = useToast()
  const { cartItems } = useSelector((state) => state.shopCart)
  const { reviewList } = useSelector((state) => state.shopReview)

  const handleRatingChange = (getRating) => {
    setRating(getRating)
  }

  const handleAddtoCart = (getCurrentProductId, getTotalStock) => {
    if (!user) return console.log('user not logged in')

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

    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id))
        toast({
          title: 'Product is added to cart'
        })
      }
    })
  }

  const handleDialogClose = () => {
    setOpen(false)
    dispatch(setProductDetails())
    setRating(0)
    setReviewMsg('')
  }

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating
      })
    ).then((data) => {
      console.log(data, 'data')
      if (data?.payload?.success) {
        setReviewMsg('')
        setRating(0)
        dispatch(getReviews(productDetails?._id))
        toast({
          title: 'Review added successfully'
        })
      }
    })
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id))
    }
  }, [productDetails])

  const averageReview =
    reviewList && reviewList.length > 0
      ? reviewList.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviewList.length
      : 0

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <DialogTitle className="sr-only">{productDetails?.title || 'Product details'}</DialogTitle>
        <DialogDescription className="sr-only">{productDetails?.title || 'Product details'}</DialogDescription>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">{productDetails?.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? 'line-through' : ''}`}>
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">${productDetails?.salePrice}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex item-center gap-0.5">
              <StarRating rating={averageReview} />
            </div>
            <span className="text-muted-foreground">({averageReview.toFixed(1)})</span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleAddtoCart(productDetails?._id, productDetails?.totalStock)}
              >
                Add to cart
              </Button>
            )}
          </div>
          <Separator />

          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>

            <div className="grid gap-6">
              {reviewList && reviewList.length > 0 ? (
                reviewList.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarRating rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground text-md">{reviewItem?.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>

            <div className="mt-6 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRating rating={rating} handleRatingChange={handleRatingChange} />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review"
                className="w-full"
              />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ''}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetails
