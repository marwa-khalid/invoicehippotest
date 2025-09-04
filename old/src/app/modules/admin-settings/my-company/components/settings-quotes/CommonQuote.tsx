import { useState, FC, useRef } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "../../../../auth";
import { KTIcon } from "../../../../../../_metronic/helpers";

interface Props {
  setModalOpen: (type: boolean) => void;
}

const CommonQuote = ({ setModalOpen }: Props) => {
  const [loading, setLoading] = useState(false);

  const intl = useIntl();
  const { currentUser } = useAuth();

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered mw-700px">
          <div className="modal-content">
            <div className="modal-header bg-primary d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center w-100">
                <h3 className="fw-bolder m-0 text-white">
                  {intl.formatMessage({ id: "Fields.TabCommon" })}
                </h3>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={() => setModalOpen(false)}
                  style={{ cursor: "pointer" }}
                >
                  <KTIcon iconName="cross" className="fs-2x text-white mt-2" />
                </div>
              </div>
            </div>
            <div className="modal-body p-10">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  {intl.formatMessage({ id: "Fields.AnnualStartIndex" })}
                </label>
                <div className="col-lg-8">
                  <div className="mb-4">
                    <input
                      type="number"
                      className="form-control form-control-lg form-control-solid"
                      placeholder={intl.formatMessage({
                        id: "Fields.AnnualStartIndex",
                      })}
                      value={currentUser?.result.activeCompany.title}
                    />
                  </div>
                  <span
                    className="text-muted"
                    dangerouslySetInnerHTML={{
                      __html: intl.formatMessage({
                        id: "Fields.AnnualStartIndexInfo",
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  {intl.formatMessage({ id: "Fields.QuoteNrFormatLabel" })}
                </label>

                <div className="col-lg-8 fv-row">
                  <div
                    className="d-flex info-container p-5 mt-4"
                    style={{ backgroundColor: "#e0f0ff" }}
                  >
                    <div className="col-1 me-5 align-items-center">
                      <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>
                    <div className="col-10 text-primary">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: intl.formatMessage({
                            id: "Fields.QuoteNrFormatInfo",
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="">
                    {/* {intl.formatMessage({ id: "Fields.BtwNr" })} */}
                    offertenummer
                  </span>
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid mb-5"
                    placeholder="offertenummer"
                    // {intl.formatMessage({ id: "Fields.BtwNr" })}
                    value={currentUser?.result.activeCompany.vatNr}
                  />

                  {/* {formik.touched.contactPhone && formik.errors.contactPhone && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formik.errors.contactPhone}
                  </div>
                </div>
              )} */}
                </div>
              </div>

              <div className="separator my-10"></div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  {intl.formatMessage({
                    id: "Fields.GeneratedFileNameFormatInfoLabel",
                  })}
                </label>

                <div className="col-lg-8 fv-row">
                  <div
                    className="d-flex info-container p-5 mt-4"
                    style={{ backgroundColor: "#e0f0ff" }}
                  >
                    <div className="col-1 me-5 align-items-center">
                      <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>
                    <div className="col-10 text-primary">
                      <span
                      // dangerouslySetInnerHTML={{
                      //   __html: intl.formatMessage({
                      //     id: "Fields.GeneratedFileNameFormatInfoLabel",
                      //   }),
                      // }}
                      >
                        Bepaal hier het format van de bestandsnamen van jouw
                        offertes. Hieronder zie je een voorbeeld en wat de
                        mogelijkheden zijn. Bijvoorbeeld: offerte_%offertenr%
                        wordt offerte_O2016-0001.pdf Placeholders: %offertenr% =
                        offertenummer %datumvandaag% = dag van downloaden
                        %tijdvandaag% = tijdstip van downloaden %offertedatum% =
                        datum van de offerte %klant% = bedrijfsnaam klant
                        %klantnr% = klantnummer %jaar% = huidig jaar van
                        downloaden
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="">
                    {intl.formatMessage({
                      id: "Fields.GeneratedFileNameFormat",
                    })}
                  </span>
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid mb-5"
                    placeholder={intl.formatMessage({
                      id: "Fields.GeneratedFileNameFormat",
                    })}
                    value={currentUser?.result.activeCompany.vatNr}
                  />

                  {/* {formik.touched.contactPhone && formik.errors.contactPhone && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formik.errors.contactPhone}
                  </div>
                </div>
              )} */}
                </div>
              </div>
            </div>

            <div className="modal-footer flex-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {!loading && "Save Changes"}
                {loading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...{" "}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { CommonQuote };
