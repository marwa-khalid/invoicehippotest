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
      <div className="d-flex flex-column flex-lg-row flex-column-fluid">
        <div className="d-flex flex-column flex-column-fluid flex-center w-lg-50 p-10">
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
        <div
          className="d-none d-lg-flex flex-lg-row-fluid w-50 bgi-size-cover bgi-position-y-center bgi-position-x-start bgi-no-repeat"
          style={{
            backgroundImage: `url(${toAbsoluteUrl("media/auth/bg11.png")})`,
          }}
        ></div>
      </div>
    </div>
  );
}
