import { useEffect, useState } from "react";
import { VatAddModalHeader } from "./VatAddModalHeader";
import { VatAddModalFormWrapper } from "./VatAddModalFormWrapper";
import { VatAddModalFooter } from "./VatAddModalFooter";
import { getLedgerAccount } from "../core/_requests";
import { LedgerForVatResult } from "../core/_models";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { postVatType } from "../core/_requests";
import { useListView } from "../core/ListViewProvider";
import { toast } from "react-toastify";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const VatAddModal = ({ setRefresh, refresh }: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  interface ledgerAccount {
    value: number;
    label: string;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setItemIdForUpdate } = useListView();
  const [ledgerAccounts, setLedgerAccounts] = useState<ledgerAccount | any>();
  const intl = useIntl();

  useEffect(() => {
    const fetchLedgerAccounts = async () => {
      try {
        const response = await getLedgerAccount();
        const options = response.result.map((account: LedgerForVatResult) => ({
          value: account.id,
          label: account.title,
        }));
        setLedgerAccounts(options);
      } catch (error) {
        console.error("Error fetching ledger accounts:", error);
      }
    };

    fetchLedgerAccounts();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      value: 0,
      documentGroup: "",
      ledgerAccountId: 0,
      isNoneVatType: false,
      alwaysExclusiveOfVAT: false,
      showInLists: false,
      showOnDocuments: false,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(
          2,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `2`)
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
        const mappedDocumentGroup = values.documentGroup === "1" ? 1 : 2;
        const response = await postVatType(
          values.id,
          values.ledgerAccountId,
          values.title,
          values.value,
          mappedDocumentGroup,
          values.alwaysExclusiveOfVAT,
          values.showInLists,
          values.showOnDocuments,
          values.isNoneVatType
        );

        formik.resetForm();
        setItemIdForUpdate(undefined);
        setRefresh(!refresh);
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
        id="kt_modal_add_user"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered mw-650px">
          <div className="modal-content">
            <VatAddModalHeader />
            <div className="modal-body p-10">
              <div className="form-wrapper">
                <VatAddModalFormWrapper
                  formik={formik}
                  isSubmitting={isSubmitting}
                  ledgerAccounts={ledgerAccounts}
                />
              </div>
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
