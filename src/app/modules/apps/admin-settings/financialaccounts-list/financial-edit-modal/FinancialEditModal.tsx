import { useEffect, useState } from "react";
import { FinancialEditModalHeader } from "./FinancialEditModalHeader";
import { FinancialEditModalFooter } from "./FinancialEditModalFooter";
import { getFinancialAccountById, postLedgerAccount } from "../core/_requests";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import FinancialEditModalForm from "./FinancialEditModalForm";
import { handleToast } from "../../../../auth/core/_toast";
interface Props {
  setRefresh: (type: boolean) => void;
  setEditModalOpen: (type: boolean) => void;
  editModalId: number;
}
const FinancialEditModal = ({
  setRefresh,
  setEditModalOpen,
  editModalId,
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
      accountName: "",
      accountNumber: "",
      ledgerAccountId: 0,
      bankConnectMinImportDate: "",
      accountType: 0,
      autoCreateLedgerAccount: false,
      bankAccountCompanyType: 0,
      afterSaveModel: {
        ledgerAccountDisplayName: "",
      },
      bankConnectInfo: {
        isConnected: true,
        isActive: true,
        accessExpirtationDate: "",
        lastSyncRequestDate: "",
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
          50,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `50`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
        ),
      code: Yup.string()
        .min(
          2,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Code" }))
            .replace("{1}", `2`)
        )
        .max(
          50,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Code" }))
            .replace("{1}", `50`)
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
        // const response = await postLedgerAccount(
        //   values.id,
        //   values.title,
        //   values.code,
        //   values.defaultTaxTypeId,
        //   values.bearingType,
        //   values.reportReferenceType1,
        //   values.reportReferenceType2LegderAccountId,
        //   values.disableManualInput,
        //   values.taxDeductibleSettings
        // );
        // if (response.isValid) {
        //   formik.resetForm();
        //   setEditModalOpen(false);
        //   setRefresh(true);
        // }
        // handleToast(response);
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
        const response = await getFinancialAccountById(editModalId);
        console.log(response.result);
        formik.setValues({
          id: response.result.id,
          accountName: response.result.accountName,
          accountNumber: response.result.accountNumber,
          ledgerAccountId: response.result.ledgerAccountId,
          bankConnectMinImportDate: response.result.bankConnectMinImportDate,
          accountType: response.result.accountType,
          autoCreateLedgerAccount: response.result.autoCreateLedgerAccount,
          bankAccountCompanyType: response.result.bankAccountCompanyType,
          afterSaveModel: response.result.afterSaveModel,
          bankConnectInfo: response.result.bankConnectInfo,
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
            <FinancialEditModalHeader setEditModalOpen={setEditModalOpen} />
            <div className="modal-body p-10">
              <FinancialEditModalForm
                formik={formik}
                setSelectedBearingTypeOption={setSelectedBearingTypeOption}
                selectedBearingTypeOption={selectedBearingTypeOption}
                isSubmitting={isSubmitting}
                setReportReferenceType1={setReportReferenceType1}
                reportReferenceType1={reportReferenceType1}
              />
            </div>
            <FinancialEditModalFooter
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

export { FinancialEditModal };
