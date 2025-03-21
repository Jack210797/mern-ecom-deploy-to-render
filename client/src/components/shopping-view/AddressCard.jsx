import { Button } from '../ui/button'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId
}) => {
  return (
    <Card
      className={`cursor-pointer ${selectedId === addressInfo?._id ? 'border-red-900 border-[4px]' : 'border-black'}`}
      onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null}
    >
      <CardContent className={`${selectedId === addressInfo?._id ? 'border-black' : ''}grid gap-4 p-4`}>
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Zip Code: {addressInfo?.zipcode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between items-center">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  )
}

export default AddressCard
