import { useEffect, useState } from "react";
import { QuoteValidateModalHeader } from "./QuoteValidateModalHeader";
import { QuoteValidateModalFooter } from "./QuoteValidateModalFooter";
import { useIntl } from "react-intl";
import { FormValues, QuoteValidateStep1 } from "./QuoteValidateStep1";
import { QuoteValidateStep2 } from "./QuoteValidateStep2";
import { QuoteValidateStep3 } from "./QuoteValidateStep3";
import { QuoteValidateStep4 } from "./QuoteValidateStep4";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validateQuote } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
import { useAuth } from "../../../auth";
import { DigitalSignature } from "./DigitalSignature";
interface ComponentProps {
  quoteId: number;
  quoteNumber: string;
  setValidateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const QuoteValidateModal = ({
  quoteId,
  quoteNumber,
  setValidateModalOpen,
  setRefresh,
  refresh,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();
  const auth = useAuth();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formik = useFormik<FormValues>({
    initialValues: {
      quoteId: quoteId,
      validationStateType: 0,
      declinedReasonType: 1,
      comments: "",
      notifyClient: auth.currentUser?.result.isAnonymousUser ? true : false,
      quoteValidationSignee: {
        validatedByFullName: "",
        validatedByCity: "",
        validatedByEmailAddress: "",
        validatedBySignatureBase64: "",
        validatedBySignatureId: 0,
      },
    },
    validateOnChange: true,
    validationSchema: Yup.object().shape({
      comments: Yup.lazy((): Yup.Schema<any> => {
        if (formik.values.validationStateType === 2) {
          return Yup.string().required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", "Comments")
          );
        }
        return Yup.string().nullable(); // still valid schema if not required
      }),
      quoteValidationSignee: Yup.lazy(
        (): Yup.Schema<any> =>
          formik.values.validationStateType === 1
            ? Yup.object().shape({
                validatedByFullName: Yup.string().required(
                  intl
                    .formatMessage({ id: "Common.RequiredFieldHint2" })
                    .replace(
                      "{0}",
                      intl.formatMessage({ id: "Fields.FullName" })
                    )
                ),
                validatedByCity: Yup.string().required(
                  intl
                    .formatMessage({ id: "Common.RequiredFieldHint2" })
                    .replace(
                      "{0}",
                      `${intl.formatMessage({
                        id: "Fields.Location",
                      })}-/ ${intl.formatMessage({ id: "Fields.City" })}`
                    )
                ),
                validatedByEmailAddress: Yup.string()
                  .required(
                    intl
                      .formatMessage({ id: "Common.RequiredFieldHint2" })
                      .replace(
                        "{0}",
                        intl.formatMessage({ id: "Fields.EmailAddress" })
                      )
                  )
                  .email(
                    intl
                      .formatMessage({ id: "Common.InvalidFormat" })
                      .replace(
                        "{0}",
                        intl.formatMessage({ id: "Fields.EmailAddress" })
                      )
                  ),
                validatedBySignatureBase64: Yup.string().required(
                  intl
                    .formatMessage({ id: "Common.RequiredFieldHint2" })
                    .replace(
                      "{0}",
                      intl.formatMessage({ id: "Fields.Signature" })
                    )
                ),
              })
            : Yup.object().shape({
                validatedByFullName: Yup.string().nullable(),
                validatedByCity: Yup.string().nullable(),
                validatedByEmailAddress: Yup.string().nullable(),
              })
      ),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      let filteredValues;

      if (values.validationStateType === 1) {
        filteredValues = {
          quoteId: values.quoteId,
          validationStateType: values.validationStateType,
          comments: values.comments,
          notifyClient: values.notifyClient,
          quoteValidationSignee: values.quoteValidationSignee,
        };
      } else {
        filteredValues = {
          quoteId: values.quoteId,
          validationStateType: values.validationStateType,
          comments: values.comments,
          notifyClient: values.notifyClient,
          declinedReasonType: values.declinedReasonType,
        };
      }
      try {
        const response = await validateQuote(filteredValues);

        if (response.isValid) {
          setRefresh(!refresh);
          setValidateModalOpen(false);
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });
  const tabs = [
    {
      id: 1,
      label: "Selection",
      icon: <i className="fa-regular fa-address-book fs-3 hippo-tab-icon"></i>,
    },
    {
      id: 2,
      label: formik.values.validationStateType === 1 ? "Comments" : "Reason",
      icon: <i className="fa-solid fa-file-invoice fs-3 hippo-tab-icon"></i>,
    },
    {
      id: 3,
      label: "Personal Details",
      icon: (
        <i className="fa-regular fa-closed-captioning fs-3 hippo-tab-icon"></i>
      ),
    },
    {
      id: 4,
      label: "Sign Document",
      icon: (
        <i className="fa-regular fa-closed-captioning fs-3 hippo-tab-icon"></i>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setCurrentIndex(tab.id - 1);
  };
  useEffect(() => {
    formik.validateForm();
  }, [formik.values.validationStateType]);

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_copy_quote"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog mw-700px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <QuoteValidateModalHeader
              setValidateModalOpen={setValidateModalOpen}
              quoteNumber={quoteNumber}
            />

            {/* start::Modal body */}
            <div className="hippo-tab-content" id="myTabContent">
              {/* <DigitalSignature formik={formik} /> */}
              {activeTab.id === 1 && (
                <QuoteValidateStep1
                  formik={formik}
                  setActiveTab={setActiveTab}
                  tabs={tabs}
                />
              )}
              {activeTab.id === 2 && <QuoteValidateStep2 formik={formik} />}
              {activeTab.id === 3 && <QuoteValidateStep3 formik={formik} />}
              {activeTab.id === 4 && <QuoteValidateStep4 formik={formik} />}
            </div>

            {/* end::Modal body */}
            <QuoteValidateModalFooter
              quoteId={quoteId}
              setValidateModalOpen={setValidateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              tabs={tabs}
              setActiveTab={setActiveTab}
              formik={formik}
              activeTab={activeTab}
              isSubmitting={isSubmitting}
            />
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { QuoteValidateModal };
