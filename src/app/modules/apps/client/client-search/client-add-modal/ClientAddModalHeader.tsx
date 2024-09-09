import { KTIcon } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  setEditModalOpen: (type: boolean) => void;
  businessName: string;
  customerNr: string;
  setEditModalId: (type: number) => void;
}
const ClientAddModalHeader = ({
  setAddModalOpen,
  setEditModalId,
  setEditModalOpen,
  customerNr,
  businessName,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3 ">
      {/* begin::Modal title */}
      <div className="fv-row col-12 d-flex flex-row justify-content-between align-items-center mb-0">
        <div className="d-flex gap-4">
          {businessName ? (
            <h3 className=" mb-0 text-gray-300">
              {intl.formatMessage({ id: "Fields.ModalEditTitleClient" })}
            </h3>
          ) : (
            <h2 className="fw-bolder mb-0 text-white">
              {intl.formatMessage({ id: "Fields.ModalNewTitleClient" })}
            </h2>
          )}{" "}
          {businessName && (
            <h2 className="text-white me-2">
              ({customerNr} - {businessName})
            </h2>
          )}
        </div>
        {/* begin::Close */}
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          onClick={() => {
            setAddModalOpen(false);
            setEditModalOpen(false);
            setEditModalId(0);
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>
      <ul
        style={{ borderBottom: "0" }}
        className="modal-header fv-row col-12 nav nav-tabs nav-line-tabs nav-line-tabs-2x p-0 fs-5 mt-4 d-flex justify-content-around text-white"
      >
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link active d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_4"
          >
            <i className="ki-duotone ki-user fs-2 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            <span className="text-white">
              {intl.formatMessage({ id: "Fields.ClientSettings" })}
            </span>
          </a>
        </li>
        {/* {showTabs && (
          <> */}
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_5"
          >
            <i className="ki-duotone ki-people fs-1 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
            <span className="text-white">
              {intl.formatMessage({ id: "Fields.ContactPersonSettings" })}
            </span>
          </a>
        </li>
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_6"
          >
            <i className="ki-duotone ki-bank fs-1 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            <span className="text-white">overige instellingen</span>
          </a>
        </li>
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_7"
          >
            <i className="ki-duotone ki-information-4 fs-1 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            <span className="text-white">
              {intl.formatMessage({ id: "Fields.SideMenuCustomFeatures" })}
            </span>
          </a>
        </li>
        {/* </>
        )} */}
      </ul>
    </div>
  );
};

export { ClientAddModalHeader };
