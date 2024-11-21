import { useEffect, useState } from "react";
import { ProductAddModalHeader } from "./ProductAddModalHeader";
import { ProductAddModalFooter } from "./ProductAddModalFooter";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { ProductAddModalForm } from "./ProductAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
import { getProductGroupById, postProduct } from "../core/_requests";
import { ProductResult } from "../core/_models";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  refresh: boolean;
  setEditModalId: (type: number) => void;
}
const ProductAddModal = ({
  setRefresh,
  setAddModalOpen,
  editModalId,
  refresh,
  setEditModalId,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();
  const [response, setResponse] = useState<ProductResult>();
  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      code: "",
      eanCode: "",
      supplierInhouseCode: "",
      supplierClientId: 0,
      productGroupId: 0,
      pricing: {
        units: 0,
        unitPrice: 0,
        companyUnitTypeId: 3242,
        btwExclusive: false,
        ledgerAccountId: 77630,
        vatTypeId: 5906,
      },
      pricingMargin: {
        purchasePrice: 0,
        marginFactorType: 0,
        marginFactor: 0,
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
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postProduct(values);
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getProductGroupById(editModalId);
        if (response.isValid) {
          formik.setValues({
            ...formik.values,
            ...response.result,
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    if (editModalId != 0) {
      fetchInitialData();
    }
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
        <div className="modal-dialog mw-700px">
          <div className="modal-content">
            <ProductAddModalHeader
              setAddModalOpen={setAddModalOpen}
              editModalId={editModalId}
            />
            <div className="modal-body p-10">
              <ProductAddModalForm
                formik={formik}
                isSubmitting={isSubmitting}
                editModalId={editModalId}
                refresh={refresh}
                setRefresh={setRefresh}
                setEditModalId={setEditModalId}
              />
            </div>
            <ProductAddModalFooter
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

export { ProductAddModal };
