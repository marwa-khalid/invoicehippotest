const CustomAlertModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ display: "block" }}
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content w-450px">
          <div className="modal-body bg-light-warning">
            <div className="alert alert-dismissible bg-light-warning d-flex flex-center flex-column ">
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>

              <span className="svg-icon svg-icon-5tx svg-icon-warning mb-5">
                <i className="ki-duotone ki-information-3 text-warning fs-3x">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
              </span>

              <div className="text-center">
                <div className="separator separator-dashed border-warning opacity-25 mb-5"></div>

                <div className="mb-5">
                  Please complete <strong>Step 1: Client Settings</strong> in
                  order to proceed to the next step.
                </div>
                <div className="d-flex flex-center flex-wrap">
                  <a href="#" className="btn btn-warning" onClick={onClose}>
                    Ok, I got it
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CustomAlertModal };
