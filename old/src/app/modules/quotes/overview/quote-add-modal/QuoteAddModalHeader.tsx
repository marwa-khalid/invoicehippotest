import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getStatusClass } from "../../../../utils/statusUtils";
import { QuotePostResult } from "../core/_models";
import { getEnumOptions } from "../../../../helpers/intlHelper";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<QuotePostResult>;
  editModalId: number;
}

const QuoteAddModalHeader = ({
  setAddModalOpen,
  formik,
  editModalId,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div>
          <span className="text-secondary">
            {editModalId != 0
              ? intl
                  .formatMessage({
                    id: "Fields.PageQuoteDetailTitleEdit",
                  })
                  .replace("{0}", formik.values.title)
              : intl.formatMessage({
                  id: "Fields.PageQuoteDetailTitleNew",
                })}
          </span>
          <h2 className="fw-bold text-white">
            {editModalId != 0
              ? intl.formatMessage({
                  id: "Fields.PageQuoteDetailSubTitleEdit",
                })
              : intl.formatMessage({
                  id: "Fields.PageQuoteDetailSubTitleNew",
                })}
          </h2>

          {/* {formik.values.status === 1 ? (
            <span className="text-white">Concept</span>
          ) : null} */}
        </div>

        {/* Close Button */}
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          onClick={() => setAddModalOpen(false)}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-2x text-white mt-2" />
        </div>
      </div>

      {/* Ribbon at the right end of the header */}

      <div className="ribbon ribbon-end position-absolute top-20 end-0 w-300px">
        <div
          className={`ribbon-label fw-bold ${getStatusClass(
            formik.values.status
          )}`}
        >
          <small
            className={`${getStatusClass(formik.values.status)} rounded p-0 ${
              formik.values.status === 1 ? "text-dark" : "text-white"
            } fw-bold `}
          >
            {
              getEnumOptions(enums.QuoteStatusTypes, intl).find(
                (status) => status.value === formik.values.status
              )?.label
            }
          </small>
        </div>
      </div>

      <div className="separator border-white mt-3"></div>
    </div>
  );
};

export { QuoteAddModalHeader };
