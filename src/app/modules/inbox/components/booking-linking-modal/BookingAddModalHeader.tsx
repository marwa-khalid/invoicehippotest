import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { BookingPostResult } from "../../../accounting/bookings/components/core/_models";
import { KTIcon } from "../../../../../_metronic/helpers";

interface ComponentProps {
  setAttatchCostModalOpen: (type: boolean) => void;
  formik?: FormikProps<BookingPostResult>;
  inboxDetail: any;
  title?: string;
}

const BookingAddModalHeader = ({
  setAttatchCostModalOpen,
  formik,
  inboxDetail,
  title,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div>
          <h2 className="fw-bold text-white">
            {title
              ? title
              : intl.formatMessage({
                  id: "Fields.ModalInboxAttachToBooking",
                })}
          </h2>
        </div>

        {/* Close Button */}
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          onClick={() => setAttatchCostModalOpen(false)}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-2x text-white mt-2" />
        </div>
      </div>

      {/* Ribbon at the right end of the header */}
      {formik && formik.values.voucherNumber && (
        <div className="ribbon ribbon-end position-absolute top-20 end-0 w-300px">
          <div className="ribbon-label fw-bold bg-secondary">
            <small className="rounded p-0 text-dark fw-bold">
              {formik.values.voucherNumber}
            </small>
          </div>
        </div>
      )}

      {/* New table below the title */}
      <div className="w-100 mt-3" style={{ lineHeight: "0.5" }}>
        <table className="table text-white mt-0">
          <tbody>
            <tr className="my-0">
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.DateOfUpload" })}
              </td>
              <td>: {inboxDetail?.dateOfUpload}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.FileName" })}
              </td>
              <td>: {inboxDetail?.archiveTitle}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="separator border-white mt-3"></div>
    </div>
  );
};

export { BookingAddModalHeader };
