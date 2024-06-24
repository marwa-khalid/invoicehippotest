import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { VatTypesListWrapper } from "./users-list/VatTypesList";
import UsersPage from "../../../modules/apps/user-management/UsersPage";
// const vatTypesBreadcrumbs: Array<PageLink> = [
//   {
//     title: "Vat Types",
//     path: "/admin/vattype",
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: "",
//     path: "",
//     isSeparator: true,
//     isActive: false,
//   },
// ];

const VatTypes = () => {
  return (
    // <Routes>
    //   <Route element={<Outlet />}>
    //     <Route
    //       path="vattype"
    //       element={
    //         <>
    //           <PageTitle breadcrumbs={vatTypesBreadcrumbs}>
    //             Types list
    //           </PageTitle>
    //           <VatTypesListWrapper />
    //         </>
    //       }
    //     />
    //   </Route>
    //   <Route index element={<Navigate to="/admin/vattype" />} />
    // </Routes>
    <>
      <UsersPage />
    </>
  );
};

export default VatTypes;
