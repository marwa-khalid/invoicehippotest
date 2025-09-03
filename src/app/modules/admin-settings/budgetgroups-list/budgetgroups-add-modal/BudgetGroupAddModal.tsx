import { useEffect, useState } from "react";
import { BudgetGroupsAddModalHeader } from "./BudgetGroupsAddModalHeader";
import { BudgetGroupsAddModalFooter } from "./BudgetGroupsAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { handleToast } from "../../../auth/core/_toast";
import { getBudgetGroupById, postBudgetGroup } from "../core/_requests";
import { getLedgerAccountsForFilter } from "../../ledgeraccounts-list/core/_requests";
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
  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({ id: "Fields.TabCommon" }),
      icon: "fa-regular fa-address-book fs-3 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({ id: "Fields.TabBudgetSubjects" }),
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

      subjects: Yup.array().of(
        Yup.object({
          title: Yup.string().required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
          ),
          // relatedLedgerAccounts: Yup.array().min(1, "Pick at least one ledger"),
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
          subjects:
            res.result?.subjects.length !== 0
              ? res.result?.subjects
              : [{ title: "", description: "", relatedLedgerAccounts: [] }],
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
            <BudgetGroupsAddModalHeader
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
            <BudgetGroupsAddModalFooter
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
