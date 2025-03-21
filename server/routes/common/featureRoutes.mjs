import { Router } from 'express'
import { addFeatureImage, getFeatureImages } from '../../controllers/common/featureController.mjs'

const router = Router()

router.post('/add', addFeatureImage)
router.get('/get', getFeatureImages)

export default router
