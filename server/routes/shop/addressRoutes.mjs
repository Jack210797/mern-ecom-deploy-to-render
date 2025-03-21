import { Router } from 'express'
import { addAddress, fetchAllAddress, editAddress, deleteAddress } from '../../controllers/shop/addressController.mjs'

const router = Router()

router.post('/add', addAddress)
router.get('/get/:userId', fetchAllAddress)
router.put('/update/:userId/:addressId', editAddress)
router.delete('/delete/:userId/:addressId', deleteAddress)

export default router
