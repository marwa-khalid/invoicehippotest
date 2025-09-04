import { FormikProps } from "formik";
import { QuotePostResult } from "../core/_models";
import { useIntl } from "react-intl";
import { KTSVG } from "../../../../../_metronic/helpers";
import Select from "react-select";
interface props {
  formik: FormikProps<QuotePostResult>;
  setExtraOptionsModal: (type: boolean) => void;
  companyTradeNames: any;
  notificationCycles:any
}

const ExtraOptionsModal = ({
  formik,
  setExtraOptionsModal,
  companyTradeNames,
  notificationCycles,
}: props) => {
  const intl = useIntl();
  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="additional_add_modal"
        aria-modal="true"
      >
        <div className="modal-dialog" style={{ minWidth: "600px" }}>
          <div className="modal-content">
            <div className="modal-header bg-primary d-flex justify-content-between">
              <h5 className="modal-title text-white">
                {intl.formatMessage({
                  id: "Fields.ActionExtraOptions",
                })}
              </h5>

              <div
                className="btn btn-icon btn-sm  ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setExtraOptionsModal(false)}
              >
                <KTSVG
                  path="media/icons/duotune/arrows/arr061.svg"
                  className="svg-icon svg-icon-2x text-white"
                />
              </div>
            </div>
            <div className="modal-body">
              {formik.values.status === 1 && (
                <>
                  <div className="row d-flex mb-7 mt-3">
                    <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                      <input
                        className="form-check-input h-20px w-40px me-5"
                        type="checkbox"
                        id="customNrSwitch"
                        checked={formik.values.customizations.useCustomQuoteNr}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "customizations.useCustomQuoteNr",
                            !formik.values.customizations.useCustomQuoteNr
                          );
                        }}
                      />
                      <label
                        className="form-check-label fs-sm text-muted"
                        htmlFor="customNrSwitch"
                      >
                        {intl.formatMessage({
                          id: "Fields.UseCustomQuoteNr",
                        })}
                      </label>
                    </div>
                    {formik.values.customizations.useCustomQuoteNr && (
                      <>
                        <div className="col-1"></div>
                        <div className="mt-5 col-5">
                          <label className="required fw-bold fs-6 mb-3">
                            {intl.formatMessage({
                              id: "Fields.CustomQuoteNr",
                            })}
                          </label>
                          <input
                            type="text"
                            maxLength={20}
                            className="form-control form-control-solid"
                            value={formik.values.customizations.customQuoteNr}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "customizations.customQuoteNr",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                        <div className="mt-5 col-5">
                          <label className="required fw-bold fs-6 mb-3">
                            {/* {intl.formatMessage({
                                            id: "Fields.CustomOrderNr",
                                          })} */}
                            custom order nr
                          </label>
                          <input
                            type="text"
                            maxLength={20}
                            className="form-control form-control-solid"
                            value={formik.values.customizations.customOrderNr}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "customizations.customOrderNr",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-bottom w-100 mt-10 mb-7"></div>
                </>
              )}
              <div className="row d-flex mb-7 mt-3">
                <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                  <input
                    className="form-check-input h-20px w-40px me-5"
                    type="checkbox"
                    id="hideProductCodesSwitch"
                    checked={formik.values.customizations.hideProductCodes}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "customizations.hideProductCodes",
                        !formik.values.customizations.hideProductCodes
                      );
                    }}
                  />

                  <label
                    className="form-check-label  fs-sm text-muted"
                    htmlFor="hideProductCodesSwitch"
                  >
                    {intl.formatMessage({
                      id: "Fields.HideProductCodes",
                    })}
                  </label>
                </div>
              </div>
              <div className="border-bottom w-100 mt-10 mb-10"></div>
              <div className="d-flex info-container p-5 bg-secondary alert">
                <div className="col-1 mx-5">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <div className="col-10">
                  {intl.formatMessage({
                    id: "Fields.CompanyTradeNameInfo",
                  })}
                </div>
              </div>

              <div className="row d-flex mt-7">
                <div className="fv-row">
                  <label className="fw-bold fs-6 mb-3">
                    {intl.formatMessage({
                      id: "Fields.CompanyTradeNameId",
                    })}
                  </label>
                  <Select
                    value={companyTradeNames?.find(
                      (company: any) =>
                        company.value ===
                        formik.values.header.companyTradeNameId
                    )}
                    className="react-select-styled"
                    options={companyTradeNames}
                    onChange={(e: any) =>
                      formik.setFieldValue(
                        "header.companyTradeNameId",
                        e?.value || null
                      )
                    }
                    placeholder={intl.formatMessage({
                      id: "Fields.CompanyTradeNameId",
                    })}
                    isClearable
                  />
                </div>
              </div>
              <div className="border-bottom w-100 mt-10 mb-10"></div>
              <div className="row d-flex mb-7">
                <div className="fv-row">
                  <label className="required fw-bold fs-6 mb-3">
                    {intl.formatMessage({
                      id: "Fields.NotificationCycle",
                    })}
                  </label>
                  <Select
                    value={notificationCycles?.find((ledger: any) => {
                      return (
                        ledger.value ===
                        formik.values.customizations.notificationCycleId
                      );
                    })}
                    className="react-select-styled"
                    options={notificationCycles}
                    onChange={(e: any) =>
                      formik.setFieldValue(
                        "customizations.notificationCycleId",
                        e?.value || null
                      )
                    }
                    placeholder={intl.formatMessage({
                      id: "Fields.NotificationCycle",
                    })}
                  />
                </div>
              </div>
              <div className="border-bottom w-100 mt-10 mb-10"></div>
              <div className="row d-flex mb-7">
                <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                  <input
                    className="form-check-input h-20px w-40px me-5"
                    type="checkbox"
                    id="dontSendRemindersOnlyTrackStatusSwitch"
                    checked={
                      formik.values.customizations
                        .dontSendRemindersOnlyTrackStatus
                    }
                    onChange={(e) => {
                      formik.setFieldValue(
                        "customizations.dontSendRemindersOnlyTrackStatus",
                        !formik.values.customizations
                          .dontSendRemindersOnlyTrackStatus
                      );
                    }}
                  />
                  <label
                    className="form-check-label fs-sm text-muted"
                    htmlFor="dontSendRemindersOnlyTrackStatusSwitch"
                  >
                    {intl.formatMessage({
                      id: "Fields.DontSendRemindersOnlyTrackStatus",
                    })}
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setExtraOptionsModal(false);
                }}
              >
                {intl.formatMessage({
                  id: "Fields.ActionClose",
                })}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setExtraOptionsModal(false);
                }}
              >
                {intl.formatMessage({
                  id: "Fields.FilterApplyBtn",
                })}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { ExtraOptionsModal };
