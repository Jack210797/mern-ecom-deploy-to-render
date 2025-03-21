import Order from '../../models/Order.js'

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({})

    if (!orders) {
      return res.status(404).json({ success: false, message: 'No orders found' })
    }

    res.status(200).json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order Not found' })
    }

    res.status(200).json({ succes: true, data: order })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { orderStatus } = req.body

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order Not found' })
    }

    await Order.findByIdAndUpdate(id, { orderStatus })

    res.status(200).json({ success: true, message: 'Order status is updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

export { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus }
