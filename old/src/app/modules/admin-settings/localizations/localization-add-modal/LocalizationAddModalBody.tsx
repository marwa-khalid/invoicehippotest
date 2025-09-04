import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import Select from "react-select";
import { LocalizationPost } from "../core/_models";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
type Props = {
  formik: FormikProps<LocalizationPost>;
  refresh: boolean;
  setRefresh: (type: boolean) => void;
};
const LANGUAGES = ["NL", "EN", "PL", "ES", "DE", "FR", "TR"];
const LocalizationAddModalBody: FC<Props> = ({
  formik,
  refresh,
  setRefresh,
}) => {
  const intl = useIntl();

  const handleQuillChange1 = (content: string) => {
    formik.setFieldValue("webTranslations.ContentNL", content); // Set statement number in formik
  };
  const handleQuillChange2 = (content: string) => {
    formik.setFieldValue("webTranslations.ContentEN", content); // Set statement number in formik
  };
  const [activeTab, setActiveTab] = useState("NL");

  return (
    <>
      <div className="modal-body" id="#kt_tab_pane_4">
        <form className="form p-4" noValidate>
          <div className="row d-flex mb-5">
            <div className="col-5">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.ColumnKey" })}
              </label>
              <input
                className="form-control form-control-solid"
                readOnly
                {...formik.getFieldProps("key")}
              />
            </div>
            <div className="col-7">
              <label className="fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.ModuleType" })}
              </label>
              <Select
                className="react-select-styled flex flex-wrap"
                // isClearable
                inputId="balanceType"
                menuPlacement="bottom"
                placeholder={intl.formatMessage({
                  id: "Fields.ModuleType",
                })}
                {...formik.getFieldProps("moduleType")}
                value={getEnumOptions(enums.LanguageModuleTypes, intl).find(
                  (option) => formik.values.moduleType === option.value
                )}
                options={getEnumOptions(enums.LanguageModuleTypes, intl)}
                isDisabled
              />
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2xe mb-5 fs-6 align-items-center d-flex justify-content-start">
            {LANGUAGES.map((langCode) => (
              <li className="nav-item" key={langCode}>
                <a
                  className={`nav-link d-flex align-items-center justify-content-center cursor-pointer ${
                    activeTab === langCode ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(langCode)}
                >
                  {intl.formatMessage({ id: `Fields.ColumnHas${langCode}` })}
                </a>
              </li>
            ))}
          </ul>

          {/* Editors */}
          {LANGUAGES.map((langCode) => {
            const webKey = `webTranslations.content${langCode}`;
            const mobileKey = `mobileTranslations.content${langCode}`;
            const contentKey =
              `content${langCode}` as keyof typeof formik.values.webTranslations;

            if (activeTab !== langCode) return null;

            return (
              <div key={langCode} className="tab-pane fade show active">
                <label className="fw-bold mb-2">🌐</label>

                <ReactQuill
                  theme="snow"
                  style={{ height: "200px", marginBottom: "40px" }}
                  value={formik.values.webTranslations[contentKey]}
                  onChange={(content) => formik.setFieldValue(webKey, content)}
                  placeholder={`Web content (${langCode})...`}
                />
                {/* {activeTab === "NL" && (
                  <div
                    className="d-flex alert alert-custom alert-default align-items-center mt-20"
                    style={{ backgroundColor: "#c9bef9" }}
                    role="alert"
                  >
                    <div className="alert-icon col-1 me-4">
                      <i className="ki-duotone ki-information-4 fs-3x text-center text-info">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>
                    <div className="alert-text col-10 d-flex flex-column text-info">
                      <span
                      // dangerouslySetInnerHTML={{
                      //   __html: intl.formatMessage({
                      //     id: "Fields.ModalBankMutationAttachToExistingInfo",
                      //   }),
                      // }}
                      >
                        In sommige gevallen kan het voorkomen dat de tekst voor
                        de mobiele apparaten moet worden aangepast vanwege
                        diverse beperkingen.
                      </span>
                    </div>
                  </div>
                )}
                <label className="fw-bold my-2">📱</label>
                <ReactQuill
                  theme="snow"
                  style={{ height: "200px" }}
                  value={formik.values.mobileTranslations[contentKey]}
                  onChange={(content) =>
                    formik.setFieldValue(mobileKey, content)
                  }
                  placeholder={`Mobile content (${langCode})...`}
                /> */}
              </div>
            );
          })}
        </form>
      </div>
    </>
  );
};

export { LocalizationAddModalBody };
