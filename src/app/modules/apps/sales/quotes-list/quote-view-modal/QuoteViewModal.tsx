import { useEffect } from "react";

const QuoteViewModal = () => {
  return (
    <div
      className="offcanvas offcanvas-end w-50"
      tabIndex={-1}
      id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel"
    >
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel">02024-0005</h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body"></div>
    </div>

    //   {/* Modal backdrop to close the drawer when clicking outside */}
    //   {viewModalOpen && (
    //     <div
    //       className="modal-backdrop fade show"
    //       style={{ zIndex: 1040 }}
    //       onClick={() => setViewModalOpen(false)}
    //     />
    //   )}
  );
};

export { QuoteViewModal };
