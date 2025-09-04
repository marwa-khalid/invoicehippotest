import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "quill/dist/quill.snow.css";
import { TemplatePost } from "../core/_models";
import { ClientAddButtons } from "../../../generic/ClientAddButtons";
import { SubscriberPicker } from "../../../generic/SubscriberPicker";
import Tippy from "@tippyjs/react";
import { KTSVG, toAbsoluteUrl } from "../../../../../_metronic/helpers";
type Props = {
  formik: FormikProps<TemplatePost>;
  setInfo: (type: string) => void;
  setAttachmentsModalOpen: (type: boolean) => void;
  setType: (type: any) => void;
};
const TemplateAddStep1: FC<Props> = ({
  formik,
  setInfo,
  setAttachmentsModalOpen,
  setType,
}) => {
  const intl = useIntl();

  const reset = () => {
    localStorage.removeItem("subscriberResponse");
    formik.setFieldValue("ownerSubscriberId", 0);
    formik.setFieldValue("owner.fullName", "");
    formik.setFieldValue("owner.id", 0);
  };
  const [subscriberPicker, setSubscriberPicker] = useState<any>();

  const openSubscriberPicker = () => {
    setSubscriberPicker(true);
  };
  useEffect(() => {
    const subscriberResponse = JSON.parse(
      localStorage.getItem("subscriberResponse")!
    );

    if (subscriberResponse != null) {
      formik.setFieldValue("ownerSubscriberId", subscriberResponse.id);
      formik.setFieldValue("owner.id", subscriberResponse.id);
      formik.setFieldValue("owner.fullName", subscriberResponse.billingContact);
    }
  }, [subscriberPicker]);

  return (
    <div className="modal-body">
      <form className="form p-4" noValidate>
        <div className="row d-flex mb-5 align-items-top">
          <div className="d-flex flex-column col-6">
            <div>
              <label className="required fw-bold fs-6 mb-3" htmlFor="title">
                {intl.formatMessage({ id: "Fields.Title" })}
              </label>
              <input
                id="title"
                className="form-control form-control-solid"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="fv-plugins-message-container mt-3 ms-1">
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
            <div className="separator my-10"></div>
            <div
              className="d-flex alert alert-custom alert-default bg-secondary align-items-center"
              role="alert"
            >
              <div className="alert-icon col-1 me-4">
                <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
              </div>
              <div className="alert-text col-10 d-flex flex-column">
                <span
                // dangerouslySetInnerHTML={{
                //   __html: intl.formatMessage({
                //     id: "Fields.ReplaceablePaymentOptionsInfo",
                //   }),
                // }}
                >
                  If you would like to make this template a custom template,
                  then please pick a subscriber owner
                </span>
              </div>
            </div>
            <div className="fv-row">
              <h2 className="fw-bold fs-6 mb-5">
                {intl.formatMessage({
                  id: "Fields.OwnerSubscriberId",
                })}
              </h2>
              <ClientAddButtons
                clientDisplayName={
                  formik.values.hasOwner ? formik.values.owner.fullName : ""
                }
                openClientModal={openSubscriberPicker}
                openClientModalInNewMode={openSubscriberPicker}
                reset={reset}
                setClientSearch={openSubscriberPicker}
                type="modalTemplate"
              />
            </div>
          </div>
          <div className="col-1 d-flex justify-content-center">
            <div
              style={{
                width: "1px",
                backgroundColor: "#ddd",
                height: "100%",
                minHeight: "70px",
              }}
            />
          </div>
          <div className="col-5 text-center">
            <h2 className="required fw-bold fs-6 mb-3">
              {intl.formatMessage({ id: "Fields.PreviewImageFileId" })}
            </h2>
            {formik.values.previewImageFileId ? (
              <img
                src={formik.values.previewImageFileUrl}
                alt="Logo"
                className="rounded"
                style={{
                  objectFit: "fill",
                  width: "250px",
                  height: "350px",
                  border: "1px solid #ddd",
                  padding: "5px",
                }}
              />
            ) : (
              <img
                src={toAbsoluteUrl("media/svg/brand-logos/office-building.svg")}
                alt="Default Logo"
                className="rounded"
                style={{
                  objectFit: "fill",
                  width: "250px",
                  height: "350px",
                  border: "1px solid #ddd",
                  padding: "5px",
                }}
              />
            )}
            <div className="d-flex gap-2 align-items-center justify-content-center text-center mt-2">
              {/* Pencil (Edit) Icon */}
              <Tippy
                content={intl.formatMessage({
                  id: "Fields.CompanyLogoInfo",
                })}
              >
                <div
                  // type="button"
                  // className="btn btn-icon btn-sm btn-light-primary"
                  className="cursor-pointer"
                  style={{ zIndex: 1 }}
                  onClick={() => {
                    setInfo("Fields.ImageUploadModuleInfo");
                    setAttachmentsModalOpen(true);
                    setType("templateImage");
                  }}
                >
                  {formik.values.previewImageFileId !== 0 ? (
                    <KTSVG
                      className="svg-icon svg-icon-1 cursor-pointer"
                      path="media/icons/hugeicons/pencil-edit.svg"
                    />
                  ) : (
                    <KTSVG
                      className="svg-icon svg-icon-2 cursor-pointer text-primary"
                      path="media/icons/duotune/general/gen035.svg"
                    />
                  )}
                </div>
              </Tippy>
              {formik.values.previewImageFileId > 0 && (
                <Tippy
                  content={intl.formatMessage({
                    id: "Fields.ToolTipDelete",
                  })}
                >
                  <div
                    // type="button"
                    className="cursor-pointer"
                    style={{ zIndex: 1 }}
                    onClick={() => {
                      formik.setFieldValue("previewImageFileId", 0);
                    }}
                  >
                    <KTSVG
                      className="svg-icon svg-icon-2 text-danger"
                      path="media/icons/duotune/general/gen034.svg"
                    />
                  </div>
                </Tippy>
              )}
            </div>
          </div>
        </div>
      </form>

      {subscriberPicker && (
        <SubscriberPicker
          handleClose={() => setSubscriberPicker(false)}
          formik={formik}
          storageName="subscriberResponse"
        />
      )}
    </div>
  );
};

export { TemplateAddStep1 };
