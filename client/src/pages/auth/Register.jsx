import CommonForm from '@/components/common/Form'
import { registerFormControls } from '@/config'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../store/auth-slice/index.js'
import { useToast } from '@/hooks/use-toast'

const initialState = {
  userName: '',
  email: '',
  password: ''
}

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message
          })
          navigate('/auth/login')
        } else {
          toast({
            title: data?.payload?.message,
            variant: 'destructive'
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="mx-auto w-full max-w-md spae-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
        <p className="mt-2 ">
          Already have an account?
          <Link className="font-medium text-primary ml-2 hover:underline" to="/auth/login">
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={'Sign up'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default AuthRegister
