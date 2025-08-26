import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "quill/dist/quill.snow.css";
import Flatpickr from "react-flatpickr";
import { ClientAddModal } from "../../../../client/client-search/client-add-modal/ClientAddModal";
import { ClientSearch } from "../../../../generic/ClientSearch";
import { ClientAddButtons } from "../../../../generic/ClientAddButtons";
import { BookingPostResult } from "../core/_models";
import ReactQuill from "react-quill-new";

type Props = {
  formik: FormikProps<BookingPostResult>;
  refresh: boolean;
  setRefresh: (type: boolean) => void;
};

const BookingAddStep1: FC<Props> = ({ formik, refresh, setRefresh }) => {
  const intl = useIntl();
  const [clientModal, setClientModalOpen] = useState<boolean>(false);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [clientSearch, setClientSearch] = useState<any>();

  const openClientModal = () => {
    setEditModalId(formik.values.header.clientId);
    setClientModalOpen(true);
  };
  const handleQuillChange1 = (content: string) => {
    formik.setFieldValue("comments", content); // Set statement number in formik
  };
  const openClientModalInNewMode = () => {
    setEditModalId(0);
    setClientModalOpen(true);
  };
  useEffect(() => {
    const updateClient = async () => {
      const clientResponse = JSON.parse(
        localStorage.getItem("clientResponse")!
      );
      if (clientResponse !== null) {
        formik.setFieldValue("header.clientId", clientResponse.id);

        formik.setFieldValue(
          "header.clientDisplayName",
          clientResponse.customerNr + " - " + clientResponse.businessName
        );
      }
    };
    updateClient();
  }, [clientModal, clientSearch]);
  const reset = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    formik.setFieldValue("header.clientDisplayName", "");
    formik.setFieldValue("header.clientId", 0);
  };

  const handleClose = () => {
    setClientSearch(false);
  };

  return (
    <>
      <div className="modal-body" id="#kt_tab_pane_4">
        <form className="form p-4" noValidate>
          <div className="row d-flex mb-5">
            <div className="col-5">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.BookingDate" })}
              </label>
              <div
                className="input-group"
                id="kt_td_picker_date_only"
                data-td-target-input="nearest"
                data-td-target-toggle="nearest"
              >
                <Flatpickr
                  value={
                    formik.values.header.bookingDate
                      ? new Date(formik.values.header.bookingDate)
                      : ""
                  }
                  onChange={(date: Date[]) =>
                    formik.setFieldValue(
                      "header.bookingDate",
                      date[0].toISOString()
                    )
                  }
                  options={{
                    weekNumbers: true,
                    dateFormat: "d-m-Y",
                    allowInput: true,
                  }}
                  className="form-control"
                  placeholder="dd-MM-yyyy"
                />

                <span
                  className="input-group-text"
                  data-td-target="#kt_td_picker_date_only"
                  data-td-toggle="datetimepicker"
                >
                  <i className="ki-duotone ki-calendar fs-2 text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
              </div>
              {formik.touched.header?.bookingDate &&
                formik.errors.header?.bookingDate && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.header?.bookingDate,
                        }}
                        role="alert"
                      />
                    </div>
                  </div>
                )}
            </div>
            <div className="col-7">
              {/* Label for the first field */}
              <label className="fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.Client" })}
              </label>

              <ClientAddButtons
                clientDisplayName={formik.values.header.clientDisplayName}
                openClientModal={openClientModal}
                openClientModalInNewMode={openClientModalInNewMode}
                reset={reset}
                setClientSearch={setClientSearch}
                type="modal"
              />
            </div>
          </div>

          <div className="">
            <label className="required fw-bold fs-6 mb-3">
              {intl.formatMessage({ id: "Fields.BookingDescription" })}
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Jouw tekst hier..."
              {...formik.getFieldProps("title")}
              value={formik.values.title || ""}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.title,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="separator my-8"></div>

          <div className="mb-5">
            <label className="fw-bold fs-6 mb-3">
              {intl.formatMessage({ id: "Fields.PrivateComments" })}
            </label>
            <ReactQuill
              theme="snow"
              placeholder="Jouw tekst hier..."
              style={{ height: "130px" }}
              onChange={handleQuillChange1}
              value={formik.values.comments}
            />
          </div>
        </form>
        {clientModal && (
          <ClientAddModal
            setEditModalId={setEditModalId}
            setAddModalOpen={setClientModalOpen}
            editModalId={editModalId}
          />
        )}
        {clientSearch && (
          <ClientSearch
            handleClose={handleClose}
            formik={formik}
            storageName="storedClient"
          />
        )}
      </div>
    </>
  );
};

export { BookingAddStep1 };
