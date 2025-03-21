import { useEffect, useState } from 'react'
import ProductImageUpload from '@/components/admin-view/ProductImageUpload'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { addFeatureImage, getFeatureImages } from '@/store/common-slice'

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const dispatch = useDispatch()
  const { featureImageList } = useSelector((state) => state.commonFeature)

  const handleUploadFeatureImage = () => {
    dispatch(addFeatureImage({ image: uploadedImageUrl })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages())
        setUploadedImageUrl('')
        setImageFile(null)
      }
    })
  }

  useEffect(() => {
    dispatch(getFeatureImages())
  }, [dispatch])

  console.log(featureImageList, 'featureImageList')

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button onClick={() => handleUploadFeatureImage()} className="mt-5 w-full">
        Upload
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList?.length > 0
          ? featureImageList.map((featureImageItem) => (
              <div className="relative">
                <img src={featureImageItem?.image} className="w-full h-{300px} object-cover rounded-t-lg" />
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

export default AdminDashboard
