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
              {/* {intl.formatMessage({
                id: "Fields.ModalTitleEditUpdateSubject",
              })} */}
              Edit Subject
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
            {/* Toggle Switch */}
            {/* <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-3">
              <h2 className="required fw-bold fs-6">
                {intl.formatMessage({
                  id: "Fields.Subjects",
                })}
                
              </h2>
              <div className="form-check form-switch mt-1 d-flex align-items-center">
                <label
                  className="form-check-label me-20 fs-sm text-muted"
                  htmlFor="isBtwExclusiveSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.BtwExclusive",
                  })}
                </label>
                <input
                  className="form-check-input h-20px w-40px"
                  type="checkbox"
                  id="isBtwExclusiveSwitch"
                  checked={selectedSubject?.btwExclusive || false}
                  onChange={(e) =>
                    handleTempInputChange("btwExclusive", e.target.checked)
                  }
                />
              </div>
            </div> */}

            {/* Title */}
            <div className="mb-3">
              <label className="fw-bold mb-2">Title</label>
              <input
                type="text"
                value={selectedSubject?.title || ""}
                onChange={(e) => handleTempInputChange("title", e.target.value)}
                className="form-control form-control-white"
              />
            </div>

            {/* Description (short) */}
            {/* <div className="mb-3">
              <label className="fw-bold mb-2">Description</label>
              <input
                type="text"
                value={selectedSubject?.description || ""}
                onChange={(e) =>
                  handleTempInputChange("description", e.target.value)
                }
                className="form-control form-control-white"
              />
            </div> */}

            {/* Related Ledgers */}
            <div className="mb-3">
              <label className="fw-bold mb-2">Related Ledgers</label>
              <Select
                isMulti
                options={ledgers}
                value={ledgers
                  .flatMap((g: any) => g.options)
                  .filter((o: any) =>
                    selectedSubject?.relatedLedgerAccounts?.includes(o?.value)
                  )}
                onChange={(selected: any) =>
                  handleTempInputChange(
                    "relatedLedgerAccounts",
                    selected ? selected.map((s: any) => s.value) : []
                  )
                }
              />
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
                <div className="row d-flex mb-5">
                  <ReactQuill
                    theme="snow"
                    id="description"
                    placeholder="Jouw tekst hier..."
                    style={{ height: "300px" }}
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
