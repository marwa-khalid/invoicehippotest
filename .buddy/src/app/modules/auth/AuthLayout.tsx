import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.height = "100%";
    }
    return () => {
      if (root) {
        root.style.height = "auto";
      }
    };
  }, []);

  return (
    // <div className="d-flex flex-column flex-lg-row flex-column-fluid">
    //   {/* begin::Body */}

    //   <div className="d-flex flex-column flex-lg-row-fluid w-lg-50  order-2 order-lg-1">
    //     {/* begin::Form */}
    //     <div className="d-flex flex-column ">
    //       {/* begin::Wrapper */}
    //       <div className="w-lg-500px px-10 ">
    //         <Outlet />
    //       </div>
    //       {/* end::Wrapper */}
    //     </div>
    //     {/* end::Form */}
    //   </div>
    //   {/* end::Body */}

    //   {/* begin::Aside */}
    //   <div
    //     className="d-none d-lg-flex flex-lg-row-fluid w-50 bgi-size-cover  order-1 order-lg-2 bgi-position-y-center bgi-position-x-start bgi-no-repeat"
    //     style={{
    //       backgroundImage: `url(${toAbsoluteUrl("media/auth/bg11.png")})`,
    //     }}
    //   ></div>

    //   {/* <div
    //     className=" d-none d-lg-flex flex-lg-row-fluid bgi-size-cover bgi-no-repeat order-1 order-lg-2 "
    //     style={{
    //       backgroundImage: `url(${toAbsoluteUrl("media/auth/bg11.png")})`,
    //       width: "50%",
    //     }}
    //   ></div> */}
    //   {/* end::Aside */}
    // </div>
    <Outlet />
  );
};

export { AuthLayout };
