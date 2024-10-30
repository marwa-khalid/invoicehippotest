import { useEffect, useState } from "react";
import { VatEditModalHeader } from "./VatEditModalHeader";
import { VatEditModalFormWrapper } from "./VatEditModalFormWrapper";
import { UserEditModalFooter } from "./VatEditModalFooter";
import { LedgerForVatResult } from "../core/_models";
import { getLedgerAccount, getVatById } from "../core/_requests";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { postVatType } from "../core/_requests";

import * as Yup from "yup";
interface ComponentProps {
  editModalId: number;
  setEditModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
interface ledgerAccount {
  value: number;
  label: string;
}
const VatEditModal = ({
  editModalId,
  setRefresh,
  setEditModalOpen,
  refresh,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ledgerAccounts, setLedgerAccounts] = useState<ledgerAccount | any>();
  const [vatTypeDetails, setVatTypeDetails] = useState<any>(null);
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

  useEffect(() => {
    const getVatTypeDetails = async () => {
      try {
        const response = await getVatById(editModalId);
        setVatTypeDetails(response);
        // setTotalItems(response.result);
      } catch (error) {
        console.error("Error fetching VAT types:", error);
      } finally {
      }
    };
    getVatTypeDetails();
  }, []);

  const formSchema = Yup.object().shape({
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
    ledgerAccountId: Yup.string().required(
      intl
        .formatMessage({ id: "Common.RequiredFieldHint2" })
        .replace("{0}", intl.formatMessage({ id: "Fields.LedgerAccount" }))
    ),
  });

  useEffect(() => {
    if (vatTypeDetails) {
      formik.setValues({
        id: vatTypeDetails.result.id || 0,
        title: vatTypeDetails.result.title || "",

        value: vatTypeDetails.result.value || 0,
        documentGroup: vatTypeDetails?.result?.vatAreaUsageType,
        ledgerAccountId: vatTypeDetails?.result?.ledgerAccountId || "",
        isNoneVatType: vatTypeDetails.result.isNoneVatType || false,
        alwaysExclusiveOfVAT: vatTypeDetails.result.isAlwaysExBtw || false,
        showInLists: vatTypeDetails.result.useInLists || false,
        showOnDocuments: vatTypeDetails.result.showOnDocuments || false,
      });
    }
  }, [vatTypeDetails]);

  const formik = useFormik({
    initialValues: {
      id: vatTypeDetails?.result?.id || 0,
      title: vatTypeDetails?.result?.title || "",
      value: vatTypeDetails?.result?.value || 0,
      documentGroup: vatTypeDetails?.result?.vatAreaUsageType,
      ledgerAccountId: vatTypeDetails?.result?.ledgerAccountId || "",
      isNoneVatType: vatTypeDetails?.result?.isNoneVatType || false,
      alwaysExclusiveOfVAT: vatTypeDetails?.result.isAlwaysExBtw || false,
      showInLists: vatTypeDetails?.result?.useInLists || false,
      showOnDocuments: vatTypeDetails?.result?.showOnDocuments || false,
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setIsSubmitting(true);
      try {
        const response = await postVatType(
          values.id,
          values.ledgerAccountId,
          values.title,
          values.value,
          values.documentGroup,
          values.alwaysExclusiveOfVAT,
          values.showInLists,
          values.showOnDocuments,
          values.isNoneVatType
        );
        if (response) {
          setRefresh(!refresh);
          formik.resetForm();
          setEditModalOpen(false);
        }
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
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-650px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <VatEditModalHeader setEditModalOpen={setEditModalOpen} />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                <VatEditModalFormWrapper
                  formik={formik}
                  ledgerAccounts={ledgerAccounts}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <UserEditModalFooter
              setEditModalOpen={setEditModalOpen}
              formik={formik}
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

export { VatEditModal };
