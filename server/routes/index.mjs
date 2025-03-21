import { Router } from 'express'
import authRouter from './auth/authRoutes.mjs'
import adminProductRouter from './admin/productsRoutes.mjs'
import adminOrderRouter from './admin/orderRoutes.mjs'

import shopProductRouter from './shop/productsRoutes.mjs'
import shopCartRouter from './shop/cartRoutes.mjs'
import shopAddressRouter from './shop/addressRoutes.mjs'
import shopOrderRouter from './shop/orderRoutes.mjs'
import shopSearchRouter from './shop/searchRoutes.mjs'
import shopReviewRouter from './shop/reviewRoutes.mjs'
import commonFeatureRouter from './common/featureRoutes.mjs'

const router = Router()

router.use('/auth', authRouter)
router.use('/admin/products', adminProductRouter)
router.use('/admin/orders', adminOrderRouter)

router.use('/shop/products', shopProductRouter)
router.use('/shop/cart', shopCartRouter)
router.use('/shop/address', shopAddressRouter)
router.use('/shop/order', shopOrderRouter)
router.use('/shop/search', shopSearchRouter)
router.use('/shop/review', shopReviewRouter)

router.use('/common/feature', commonFeatureRouter)

export default router
