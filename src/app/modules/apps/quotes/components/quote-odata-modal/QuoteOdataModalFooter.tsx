import { useState } from "react";
import { useIntl } from "react-intl";
import { createCopy } from "../core/_requests";

import { handleToast } from "../../../../auth/core/_toast";

interface ComponentProps {
  setOdataModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  odataUrl: string;
}

const QuoteOdataModalFooter = ({
  setOdataModalOpen,
  setRefresh,
  refresh,
  odataUrl,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();

  // const copyModal = async () => {
  //   setIsSubmitting(true);
  //   const response = await createCopy(quoteId, copyAttachments);
  //   if (response.isValid) {
  //     setRefresh(!refresh);
  //     setCopyModalOpen(false);
  //     setIsSubmitting(false);
  //   }
  //   handleToast(response);
  //   setIsSubmitting(false);
  // };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => setOdataModalOpen(false)}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-info"
          onClick={() => window.open(odataUrl, "_blank")}
        >
          Open Link in New tab
        </button>
      </div>
    </div>
  );
};

export { QuoteOdataModalFooter };
