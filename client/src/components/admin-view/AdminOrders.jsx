import { useEffect, useState, useRef } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import AdminOrderDetails from './AdminOrderDetails'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '../../store/admin/order-slice'
import { Badge } from '../ui/badge'

const AdminOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState(null)
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder)
  const dispatch = useDispatch()
  const buttonRefs = useRef({})

  const handleFetchOrderDetails = (getId) => {
    setCurrentOrderId(getId)
    dispatch(getOrderDetailsForAdmin(getId))
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin())
  }, [dispatch])

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true)
  }, [orderDetails])

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === 'Confirmed'
                            ? 'bg-green-500'
                            : orderItem?.orderStatus === 'rejected'
                            ? 'bg-red-600'
                            : orderItem?.orderStatus === 'inShipping'
                            ? 'bg-blue-700'
                            : orderItem?.orderStatus === 'delivered'
                            ? 'bg-yellow-600'
                            : orderItem?.orderStatus === 'inProcess'
                            ? 'bg-orange-500'
                            : 'bg-teal-400'
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog && currentOrderId === orderItem._id}
                        onOpenChange={(open) => {
                          setOpenDetailsDialog(open)
                          if (!open) {
                            dispatch(resetOrderDetails())
                            setTimeout(() => {
                              buttonRefs.current[orderItem._id]?.focus()
                            }, 0)
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            ref={(el) => (buttonRefs.current[orderItem._id] = el)}
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle className="sr-only">Order details</DialogTitle>
                          <DialogDescription className="sr-only">Order details</DialogDescription>
                          <AdminOrderDetails orderDetails={orderDetails} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AdminOrders
