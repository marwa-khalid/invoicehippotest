import React, { useEffect, useState } from "react";
import { ProductGroupsAddModalHeader } from "./ProductGroupsAddModalHeader";
import { ProductGroupsAddModalFooter } from "./ProductGroupsAddModalFooter";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { handleToast } from "../../../auth/core/_toast";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getBudgetGroupById, postBudgetGroup } from "../core/_requests";
import clsx from "clsx";
import { getLedgerAccountsForFilter } from "../../ledgeraccounts-list/core/_requests";
import { Draggable } from "@hello-pangea/dnd";
import { BudgetGroupAddStep1 } from "./BudgetGroupAddStep1";
import { BudgetGroupAddStep2 } from "./BudgetGroupAddStep2";
import { CustomTabManager } from "../../../generic/Tabs/CustomTabManager";
import { ListLoading } from "../../../generic/ListLoading";

const BudgetGroupAddModal = ({
  setRefresh,
  setAddModalOpen,
  editModalId,
  refresh,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ledgers, setLedgers] = useState<any>([]);
  const intl = useIntl();
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productModalIndex, setProductModalIndex] = useState<number>();
  const tabs = [
    {
      id: "tab1",
      label: "Detail",
      icon: "fa-regular fa-address-book fs-3 hippo-tab-icon",
    },
    {
      id: "tab2",
      label:"Subjects",
      icon: "fa-solid fa-file-invoice fs-3 hippo-tab-icon",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  // Fetch ledgers
  useEffect(() => {
    const fetchLedgers = async () => {
      const response = await getLedgerAccountsForFilter();
      if (response.isValid) {
        const groupByLedgerSubType = (items: any[], groupTitle: string) => {
          const groups: Record<number, { label: string; options: any[] }> = {};
          items.forEach((item) => {
            const subType = item.ledgerSubType;
            if (!groups[subType.value]) {
              groups[subType.value] = {
                label: `${groupTitle} - ${subType.description}`,
                options: [],
              };
            }
            groups[subType.value].options.push({
              value: item.id,
              label: item.title,
              bearingValue: item.bearingType.value,
            });
          });
          return Object.values(groups);
        };

        const groupedOptions = [
          ...groupByLedgerSubType(
            response.result.balanceActivaItems,
            response.result.balanceActivaItemsGroupTitle
          ),
          ...groupByLedgerSubType(
            response.result.balancePassivaItems,
            response.result.balancePassivaItemsGroupTitle
          ),
          ...groupByLedgerSubType(
            response.result.resultItems,
            response.result.resultItemsGroupTitle
          ),
        ];
        setLedgers(groupedOptions);
      }
    };
    fetchLedgers();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      subjects: [
        { title: "", description: "", relatedLedgerAccounts: [] as number[] },
      ],
    },

    validationSchema: Yup.object({
      title: Yup.string().min(3).max(50).required(),
      description: Yup.string().min(3).max(50).required(),
      subjects: Yup.array().of(
        Yup.object({
          title: Yup.string().required("Subject title required"),
          description: Yup.string().required("Subject description required"),
          relatedLedgerAccounts: Yup.array().min(1, "Pick at least one ledger"),
        })
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postBudgetGroup(
          values.id,
          values.title,
          values.description,
          values.subjects
        );
        if (response.isValid) {
          formik.resetForm();
          setAddModalOpen();
          setRefresh(!refresh);
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

  // load edit values
  useEffect(() => {
    if (editModalId) {
      getBudgetGroupById(editModalId).then((res) => {
        formik.setValues({
          id: res.result?.id || 0,
          title: res.result?.title || "",
          description: res.result?.description || "",
          subjects: res.result?.subjects || [
            { title: "", description: "", relatedLedgerAccounts: [] },
          ],
        });
      });
    }
  }, [editModalId]);

  // helper to add/remove subjects manually
  const addSubject = () => {
    formik.setFieldValue("subjects", [
      ...formik.values.subjects,
      { title: "", description: "", relatedLedgerAccounts: [] },
    ]);
  };

  const removeSubject = (index: number) => {
    const updated = [...formik.values.subjects];
    updated.splice(index, 1);
    formik.setFieldValue("subjects", updated);
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <ProductGroupsAddModalHeader
              setAddModalOpen={setAddModalOpen}
              editModalId={editModalId}
            />
            <CustomTabManager
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              hasOptions={false}
              hasSubscriptions={false}
              hasCustomFields={false}
            />

            <div className="hippo-tab-content" id="myTabContent">
              {activeTab.id === "tab1" && (
                <BudgetGroupAddStep1 formik={formik} />
              )}
              {activeTab.id === "tab2" && (
                <BudgetGroupAddStep2 formik={formik} ledgers={ledgers} />
              )}
            </div>
            <ProductGroupsAddModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setAddModalOpen={setAddModalOpen}
            />
            {isSubmitting && <ListLoading />}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { BudgetGroupAddModal };
