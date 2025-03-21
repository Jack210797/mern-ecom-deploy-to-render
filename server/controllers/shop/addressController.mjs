import Address from '../../models/Address.js'

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, zipcode, phone, notes } = req.body

    if (!userId || !address || !city || !zipcode || !phone || !notes) {
      return res.status(400).json({ success: false, message: 'Invalid data provided' })
    }

    const newCreatedAdress = new Address({ userId, address, city, zipcode, phone, notes })

    await newCreatedAdress.save()
    res.status(200).json({ success: true, message: 'Address added successfully', data: newCreatedAdress })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User id is manadatory' })
    }

    const addressList = await Address.find({ userId })

    res.status(200).json({ success: true, data: addressList })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params
    const formData = req.body

    if (!userId || !addressId) {
      return res.status(400).json({ success: false, message: 'User and address is required' })
    }

    const address = await Address.findOneAndUpdate({ _id: addressId, userId }, formData, { new: true })

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' })
    }

    res.status(200).json({ success: true, message: 'Address updated successfully', data: address })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params

    if (!userId || !addressId) {
      return res.status(400).json({ success: false, message: 'User and address is required' })
    }
    const address = await Address.findOneAndDelete({ _id: addressId, userId })

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' })
    }

    res.status(200).json({ success: true, message: 'Address deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

export { addAddress, fetchAllAddress, editAddress, deleteAddress }
