import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { login } from '../core/_requests';
import { useAuth } from '../core/Auth';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';


const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};


export function Login() {
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const auth  = await login(values.email, values.password);         
        saveAuth(auth);
          
      } catch (error) {
        saveAuth(undefined);
        setStatus('The login details are incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div>

      <div className='text-end mb-5'>
         <span className="text-gray-500 fw-bold fs-5 me-2" data-kt-translate="sign-in-head-desc">Not a Member yet?</span>
        <Link to='/registration' className='link-primary fw-bold fs-5'>
          Sign up
        </Link>
        
      </div>

      <form
        className='form w-100 py-20'
        onSubmit={formik.handleSubmit}
        noValidate
        id='kt_login_signin_form'
      >

        {/* Large text: Sign In */}
        <div className='text-start mb-5'>
          <h1 className='text-gray-900 mb-3 fs-3x'>Sign In</h1>
          <div className='text-gray-500 fw-semibold fs-6 mb-10'>Get unlimited access & earn money</div>
        </div>

        {/* Email and Password inputs */}
        <div className=' rounded mb-5'>
          <div className='fv-row mb-3'>
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-light border-0 mb-8',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {'is-valid': formik.touched.email && !formik.errors.email},
                
              )}
              type='email'
              name='email'
              autoComplete='off'
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>

          <div className='fv-row mb-3'>
            <input
              type='password'
              placeholder='Password'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-solid bg-light border-0 mb-8',
                {'is-invalid': formik.touched.password && formik.errors.password},
                {'is-valid': formik.touched.password && !formik.errors.password}
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>

          {/* Forgot Password link */}
          <div className='text-end'>
            <Link to='/forgot-password' className='link-primary'>
              Forgot password?
            </Link>
          </div>
        </div>
        
        <div className='d-flex justify-content-between align-items-center mb-5'>
        
            <button
            type='submit'
            id='kt_sign_in_submit'
            className='btn btn-primary'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span className='indicator-label'>Sign In</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          
        </div>
       
        {/* <ToastContainer 
          position="top-center" 
          draggable
          /> */}
      </form>
      
    </div>

  );
}

