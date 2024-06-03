import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestResetLink} from '../core/_requests'
import { useNavigate } from 'react-router-dom'
import {toast,ToastContainer} from 'react-toastify'
import { handleToast } from '../core/_toast'
const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
     
      const reset = await requestResetLink(values.email)
      console.log(reset)
      if(reset.isValid) {
          console.log('Password')
          setHasErrors(false)
          setLoading(false)
          localStorage.setItem('reset_email', values.email)
          navigate('/forgot-password/success',{ state: { textInfo: reset.textInfo } })
      }
      else{
        
        handleToast(reset);
        setHasErrors(true)
        setLoading(false)
        setSubmitting(false)
        setStatus('The login detail is incorrect')
      }
    }
  })

  return (
    <div>
       <div className='d-flex flex-wrap justify-content-between pb-lg-0 align-items-center'>
       
          <Link to='/' className="btn btn-icon bg-light rounded-circle">
            <i className="ki-outline ki-black-left fs-2 text-gray-800"></i>
          </Link>
        <div>
          <span className="text-gray-500 fw-bold fs-5 me-2" data-kt-translate="sign-in-head-desc">Already a Member?</span>
          <Link to='/' className='link-primary fw-bold fs-5'>
            Sign in
          </Link>
        </div>
      </div>
    
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework py-20'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-start mb-10'>
          {/* begin::Title */}
          <h1 className='text-gray-900 mb-3 fs-3x'>Forgot Password ?</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className='text-gray-500 fw-semibold fs-6'>
            Enter your email to reset your password.
          </div>
          {/* end::Link */}
        </div>

        {/* begin::Form group */}
        <div className='fv-row mb-8'>
         
          <input
            type='email'
            placeholder='Email'
            autoComplete='off'
            
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control bg-light',
              {'is-invalid': formik.touched.email && formik.errors.email},
              {
                'is-valid': formik.touched.email && !formik.errors.email,
              }
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-start pb-lg-0'>
          <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
            <span className='indicator-label'>Submit</span>
            {loading && (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          <Link to='/'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-lg btn-light-primary fw-bold'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Cancel
            </button>
          </Link>{' '}
        </div>
        {/* <ToastContainer 
        position='top-center'
        /> */}
        {/* end::Form group */}
      </form>
    </div>
  )
}
