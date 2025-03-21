import Order from '../../models/Order.js'
import Product from '../../models/Product.js'
import ProductReview from '../../models/Review.js'

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body

    const order = await Order.findOne({ userId, 'cartItems.productId': productId, orderStatsus: 'confirmed' })

    if (!order) {
      return res.status(404).json({ success: false, message: 'You need to purchase this product first!' })
    }

    const checkExistingReview = await ProductReview.findOne({ productId, userId })

    if (checkExistingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' })
    }

    const newReview = new ProductReview({ productId, userId, userName, reviewMessage, reviewValue })
    await newReview.save()

    const reviews = await ProductReview.find({ productId })
    const totalReviewsLegth = reviews.length
    const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLegth

    await Product.findByIdAndUpdate(productId, { averageReview })

    res.status(201).json({ success: true, data: newReview })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params

    const reviews = await ProductReview.find({ productId })

    res.status(200).json({ success: true, data: reviews })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

export { addProductReview, getProductReviews }
