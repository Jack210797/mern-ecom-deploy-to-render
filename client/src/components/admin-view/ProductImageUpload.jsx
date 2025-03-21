import { useEffect, useRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import { Button } from '../ui/button'
import axios from 'axios'
import { Skeleton } from '../ui/skeleton'

const ProductImageUpload = ({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false
}) => {
  const inputRef = useRef(null)

  function handleImageFileChange(e) {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      setImageFile(selectedFile)
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]

    if (droppedFile) {
      setImageFile(droppedFile)
    }
  }

  function handleRemoveImage() {
    setImageFile(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  async function uploadImageToCloudinary(imageFile) {
    setImageLoadingState(true)
    const formData = new FormData()
    formData.append('my_file', imageFile)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
        formData,
        config
      )

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.imageUrl)
        setImageLoadingState(false)
      }
    } catch (error) {
      console.log('Error:', error)
    }
  }

  useEffect(() => {
    if (imageFile) uploadImageToCloudinary(imageFile)
  }, [imageFile])

  return (
    <div className={`w-full  mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? 'opacity-60' : ''}border-2 border-dashed rounde-lg p-4 `}
      >
        <Input
          id="productImageUpload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {!imageFile ? (
          <Label
            htmlFor="productImageUpload"
            className={`${
              isEditMode ? 'cursor-not-allowed' : ''
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag and drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className=" h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8  text-primary mr-2" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductImageUpload
