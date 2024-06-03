import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export function SuccessPage() {
    interface LocationState {
        textInfo: string;
    }
    const location = useLocation();
    const state = location.state as LocationState;
    const resetTextInfo = state?.textInfo;

    useEffect(()=>{
        if(!resetTextInfo){
            window.location.href = '/'
        }
    },[])
    
    return (
        <div className="d-flex flex-column justify-content-center vh-100 p-4">
            {resetTextInfo && 
            <div className="my-10">
                <h1 className="my-10">Success!</h1>
                <p dangerouslySetInnerHTML={{ __html: resetTextInfo }}></p>
            </div>}
            <div className='d-flex justify-content-between align-items-center mb-5'>
                 <Link to='/' className='link-primary'>
                    <button
                        type='submit'
                        id='kt_sign_in_submit'
                        className='btn btn-primary'
                    >
                        <span className='indicator-label'>Login <i className="fa-solid fa-chevron-right"></i></span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

