import { KTIcon } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setRestoreModalOpen: (type: boolean) => void;
  attachment: any;
}

const QuoteDeleteModalHeader = ({
  setRestoreModalOpen,
  attachment,
}: ComponentProps) => {
  const intl = useIntl();

  //const delData = localStorage.getItem("DeleteData");
  const delParsedData = JSON.parse(localStorage.getItem("DeleteData")!);

  return (
    <div className="modal-header bg-danger d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({ id: "Fields.ModalUnlinkFileTitle" })}
        </h2>
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setRestoreModalOpen(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>

      {/* New table below the title */}
      <div className="w-100 mt-3" style={{ lineHeight: "0.5" }}>
        <table className="table text-white mt-0">
          <tbody>
            <tr className="my-0">
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.DateOfUpload" })}
              </td>
              <td>: {attachment.dateOfUploadAsString}</td>
            </tr>

            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.FileName" })}
              </td>
              <td>: {attachment.fileName}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { QuoteDeleteModalHeader };
