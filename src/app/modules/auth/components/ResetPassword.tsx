

import {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { checkUUIDValidity,changePassword} from '../core/_requests'
import {Link} from 'react-router-dom'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import {useAuth} from '../core/Auth'
import { useLocation } from 'react-router-dom';
import { handleToast } from '../core/_toast'
import { useNavigate } from 'react-router-dom'
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const initialValues = {
  emailAddress: '',
  languageType: 0,
  password: '',
  changepassword:'',
  passwordResetToken:''
}

const resetSchema = Yup.object().shape({
  
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match")
})

export function ResetPassword () {
  const [loading, setLoading] = useState(false)
  const {saveAuth} = useAuth()
  const navigate = useNavigate()
  const query = useQuery();
  const uuid = query.get('uuid');
  // const reset_email = localStorage.getItem('reset_email')

  useEffect(()=>{

    const checkUUID = async () => {
        const response  = await checkUUIDValidity(uuid);
         console.log(response)
         
        if(response.hasErrors){
            navigate('/');
        }
        else{
            formik.setFieldValue('emailAddress', response.result.emailAddress);
            formik.setFieldValue('passwordResetToken', response.result.passwordResetToken);
            formik.setFieldValue('languageType', response.result.languageType);  
        }
        handleToast(response)
    }
    checkUUID();
            
  },[])
 console.log(uuid)
  const formik = useFormik({
    initialValues,
    validationSchema: resetSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const response = await changePassword(
          values.emailAddress,
          values.password,
          values.changepassword,
          values.passwordResetToken,
          values.languageType
        )
        handleToast(response)
        navigate('/');
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework py-20'
        noValidate
        id='kt_login_signup_form'
        onSubmit={formik.handleSubmit}
      >
      {/* begin::Heading */}
        <div className='text-start mb-11'>
          {/* begin::Title */}
          <h1 className='text-gray-900 mb-3 fs-3x'>New Password!</h1>
          {/* end::Title */}

          <div className="text-gray-500 fw-semibold fs-6" data-kt-translate="general-desc">Set your new password here.</div>
                    
        </div>
        {/* end::Heading */}

        {/* Email */}
        <div className='fv-row mb-10'>
          <input
            placeholder='Email'
            type='email'
            readOnly
            autoComplete='off'
            data-kt-translate='sign-up-input-email'
            {...formik.getFieldProps('emailAddress')}
            className=
              'form-control form-control-lg form-control-solid bg-light'
          />
          
        </div>
        
        {/* Password */}
        <div className='fv-row mb-10' data-kt-password-meter='true'>
          <div className='mb-1'>
            <div className='position-relative mb-3'>
              <input
                type='password'
                placeholder='Password'
                autoComplete='off'
                {...formik.getFieldProps('password')}
                name='password'
                data-kt-translate='sign-up-input-password'
                className={clsx(
                  'form-control form-control-lg form-control-solid bg-light',
                  {
                    'is-invalid': formik.touched.password && formik.errors.password,
                  },
                  {
                    'is-valid': formik.touched.password && !formik.errors.password,
                  }
                )}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                </div>
              )}
              {/* <span className='btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2' data-kt-password-meter-control='visibility'>
                <i className='ki-outline ki-eye-slash fs-2'></i>
                <i className='ki-outline ki-eye fs-2 d-none'></i>
              </span> */}
            </div>
            <div className='d-flex align-items-center mb-3' data-kt-password-meter-control='highlight'>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
            </div>
          </div>
          <div className='text-muted' data-kt-translate='sign-up-hint'>Use 8 or more characters with a mix of letters, numbers & symbols.</div>
        </div>
        
          {/* Confirm Password */}
        <div className='fv-row mb-10'>
          <input 
            type='password'
            placeholder='Password confirmation'
            autoComplete='off'
            {...formik.getFieldProps('changepassword')}
            name='changepassword' 
            data-kt-translate='sign-up-input-confirm-password'
            className={clsx(
              'form-control bg-light form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
              },
              {
                'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
              }
            )}
          />
          {formik.touched.changepassword && formik.errors.changepassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.changepassword}</span>
              </div>
            </div>
          )} 
        </div>
        
        {/* Actions */}
        <div className='d-flex flex-stack'>
          {/* Submit */}
          <button id='kt_sign_up_submit' className='btn btn-primary' data-kt-translate='sign-up-submit'
          disabled={formik.isSubmitting || !formik.isValid}
          >
          
            {!loading && <span className='indicator-label'>Confirm</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
            <span className='indicator-progress'>Please wait... <span className='spinner-border spinner-border-sm align-middle ms-2'></span></span>
          </button>

        </div>

        {/* end::Login options */}

        {formik.status && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>{formik.status}</div>
          </div>
        )}  

      </form>
    </>
  )
}
