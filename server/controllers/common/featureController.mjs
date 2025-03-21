import Feature from '../../models/Feature.js'

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body

    const featureImages = new Feature({ image })

    await featureImages.save()
    res.status(200).json({ success: true, data: featureImages })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({})
    if (!images) {
      return res.status(404).json({ success: false, message: 'No images found' })
    }

    res.status(200).json({ success: true, data: images })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error occured' })
  }
}

export { addFeatureImage, getFeatureImages }
