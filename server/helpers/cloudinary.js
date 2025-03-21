import cloudinary from 'cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

async function imageUploadUtil(file) {
  const result = await cloudinary.v2.uploader.upload(file, {
    folder: 'products',
    resource_type: 'auto'
  })
  return result
}

export { imageUploadUtil, upload }
