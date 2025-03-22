import { addressFormControls } from '@/config'
import CommonForm from '../common/Form'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAddress, deleteAddress, fetchAllAddress, editAddress } from '../../store/shop/address-slice'
import AddressCard from './AddressCard'
import { useToast } from '@/hooks/use-toast'

const initialAddressFormData = {
  address: '',
  city: '',
  phone: '',
  zipcode: '',
  notes: ''
}
const Address = ({ setCurrentSelectedAddress, selectedId }) => {
  const [formData, setFormData] = useState(initialAddressFormData)
  const [currentEditedId, setCurrentEditedId] = useState(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { addressList } = useSelector((state) => state.shopAddress)
  const { toast } = useToast()

  const handleManageAddress = (e) => {
    e.preventDefault()

    if (currentEditedId === null && addressList.length >= 3) {
      setFormData(initialAddressFormData)
      toast({
        title: 'You can add only 3 address',
        variant: 'destructive'
      })
      return
    }

    currentEditedId !== null
      ? dispatch(editAddress({ userId: user?.id, addressId: currentEditedId, formData })).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id))
            setCurrentEditedId(null)
            setFormData(initialAddressFormData)
            toast({
              title: data?.payload?.message
            })
          }
        })
      : dispatch(addNewAddress({ ...formData, userId: user?.id })).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id))
            setFormData(initialAddressFormData)
            toast({
              title: data?.payload?.message
            })
          }
        })
  }

  const handleDeleteAddress = (getCurrentAddress) => {
    dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress?._id })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id))
        toast({
          title: data?.payload?.message
        })
      }
    })
  }

  const handleEditAddress = (getCurrentAddress) => {
    setCurrentEditedId(getCurrentAddress?._id)
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      zipcode: getCurrentAddress?.zipcode,
      notes: getCurrentAddress?.notes
    })
  }

  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== '')
      .every((item) => item)
  }

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id))
  }, [dispatch])

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                selectedId={selectedId}
                key={singleAddressItem._id}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                addressInfo={singleAddressItem}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>{currentEditedId !== null ? 'Edit Address' : 'Add New Address'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  )
}

export default Address
