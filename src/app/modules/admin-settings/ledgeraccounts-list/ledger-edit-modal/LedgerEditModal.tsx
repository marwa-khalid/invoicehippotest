import { useEffect, useState } from "react";
import { LedgerEditModalHeader } from "./LedgerEditModalHeader";
import { LedgerEditModalFooter } from "./LedgerEditModalFooter";
import { getLedgerById, postLedgerAccount } from "../core/_requests";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import LedgerEditModalForm from "./LedgerEditModalForm";
import { handleToast } from "../../../auth/core/_toast";
interface Props {
  setRefresh: (type: boolean) => void;
  setEditModalOpen: (type: boolean) => void;
  editModalId: number;
  refresh: boolean;
}
const LedgerEditModal = ({
  setRefresh,
  setEditModalOpen,
  editModalId,
  refresh,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intl = useIntl();
  const [selectedBearingTypeOption, setSelectedBearingTypeOption] =
    useState<any>();

  const [reportReferenceType1, setReportReferenceType1] = useState();

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      code: "",
      defaultTaxTypeId: 0,
      bearingType: 0,
      reportReferenceType1: 0,
      reportReferenceType2LegderAccountId: 0,
      disableManualInput: true,
      taxDeductibleSettings: {
        isNotFullyTaxDeductible: false,
        taxDeductiblePercentage: 0,
        deductiblePrivateLedgerAccountId: 0,
      },
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(
          3,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `3`)
        )
        .max(
          100,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `100`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
        ),
      code: Yup.string()
        .min(
          4,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Code" }))
            .replace("{1}", `4`)
        )
        .max(
          100,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Code" }))
            .replace("{1}", `100`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Code" }))
        ),

      bearingType: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.LedgerAccount" }))
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postLedgerAccount(
          values.id,
          values.title,
          values.code,
          values.defaultTaxTypeId,
          values.bearingType,
          values.reportReferenceType1,
          values.reportReferenceType2LegderAccountId,
          values.disableManualInput,
          values.taxDeductibleSettings
        );
        if (response.isValid) {
          formik.resetForm();
          setEditModalOpen(false);
          setRefresh(!refresh);
        }
        handleToast(response);
      } catch (error) {
        console.error("Put failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getLedgerById(editModalId);

        formik.setValues({
          id: response.result.id,
          title: response.result.title,
          code: response.result.code,
          defaultTaxTypeId: response.result.defaultTaxTypeId,
          bearingType: response.result.bearingType,
          reportReferenceType1: response.result.reportReferenceType1,
          reportReferenceType2LegderAccountId:
            response.result.reportReferenceType2LegderAccountId,
          disableManualInput: response.result.disableManualInput,
          taxDeductibleSettings: response.result.taxDeductibleSettings,
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [editModalId]);

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="kt_modal_1"
        aria-modal="true"
      >
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <LedgerEditModalHeader setEditModalOpen={setEditModalOpen} />
            <div className="modal-body p-10">
              <LedgerEditModalForm
                formik={formik}
                setSelectedBearingTypeOption={setSelectedBearingTypeOption}
                selectedBearingTypeOption={selectedBearingTypeOption}
                isSubmitting={isSubmitting}
                setReportReferenceType1={setReportReferenceType1}
                reportReferenceType1={reportReferenceType1}
              />
            </div>
            <LedgerEditModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setEditModalOpen={setEditModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { LedgerEditModal };
