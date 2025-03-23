import { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import CommonForm from '@/components/common/Form'
import { addProductFormElements } from '@/config'
import ProductImageUpload from '@/components/admin-view/ProductImageUpload'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, addNewProduct, editProduct, fetchAllProduct } from '@/store/admin/products-slice'
import { useToast } from '@/hooks/use-toast'
import AdminProductTile from '@/components/admin-view/AdminProductTile'

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  totalStock: ''
}

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null)

  const { productList } = useSelector((state) => state.adminProducts)
  const { toast } = useToast()
  const dispatch = useDispatch()

  function onSubmit(e) {
    e.preventDefault()

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProduct())
            setFormData(initialFormData)
            setOpenCreateProductsDialog(false)
            setCurrentEditedId(null)
            toast({
              title: 'Product edited successfully'
            })
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl
          })
        ).then((data) => {
          console.log(data)
          if (data?.payload?.success) {
            dispatch(fetchAllProduct())
            setOpenCreateProductsDialog(false)
            setImageFile(null)
            setFormData(initialFormData)
            toast({
              title: 'Product added successfully'
            })
          }
        })
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProduct())
        toast({
          title: 'Product deleted successfully'
        })
      }
    })
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== '')
      .every((item) => item)
  }

  useEffect(() => {
    dispatch(fetchAllProduct())
  }, [dispatch])

  return (
    <Fragment>
      {productList?.length === 0 ? (
        <div className="mb-5 mt-5 w-full flex justify-center">
          <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
        </div>
      ) : (
        <div className="mb-5 w-full flex justify-end">
          <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList?.length > 0
          ? productList?.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                key={productItem._id}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false)
          setCurrentEditedId(null)
          setFormData(initialFormData)
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !== null ? 'Edit Product' : 'Add New Product'}</SheetTitle>
            <SheetDescription>
              {currentEditedId !== null ? 'Here you can edit product' : 'Here you can add new product'}
            </SheetDescription>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default AdminProducts
