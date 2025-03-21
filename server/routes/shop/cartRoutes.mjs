import { Router } from 'express'
import { addToCart, fetchCartItems, updateCartItemQty, deleteCartItem } from '../../controllers/shop/cartController.mjs'

const router = Router()

router.post('/add', addToCart)
router.get('/get/:userId', fetchCartItems)
router.put('/update-cart', updateCartItemQty)
router.delete('/:userId/:productId', deleteCartItem)

export default router
