import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { authorizeAnonymous, checkSepaOdata, login } from "../core/_requests";
import { useAuth } from "../core/Auth";
import "react-toastify/dist/ReactToastify.css";
import { LanguagesAuth } from "../../../../_metronic/partials/layout/header-menus/LanguagesAuth";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { handleToast } from "../core/_toast";

const TwoFactor = () => {
  const { saveAuth } = useAuth();
  const intl = useIntl();
  const navigate = useNavigate();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();

  const odata = query.get("odata");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  useEffect(() => {
    if (!odata) {
      navigate("/");
    }
  }, []);
  // Define the validation schema using Yup
  const loginSchema = Yup.object().shape({
    accessCode: Yup.string().required(
      intl
        .formatMessage({ id: "Common.RequiredFieldHint2" })
        .replace("{0}", intl.formatMessage({ id: "Fields.Code" }))
    ),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      accessCode: "",
      odata: odata,
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus }) => {
      setIsSubmitting(true);
      try {
        const auth = await authorizeAnonymous(values);
        if (auth.isValid) {
          saveAuth(auth);
        }
        setIsSubmitting(false);
        handleToast(auth);
      } catch (error) {
        saveAuth(undefined);
        setStatus(intl.formatMessage({ id: "Common.LoginError" }));
        setIsSubmitting(false);
      }
    },
  });

  const [code, setCode] = useState(Array(5).fill("")); // Array to store each digit
  const inputRefs = useRef<HTMLInputElement[]>([]); // Array of refs to focus inputs

  // Function to handle input change
  // Function to handle input change
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("Text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    if (pastedData.length === 5) {
      const newCode = pastedData.split("").slice(0, 5); // Only take the first 5 characters
      setCode(newCode);
      formik.setFieldValue("accessCode", newCode.join(""));

      // Automatically fill each input box with the pasted characters
      inputRefs.current.forEach((input, idx) => {
        if (input) input.value = newCode[idx];
      });
    }
  };

  // Function to handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (value) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      formik.setFieldValue("accessCode", newCode.join(""));

      // Move to the next input field if not the last
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Function to handle key down for backspace functionality
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (code[index] === "") {
        // Move to previous input field if empty
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        // Clear the current field
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
        formik.setFieldValue("accessCode", newCode.join(""));
      }
    }
  };

  // Function to clear all inputs
  const clearAll = () => {
    setCode(Array(5).fill(""));
    formik.setFieldValue("accessCode", "");
    inputRefs.current[0].focus(); // Focus on the first input after clearing
  };
  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-lg-row flex-column-fluid">
        {/* Logo for small screens */}
        <Link to="/" className="d-block d-lg-none mx-auto py-20">
          <img
            alt="Logo"
            src="media/logos/logo.png"
            className="theme-light-show h-200px"
          />
          <img
            alt="Logo"
            src="media/logos/logo.png"
            className="theme-dark-show h-200px"
          />
        </Link>

        {/* Left side content */}
        <div className="d-flex flex-column flex-column-fluid flex-center w-lg-50 p-10">
          <div className="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px">
            <div className="d-flex flex-stack py-2">
              {/* Back link */}
              <div className="me-2">
                <Link to="/" className="btn btn-icon bg-light rounded-circle">
                  <i className="ki-outline ki-black-left fs-2 text-gray-800"></i>
                </Link>
              </div>

              {/* Sign Up link */}
              <div className="m-0">
                <span className="text-gray-500 fw-bold fs-5 me-2">
                  {intl.formatMessage({
                    id: "LoginAndRegistration.SubTitleLogin",
                  })}
                </span>
                <Link to="/registration" className="link-primary fw-bold fs-5">
                  {intl.formatMessage({
                    id: "LoginAndRegistration.SubTitleLinkLogin",
                  })}
                </Link>
              </div>
            </div>

            <div className="py-10">
              <form
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                noValidate
                id="kt_login_password_reset_form"
                onSubmit={formik.handleSubmit}
              >
                <div className="text-start mb-10">
                  <h1 className="text-gray-900 mb-3 fs-3x">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.AnonymousAccessTitle",
                    })}
                  </h1>
                  <div className="text-gray-500 fw-semibold fs-6">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.AnonymousAccessIntro",
                    })}
                  </div>
                </div>
                <div className="fv-row mb-10">
                  <div className="d-flex flex-wrap flex-stack mb-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el!)} // Assign each input ref
                        type="text"
                        maxLength={1}
                        value={code[index]}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste} // Add the onPaste handler here
                        className="form-control form-control-solid h-60px w-60px fs-2qx text-center border-primary border-hover mx-1 my-2"
                      />
                    ))}
                  </div>
                  <span
                    className="text-primary fw-bold cursor-pointer"
                    onClick={clearAll}
                  >
                    maak velden leeg
                  </span>
                </div>

                <div className="d-flex flex-end">
                  <button
                    type="submit"
                    id="kt_password_reset_submit"
                    className="btn btn-primary me-2"
                    disabled={
                      isSubmitting || formik.values.accessCode.length !== 5
                    }
                  >
                    <span className="indicator-label">
                      {intl.formatMessage({
                        id: "LoginAndRegistration.AnonymousAccessButton",
                      })}
                    </span>

                    {isSubmitting && (
                      <span className="indicator-progress">
                        {intl.formatMessage({
                          id: "Common.Busy",
                        })}
                        ...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                  {/* <Link to="/">
                    <button
                      type="button"
                      id="kt_login_password_reset_form_cancel_button"
                      className="btn btn-lg btn-light-primary fw-bold"
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      {intl.formatMessage({ id: "Fields.ActionCancel" })}
                    </button>
                  </Link> */}
                </div>
              </form>
            </div>

            <div className="m-0">
              <LanguagesAuth />
            </div>
          </div>
        </div>

        {/* Right side image */}
        <div
          className="d-none d-lg-flex flex-lg-row-fluid w-50 bgi-size-cover bgi-position-y-center bgi-position-x-start bgi-no-repeat"
          style={{
            backgroundImage: `url(${toAbsoluteUrl("media/auth/bg11.png")})`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TwoFactor;
