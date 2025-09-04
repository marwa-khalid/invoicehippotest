import { useIntl } from "react-intl";
import { KTSVG } from "../../../../../_metronic/helpers";
import Select from "react-select";
import ReactQuill from "react-quill-new";

interface props {
  setSubjectModalOpen: (type: boolean) => void;
  selectedSubject: any;
  handleTempInputChange: (key: string, value: any) => void;
  ledgers: any;
  handleQuillChange: (key: string, content: string) => void;
  handleSave: () => void;
}

const SubjectDetailModal = ({
  setSubjectModalOpen,
  selectedSubject,
  handleTempInputChange,
  ledgers,
  handleQuillChange,
  handleSave,
}: props) => {
  const intl = useIntl();

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog" style={{ minWidth: "600px" }}>
        <div className="modal-content">
          <div className="modal-header bg-dark d-flex justify-content-between">
            <h5 className="modal-title text-white">
              {intl.formatMessage({
                id: "Fields.ModalEditTitleBudgetTopic",
              })}
            </h5>
            <div
              className="btn btn-icon btn-sm ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setSubjectModalOpen(false)}
            >
              <KTSVG
                path="media/icons/duotune/arrows/arr061.svg"
                className="svg-icon svg-icon-2x text-white"
              />
            </div>
          </div>

          <div className="modal-body">
            {/* Title */}
            <div className="mb-5">
              <label className="required fw-bold mb-3" htmlFor="title">
                {intl.formatMessage({ id: "Fields.Title" })}
              </label>
              <input
                type="text"
                id="title"
                value={selectedSubject?.title || ""}
                onChange={(e) => handleTempInputChange("title", e.target.value)}
                className="form-control form-control-white"
                placeholder={intl.formatMessage({ id: "Fields.Title" })}
              />
            </div>

            {/* Related Ledgers */}
            <div className="mb-5">
              <label className="fw-bold mb-3" htmlFor="linkedLedgers">
                {intl.formatMessage({ id: "Fields.LinkedLedgerAccounts" })}
              </label>
              <Select
                isMulti
                options={ledgers}
                inputId="linkedLedgers"
                value={ledgers
                  .flatMap((g: any) => g.options)
                  .filter((o: any) =>
                    selectedSubject?.relatedLedgerAccounts?.includes(o?.value)
                  )}
                onChange={(selected: any) => {
                  if (selected && selected.length > 5) {
                    // keep only the first 5 selections
                    selected = selected.slice(0, 5);
                  }
                  handleTempInputChange(
                    "relatedLedgerAccounts",
                    selected ? selected.map((s: any) => s.value) : []
                  );
                }}
              />
              {selectedSubject.relatedLedgerAccounts.length === 5 && (
                <div className="fv-plugins-message-container text-end mt-2">
                  <div className="text-warning">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({
                          id: "Fields.LinkedLedgerAccountsComments",
                        }),
                      }}
                      role="alert"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rich text editor */}
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
                <div className="row d-flex mb-10">
                  <ReactQuill
                    theme="snow"
                    id="description"
                    placeholder="Jouw tekst hier..."
                    style={{ height: "200px" }}
                    onChange={(content) =>
                      handleQuillChange("description", content)
                    }
                    value={selectedSubject?.description || ""}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => setSubjectModalOpen(false)}
            >
              {intl.formatMessage({
                id: "Fields.ActionClose",
              })}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!selectedSubject.title}
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

export { SubjectDetailModal };
