import { useIntl } from "react-intl";
import { KTIcon, KTSVG } from "../../../../../_metronic/helpers";
import Select from "react-select";
import ReactQuill from "react-quill-new";
import { useEffect } from "react";
interface props {
  setProductModalOpen: (type: boolean) => void;
  setDiscountAddModalOpen: (type: boolean) => void;
  setLedgerAddModalOpen: (type: boolean) => void;
  discountTypes: any;
  selectedProduct: any;
  handleTempInputChange: any;
  ledgers: any;
  handleQuillChange: any;
  handleSave: any;
  counter: boolean;
  setCounter: (type: boolean) => void;
  counter1: boolean;
  setCounter1: (type: boolean) => void;
}

const ProductDetailModal = ({
  setProductModalOpen,
  selectedProduct,
  handleTempInputChange,
  ledgers,
  setDiscountAddModalOpen,
  discountTypes,
  handleQuillChange,
  handleSave,
  setLedgerAddModalOpen,
  counter,
  setCounter,
  setCounter1,
  counter1,
}: props) => {
  const intl = useIntl();
  useEffect(() => {
    if (counter) {
      // find ledger with highest value
      const maxLedger = ledgers.reduce((prev: any, curr: any) =>
        curr.value > prev.value ? curr : prev
      );

      handleTempInputChange("ledgerAccountId", maxLedger.value);
      setCounter(false);
    }
  }, [ledgers]);
  useEffect(() => {
    if (counter1) {
      // find ledger with highest value
      const maxDiscount = discountTypes
        ?.map((item: any) => ({
          value: item.id,
          label: item.title,
        }))
        .reduce((prev: any, curr: any) =>
          curr.value > prev.value ? curr : prev
        );

      handleTempInputChange("discountMarginId", maxDiscount.value);
      setCounter1(false);
    }
  }, [discountTypes]);
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      id="additional_add_modal"
      aria-modal="true"
    >
      <div className="modal-dialog" style={{ minWidth: "600px" }}>
        <div className="modal-content">
          <div className="modal-header bg-dark d-flex justify-content-between">
            <h5 className="modal-title text-white">
              {intl.formatMessage({
                id: "Fields.ModalTitleEditUpdateProduct",
              })}
            </h5>
            <div
              className="btn btn-icon btn-sm ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setProductModalOpen(false)}
            >
              <KTSVG
                path="media/icons/duotune/arrows/arr061.svg"
                className="svg-icon svg-icon-2x text-white"
              />
            </div>
          </div>
          <div className="modal-body">
            <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-3">
              <label className="required fw-bold fs-6">
                {intl.formatMessage({
                  id: "Fields.Product",
                })}
              </label>
              <div className="form-check form-switch mt-1 d-flex align-items-center">
                <label
                  className="form-check-label me-20 fs-sm text-muted"
                  htmlFor="btwExclusiveSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.BtwExclusive",
                  })}
                </label>
                <input
                  className="form-check-input h-20px w-40px"
                  type="checkbox"
                  id="isBtwExclusiveSwitch"
                  checked={selectedProduct.btwExclusive}
                  onChange={(e) =>
                    handleTempInputChange("btwExclusive", e.target.checked)
                  }
                />
              </div>
            </div>
            <div className="row mb-5">
              <input
                type="text"
                onChange={(e) => handleTempInputChange("title", e.target.value)}
                value={selectedProduct.title || ""}
                className="form-control form-control-solid"
                placeholder={intl.formatMessage({
                  id: "Fields.Product",
                })}
              />
            </div>
            <div className="row d-flex mb-5">
              <div className="fv-row col-8">
                <div className="d-flex justify-content-between">
                  <p className="required fw-bold fs-6 mb-3">
                    {intl.formatMessage({
                      id: "Fields.LedgerAccount",
                    })}
                  </p>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setLedgerAddModalOpen(true);
                      setCounter(true);
                    }}
                  >
                    <KTIcon iconName="plus" className="fs-2 text-primary" />
                  </div>
                </div>
                <Select
                  value={ledgers?.find(
                    (ledger: any) =>
                      ledger.value === selectedProduct.ledgerAccountId
                  )}
                  className="react-select-styled"
                  options={ledgers}
                  onChange={(e) =>
                    handleTempInputChange("ledgerAccountId", e?.value)
                  }
                  placeholder={intl.formatMessage({
                    id: "Fields.LedgerAccount",
                  })}
                />
              </div>
              <div className="fv-row col-4">
                <div className="d-flex justify-content-between">
                  <span className="fw-bold fs-6 mb-3">
                    {intl.formatMessage({
                      id: "Fields.TotalDiscountSummary",
                    })}
                  </span>

                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setDiscountAddModalOpen(true);
                      setCounter1(true);
                    }}
                  >
                    <KTIcon iconName="plus" className="fs-2 text-primary" />
                  </div>
                </div>

                <Select
                  value={discountTypes
                    ?.map((item: any) => ({
                      value: item.id,
                      label: item.title,
                    }))
                    .find(
                      (discountType: any) =>
                        discountType.value === selectedProduct.discountMarginId
                    )}
                  className="react-select-styled"
                  options={discountTypes.map((item: any) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                  onChange={(e) =>
                    handleTempInputChange("discountMarginId", e?.value)
                  }
                  isClearable
                  placeholder={intl.formatMessage({
                    id: "Fields.TotalDiscountSummary",
                  })}
                />
              </div>
            </div>

            <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2xe mb-5 fs-6 align-items-center d-flex justify-content-start">
              <li className="nav-item">
                <a
                  className="nav-link active d-flex align-items-center justify-content-center"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_1"
                >
                  {intl.formatMessage({
                    id: "Fields.Description",
                  })}
                </a>
              </li>
            </ul>

            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="kt_tab_pane_1"
                role="tabpanel"
              >
                <div className="row d-flex mb-5">
                  <ReactQuill
                    theme="snow"
                    placeholder="Jouw tekst hier..."
                    style={{ height: "300px" }}
                    onChange={(content) =>
                      handleQuillChange("description", content)
                    }
                    value={selectedProduct.description || ""}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => setProductModalOpen(false)}
            >
              {intl.formatMessage({
                id: "Fields.ActionClose",
              })}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              {intl.formatMessage({
                id: "Fields.ActionSave",
              })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductDetailModal };
