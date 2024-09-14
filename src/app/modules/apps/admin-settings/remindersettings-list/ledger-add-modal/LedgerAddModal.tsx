import { useEffect, useState } from "react";
import { LedgerAddModalHeader } from "./LedgerAddModalHeader";
import { LedgerAddModalFooter } from "./LedgerAddModalFooter";
import { getVatTypesForLedger, postLedgerAccount } from "../core/_requests";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { LedgerAddModalForm } from "./LedgerAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
}
const LedgerAddModal = ({ setRefresh, setAddModalOpen }: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  interface vatType {
    value: number;
    label: string;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vatTypes, setVatTypes] = useState<vatType | any>();
  const intl = useIntl();
  const [selectedBearingTypeOption, setSelectedBearingTypeOption] =
    useState<any>();
  useEffect(() => {
    const fetchVatTypes = async () => {
      try {
        const response = await getVatTypesForLedger();
        let options = [];
        if (selectedBearingTypeOption.IsAccountTypeOmzet) {
          options = [
            {
              label: response.result.listForSalesGroupTitle,
              options: response.result.listForSales.map((item) => ({
                value: item.id,
                label: item.title,
              })),
            },
          ];
        } else if (selectedBearingTypeOption.IsAccountTypeCost) {
          options = [
            {
              label: response.result.listForCostsGroupTitle,
              options: response.result.listForCosts.map((item) => ({
                value: item.id,
                label: item.title,
              })),
            },
          ];
        } else {
          options = [
            {
              label: response.result.listForSalesGroupTitle,
              options: response.result.listForSales.map((item) => ({
                value: item.id,
                label: item.title,
              })),
            },
            {
              label: response.result.listForCostsGroupTitle,
              options: response.result.listForCosts.map((item) => ({
                value: item.id,
                label: item.title,
              })),
            },
          ];
        }

        setVatTypes(options);
      } catch (error) {
        console.error("Error fetching ledger accounts:", error);
      }
    };

    fetchVatTypes();
  }, [selectedBearingTypeOption]);

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
        isNotFullyTaxDeductible: true,
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

      // "taxDeductibleSettings.isNotFullyTaxDeductible": Yup.boolean().required(
      //   intl.formatMessage({ id: "Common.RequiredFieldHint2" }).replace(
      //     "{0}",
      //     intl.formatMessage({
      //       id: "Fields.IsNotFullyTaxDeductible",
      //     })
      //   )
      // ),
      // "taxDeductibleSettings.taxDeductiblePercentage": Yup.number().required(
      //   intl.formatMessage({ id: "Common.RequiredFieldHint2" }).replace(
      //     "{0}",
      //     intl.formatMessage({
      //       id: "Fields.TaxDeductiblePercentage",
      //     })
      //   )
      // ),
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
          setAddModalOpen(false);
          setRefresh(true);
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
            <LedgerAddModalHeader setAddModalOpen={setAddModalOpen} />
            <div className="modal-body">
              <LedgerAddModalForm
                formik={formik}
                setSelectedBearingTypeOption={setSelectedBearingTypeOption}
                selectedBearingTypeOption={selectedBearingTypeOption}
                isSubmitting={isSubmitting}
                vatTypes={vatTypes}
                setReportReferenceType1={setReportReferenceType1}
                reportReferenceType1={reportReferenceType1}
              />
            </div>
            <LedgerAddModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setAddModalOpen={setAddModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { LedgerAddModal };
