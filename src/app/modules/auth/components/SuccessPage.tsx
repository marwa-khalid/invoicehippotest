import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";

export function SuccessPage() {
  interface LocationState {
    textInfo: string;
  }
  const location = useLocation();
  const state = location.state as LocationState;
  const resetTextInfo = state?.textInfo;

  useEffect(() => {
    if (!resetTextInfo) {
      window.location.href = "/";
    }
  }, []);
  const intl = useIntl();
  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      {resetTextInfo && (
        <div className="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px py-20">
          <h1>Success!</h1>
          <p dangerouslySetInnerHTML={{ __html: resetTextInfo }}></p>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <Link to="/" className="link-primary">
              <button
                type="submit"
                id="kt_sign_in_submit"
                className="btn btn-primary mt-100"
              >
                <span className="indicator-label">
                  {" "}
                  {intl.formatMessage({
                    id: "LoginAndRegistration.LoginButtonText",
                  })}{" "}
                  <i className="fa-solid fa-chevron-right"></i>
                </span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
