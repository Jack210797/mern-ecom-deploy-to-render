import { Label } from '../ui/label'
import { DialogTitle, DialogContent } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useSelector } from 'react-redux'

const ShoppingOrderDetails = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth)
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle className="sr-only">Order details</DialogTitle>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === 'Confirmed'
                    ? 'bg-green-500'
                    : orderDetails?.orderStatus === 'rejected'
                    ? 'bg-red-600'
                    : orderDetails?.orderStatus === 'inShipping'
                    ? 'bg-blue-700'
                    : orderDetails?.orderStatus === 'delivered'
                    ? 'bg-yellow-600'
                    : orderDetails?.orderStatus === 'inProcess'
                    ? 'bg-orange-500'
                    : 'bg-teal-400'
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between" key={item?.productId || `item-${index}`}>
                      <span>Titile: {item?.title}</span>
                      <span>Quantity: {item?.quantity}</span>
                      <span>Price: ${item?.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            {orderDetails?.addressInfo ? (
              <div className="grid gap-0.5 text-muted-foreground">
                <span>Name: {user?.userName}</span>
                <span>Address: {orderDetails.addressInfo.address}</span>
                <span>City: {orderDetails.addressInfo.city}</span>
                <span>Zipcode: {orderDetails.addressInfo.zipcode}</span>
                <span>Phone: {orderDetails.addressInfo.phone}</span>
                <span>Notes: {orderDetails.addressInfo.notes}</span>
              </div>
            ) : (
              <div className="text-muted-foreground">Address information not available</div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetails
