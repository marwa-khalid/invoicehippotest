import { Content } from "../../../../../../_metronic/layout/components/content";
import { ToolbarWrapper } from "../../../../../../_metronic/layout/components/toolbar";
import { useIntl } from "react-intl";
import { useAuth } from "../../../../auth";
import Select from "react-select";
import Flatpickr from "react-flatpickr";

const AddQuotePage = () => {
  const intl = useIntl();
  const auth = useAuth();
  console.log(auth);
  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* Info Container */}
        <div
          className="row d-flex info-container p-3 rounded"
          style={{ backgroundColor: "#FFF4DE" }}
        >
          <div className="col-1">
            <i className="ki-duotone ki-information-4 fs-3x text-center text-warning">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </div>
          <div className="col-10 text-warning fw-bold">
            Tijdens het bewerken van een concept offerte wordt er een tijdelijk
            offertenummer toegekend. Dit nummer wordt automatisch aangepast naar
            een definitief offertenummer bij het activeren of versturen van de
            offerte.
          </div>
        </div>
        {/* main Container */}
        <div className="Body px-20 mt-10">
          <div className="d-flex mainContainer justify-content-between">
            <div className="left details text-muted">
              {intl.formatMessage({
                id: "Fields.PageQuoteDetailSubTitleNew",
              })}
              <h1 className="receiptNo fw-bold fs-2x">
                {intl.formatMessage({
                  id: "Fields.PageQuoteDetailTitleNew",
                })}
              </h1>
              <span className="bg-secondary">Concept</span>
            </div>

            <div className="rightDetails p-2 d-flex flex-column">
              <img
                className="h-90px w-120px"
                src="/media/logos/NoesteIJver-logo-RGB.png"
              />
              <span
                className="text-muted text-end mt-3"
                dangerouslySetInnerHTML={{
                  __html:
                    auth?.currentUser?.result?.activeCompany?.addressAsHtml ||
                    "",
                }}
              />
            </div>
          </div>
          <div className="separator border-2 my-10"></div>

          {/* Button */}
          <div className="text-end">
            <button className="btn btn-primary ">
              <i className="ki-solid ki-gear fs-2x" />
              {intl.formatMessage({
                id: "Fields.ActionExtraOptions",
              })}
            </button>
          </div>

          {/* secondContainer */}
          <div className="row d-flex mb-4">
            <div className="col-4">
              <label className="required fw-bold fs-6">
                {intl.formatMessage({ id: "Fields.QuoteDate" })}
              </label>
              <Flatpickr
                options={{
                  weekNumbers: true,
                  dateFormat: "d-m-Y",
                }}
                className="form-control"
                placeholder="dd-MM-yyyy"
              />
            </div>
            <div className="col-6">
              <label className="required fw-bold fs-6">
                {intl.formatMessage({ id: "Fields.DeadLineForAcceptanceDays" })}
              </label>
              <Select
                className="react-select-styled"
                placeholder="30"
                options={Array.from({ length: 89 }, (_, index) => {
                  const value = index + 2;
                  return { value, label: value.toString() };
                })}
              />
            </div>
          </div>

          <div className="row d-flex mb-4">
            <div className="col-5">
              <label className="required fw-bold fs-6">klant</label>
              <div className="btn-group  ">
                <button className="btn btn-primary d-inline-flex align-items-center">
                  <i className="la la-search fs-2"></i>
                  <span className="ms-1">
                    {intl.formatMessage({
                      id: "Fields.ActionPickerAddNewClient",
                    })}
                  </span>
                </button>
                <button className="btn btn-secondary btn-icon">
                  <i className="la la-search fs-3"></i>
                </button>
                <button className="btn btn-warning btn-icon">
                  <i className="la la-search-plus fs-3"></i>
                </button>
              </div>
            </div>
            <div className="col-5">
              <label className="required fw-bold fs-6">
                {intl.formatMessage({ id: "Fields.ClientReferenceNr" })}
              </label>
              <input
                type="text"
                className="form-control form-control-white mx-3"
                placeholder="Enter"
              />
            </div>
          </div>
          <div className="separator border-2 my-10"></div>
        </div>
      </Content>
    </>
  );
};
export default AddQuotePage;
