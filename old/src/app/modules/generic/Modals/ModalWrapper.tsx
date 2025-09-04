// components/ModalWrapper.tsx
import React from "react";

const ModalWrapper = ({
  id,
  isOpen,
  onClose,
  maxWidth = "1024px",
  children,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        id={id}
        aria-modal="true"
        tabIndex={-1}
      >
        <div
          className="modal-dialog"
          style={{
            maxWidth: maxWidth,
            width: "100%",
          }}
        >
          <div className="modal-content">
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              aria-label="Close"
              onClick={onClose}
            ></button>
            {children}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default ModalWrapper;
