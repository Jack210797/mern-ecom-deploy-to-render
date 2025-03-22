import paypal from '../../helpers/paypal.js'
import Order from '../../models/Order.js'
import Cart from '../../models/Cart.js'
import Product from '../../models/Product.js'

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId
    } = req.body

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid total amount' })
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' })
    }

    const validatedCartItems = cartItems.map((item) => {
      if (!item.price || isNaN(item.price)) {
        throw new Error(`Invalid price for item: ${item.title || 'Unknown product'}`)
      }
      return {
        name: item.title || 'Product',
        sku: item.productId,
        price: (item.price || 0).toFixed(2),
        currency: 'USD',
        quantity: item.quantity || 1
      }
    })

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title || 'Product',
              sku: item.productId,
              price: (item.price || 0).toFixed(2),
              currency: 'USD',
              quantity: item.quantity || 1
            }))
          },
          amount: {
            currency: 'USD',
            total: (totalAmount || 0).toFixed(2)
          },
          description: 'Order description'
        }
      ]
    }

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Error while creating paypal payment' })
      } else {
        const newCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId
        })

        await newCreatedOrder.save()

        const approvalURL = paymentInfo.links.find((link) => link.rel === 'approval_url').href
        res.status(201).json({ success: true, approvalURL, orderId: newCreatedOrder._id })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body

    let order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    order.paymentStatus = 'paid'
    order.orderStatus = 'confirmed'
    order.paymentId = paymentId
    order.payerId = payerId

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId)
      if (!product) {
        return res.status(404).json({ success: false, message: `Not enought stock for this product ${product.title}` })
      }
      product.totalStock -= item.quantity
      await product.save()
    }

    const getCartId = order.cartId

    if (getCartId) {
      try {
        const cart = await Cart.findById(getCartId)
        if (cart) {
          await Cart.findByIdAndDelete(getCartId)
        } else {
          console.log(`Cart with ID ${getCartId} not found`)
        }
      } catch (error) {
        console.error(`Error deleting cart: ${error.message}`)
      }
    } else {
      console.error(`Cannot delete cart: cartId is undefined`)
    }

    await order.save()

    res.status(200).json({ success: true, message: 'Order confirmed', data: order })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params

    const orders = await Order.find({ userId })

    if (!orders) {
      return res.status(404).json({ success: false, message: 'No orders found' })
    }

    res.status(200).json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const getOrderDetails = async (req, res) => {
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

export { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails }
