import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import { useIntl } from "react-intl";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { getChaimberInitialData, searchChaimber } from "../core/_requests";
import { FormikProps } from "formik";
import { FormValues } from "./ClientAddStep1";
type Props = {
  setModalOpen: (type: boolean) => void;
  formik: FormikProps<FormValues>;
};
const ChaimberModal = ({ setModalOpen, formik }: Props) => {
  const intl = useIntl();

  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chaimbers, setChaimbers] = useState<any[]>([]);
  const [counter, setCounter] = useState<boolean>(false);
  const avatarColors = [
    "bg-dark",
    "bg-warning",
    "bg-success",
    "bg-danger",
    "bg-primary",
    "bg-info",
    "bg-gray-500",
  ];

  useEffect(() => {
    const fetchChaimbers = async () => {
      const response = await searchChaimber(searchTerm);
      if (response.isValid) {
        setChaimbers(response.result);
      }
    };
    fetchChaimbers();
  }, [searchTerm, counter]);

  const handleSearchClick = () => {
    setSearchTerm(localSearchTerm);
    setCounter(!counter);
  };
  const fetchChaimberInitialData = async (nr: string) => {
    const response = await getChaimberInitialData(nr);
    if (response.isValid) {
      formik.setFieldValue("businessName", response.result.name);
      setModalOpen(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog mw-800px">
        <div className="modal-content">
          <div className="modal-header bg-dark">
            <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-0">
              <h2 className="fw-bolder mb-0 text-white">
                {intl.formatMessage({
                  id: "Fields.ActionClientSearchViaChaimberOfCommerce",
                })}
              </h2>
              <div
                className="btn btn-icon btn-sm btn-active-icon-primary"
                onClick={() => setModalOpen(false)}
                style={{ cursor: "pointer" }}
              >
                <KTIcon iconName="cross" className="fs-1 text-white" />
              </div>
            </div>
          </div>
          <div className="modal-body">
            {/* <div
                  className="w-full mb-20 p-10 rounded"
                  style={{ backgroundColor: "#32388e" }}
                > */}
            {/* Full-width search input */}
            <div className="d-flex align-items-center position-relative mb-10 gap-2 ">
              <KTIcon
                iconName="magnifier"
                className="fs-3 position-absolute ms-6"
              />

              <input
                type="text"
                data-kt-user-table-filter="search"
                className="form-control form-control-solid w-100 ps-14 rounded-lg me-6"
                placeholder={intl.formatMessage({
                  id: "Fields.SearchTerm",
                })}
                value={localSearchTerm}
                onChange={(e) => {
                  e.preventDefault();
                  setLocalSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchClick();
                  }
                }}
              />
              <div className="btn-group">
                <button
                  className="btn btn-dark d-inline-flex align-items-center"
                  onClick={handleSearchClick}
                >
                  <i className="la la-search fs-2"></i>
                  <span className="ms-1">
                    {intl.formatMessage({ id: "Fields.SearchBtn" })}
                  </span>
                </button>

                <button
                  className="btn btn-secondary btn-icon"
                  onClick={() => {
                    setSearchTerm("");
                    setLocalSearchTerm("");
                  }}
                >
                  <i className="la la-remove fs-3"></i>
                </button>
              </div>
            </div>

            <div className="text-center">
              {chaimbers.length > 0 ? (
                chaimbers.map((chaimber) => {
                  // Extract initials from the company name
                  const initials = chaimber.name
                    .split(" ")
                    .map((word: any) => word.charAt(0))
                    .join("")
                    .toUpperCase();

                  // Pick a color based on the listIndex (cyclic pattern)
                  const avatarColor =
                    avatarColors[chaimber.listIndex % avatarColors.length];

                  return (
                    <div key={chaimber.listIndex}>
                      <div className="row align-items-center justify-content-between mb-3">
                        {/* Avatar and Name/Address together */}
                        <div className="col d-flex align-items-center">
                          {/* Avatar with initials */}

                          {/* <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  // checked={deleteModalId?.includes(unitType.id)}
                                  // onChange={() =>
                                  //   toggleRowSelection(unitType.id)
                                  // }
                                />
                              </div> */}

                          <div
                            className={`avatar rounded-circle d-flex justify-content-center align-items-center me-3 ${avatarColor}`}
                            style={{
                              width: "50px",
                              height: "50px",
                              fontSize: "15px",
                              color: "#fff",
                            }}
                          >
                            {initials}
                          </div>

                          {/* Name and address */}
                          <div className="text-start">
                            <h5 className="mb-0">{chaimber.name}</h5>
                            <small className="text-muted">
                              {chaimber.address.fullAddressAsInline}
                            </small>
                          </div>
                        </div>

                        {/* Reference number (KVK number) at the very end */}
                        <div className="col-auto">
                          <div
                            className="kvk-nr text-muted rounded px-3 py-1"
                            style={{
                              backgroundColor: "#f0f0f0",
                            }}
                          >
                            {intl.formatMessage({ id: "Fields.KvkNr" })}{" "}
                            {chaimber.chaimberOfCommerceNr}
                          </div>
                        </div>

                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ToolTipEdit",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-primary btn-sm me-2"
                            onClick={() =>
                              fetchChaimberInitialData(
                                chaimber.chaimberOfCommerceNr
                              )
                            }
                          >
                            <i className="ki-duotone ki-fasten text-white fs-1">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                          </button>
                        </Tippy>
                      </div>

                      {/* Dotted divider under every row */}
                      <hr
                        className="my-5"
                        style={{ borderTop: "1px dotted #808080" }}
                      />
                    </div>
                  );
                })
              ) : (
                <>
                  <img
                    alt=""
                    src={toAbsoluteUrl("media/logos/searchnotfound.png")}
                    className="h-250px w-350px"
                  />
                  <h4>
                    {intl.formatMessage({
                      id: "Fields.SearchNoItemsAvailableDefault",
                    })}
                  </h4>
                </>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              {intl.formatMessage({ id: "Fields.ActionClose" })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ChaimberModal };
