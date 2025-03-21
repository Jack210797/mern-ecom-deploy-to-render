import { Router } from 'express'
import { addProductReview, getProductReviews } from '../../controllers/shop/productReviewController.mjs'

const router = Router()

router.get('/:productId', getProductReviews)
router.post('/add', addProductReview)

export default router
