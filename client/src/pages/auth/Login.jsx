import CommonForm from '@/components/common/Form'
import { loginFormControls } from '@/config'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../store/auth-slice/index.js'
import { useToast } from '@/hooks/use-toast'

const initialState = {
  email: '',
  password: ''
}

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message
        })

        // const userRole = data.payload.user.role
        // if (userRole === 'admin') {
        //   navigate('/admin/dashboard')
        // } else {
        //   navigate('/shop/home')
        // }
      } else {
        toast({
          title: data?.payload?.message,
          variant: 'destructive'
        })
      }
    })
  }
  return (
    <div className="mx-auto w-full max-w-md spae-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
        <p className="mt-2 ">
          Don't have an account?
          <Link className="font-medium text-primary ml-2 hover:underline" to="/auth/register">
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={'Sign in'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default AuthLogin
