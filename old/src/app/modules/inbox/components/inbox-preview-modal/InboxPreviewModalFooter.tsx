import { useIntl } from "react-intl";


interface ComponentProps {
  setActivateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  
}
const InboxPreviewModalFooter = ({
  setActivateModalOpen,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();

 
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setActivateModalOpen(false);
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

       
      </div>
    </div>
  );
};

export { InboxPreviewModalFooter };
