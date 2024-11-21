import { KTIcon } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
  parsedData: any;
}

const ProductDeleteModalHeader = ({
  setDeleteModalOpen,
  setDeleteModalId,
  parsedData,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex justify-content-between align-items-center bg-danger flex-column">
      <div className="d-flex w-100 justify-content-between align-items-center">
        {/* begin::Modal title */}
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({ id: "Fields.ModalDeleteTitleProduct" })}
        </h2>
        {/* end::Modal title */}

        {/* begin::Close */}
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setDeleteModalOpen(false);
            setDeleteModalId([]);
            localStorage.removeItem("ModalData");
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>
      <div className="w-100 mt-3" style={{ lineHeight: "0.5" }}>
        <table className="table text-white mt-0">
          <tbody>
            <tr className="my-0">
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.Code" })}
              </td>
              <td>: {parsedData.code}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.FullName" })}
              </td>
              <td>: {parsedData.displayName}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.UnitPrice" })}
              </td>
              <td>: €{parsedData.unitPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* end::Close */}
    </div>
  );
};

export { ProductDeleteModalHeader };
