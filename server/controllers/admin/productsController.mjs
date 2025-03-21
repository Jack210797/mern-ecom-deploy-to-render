import { imageUploadUtil } from '../../helpers/cloudinary.js'
import Product from '../../models/Product.js'

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File not found' })
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`

    const result = await imageUploadUtil(dataURI)

    res.json({ success: true, imageUrl: result.secure_url })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

//add a new product

const addProduct = async (req, res) => {
  try {
    const { image, title, description, category, brand, price, salePrice, totalStock } = req.body
    const newProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    })

    await newProduct.save()
    res.status(200).json({ success: true, message: 'Product added successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find()
    res.status(200).json({ success: true, data: listOfProducts })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

//edit a product

const editProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { image, title, description, category, brand, price, salePrice, totalStock } = req.body

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock
      },
      { new: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

//delete a product

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const findProduct = await Product.findByIdAndDelete(id)

    if (!findProduct) return res.status(404).json({ success: false, message: 'Product not found' })

    res.status(200).json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

export { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct }
