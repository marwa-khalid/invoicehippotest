import { useEffect, useState } from "react";
import { VatAddModalHeader } from "./VatAddModalHeader";
import { VatAddModalFormWrapper } from "./VatAddModalFormWrapper";
import { VatAddModalFooter } from "./VatAddModalFooter";
import { getVatTypesForLedger } from "../core/_requests";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { useListView } from "../core/ListViewProvider";
import { toast } from "react-toastify";
interface Props {
  setRefresh: (type: boolean) => void;
}
const VatAddModal = ({ setRefresh }: Props) => {
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

  interface GroupedOption {
    label: any;
    options: { value: number; label: string }[];
    IsAccountTypeOmzet: boolean;
    IsAccountTypeBtw: boolean;
    IsAccountTypeCost: boolean;
    IsAccountTypeResult: boolean;
    IsAccountTypePrive: boolean;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setItemIdForUpdate } = useListView();
  const [vatTypes, setVatTypes] = useState<vatType | any>();
  const intl = useIntl();
  const [selectedBearingTypeOption, setSelectedBearingTypeOption] =
    useState<any>();
  useEffect(() => {
    const fetchVatTypes = async () => {
      try {
        const response = await getVatTypesForLedger();
        let options = [];
        console.log(selectedBearingTypeOption);
        if (selectedBearingTypeOption.IsAccountTypeOmzet) {
          console.log("working");
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
          console.log("working");
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
          console.log("working");
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
      value: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Value" }))
      ),
      documentGroup: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.VatAreaUsageType" }))
      ),
      ledgerAccountId: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.LedgerAccount" }))
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        // const mappedDocumentGroup = values.documentGroup === "1" ? 1 : 2;
        // const response = await postVatType(
        //   values.id,
        //   values.ledgerAccountId,
        //   values.title,
        //   values.value,
        //   mappedDocumentGroup,
        //   values.alwaysExclusiveOfVAT,
        //   values.showInLists,
        //   values.showOnDocuments,
        //   values.isNoneVatType
        // );

        formik.resetForm();
        setItemIdForUpdate(undefined);
        setRefresh(true);
        toast.success(intl.formatMessage({ id: "System.NewSuccessVatType" }));
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
            <VatAddModalHeader />
            <div
              className="modal-body p-10"
              style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}
            >
              <VatAddModalFormWrapper
                formik={formik}
                setSelectedBearingTypeOption={setSelectedBearingTypeOption}
                selectedBearingTypeOption={selectedBearingTypeOption}
                isSubmitting={isSubmitting}
                vatTypes={vatTypes}
              />
            </div>
            <VatAddModalFooter formik={formik} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { VatAddModal };
