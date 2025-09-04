import { FC } from "react";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

const ErrorPage: FC = () => {
  return (
    <div>
      {/* begin::Illustration */}

      <div className="">
        <h1 className="fw-bolder text-gray-900">Oops!</h1>
        <img
          src={toAbsoluteUrl("media/auth/404.png")}
          className="mw-300 h-300px theme-light-show"
          alt=""
        />
        <img
          src={toAbsoluteUrl("media/auth/404-error-dark.png")}
          className="mw-100 mh-300px theme-dark-show"
          alt=""
        />
        <div className="fw-semibold fs-6 text-gray-500">
          We can't find that page.
        </div>
      </div>

      {/* end::Illustration */}
    </div>
  );
};

export { ErrorPage };
