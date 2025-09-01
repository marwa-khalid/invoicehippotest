import { useEffect, useState } from "react";
import { ProductGroupsAddModalHeader } from "./ProductGroupsAddModalHeader";
import { ProductGroupsAddModalFooter } from "./ProductGroupsAddModalFooter";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { handleToast } from "../../../auth/core/_toast";
import { getBudgetGroupById, postBudgetGroup } from "../core/_requests";
import clsx from "clsx";
import { getLedgerAccountsForFilter } from "../../ledgeraccounts-list/core/_requests";

const ProductGroupsAddModal = ({
  setRefresh,
  setAddModalOpen,
  editModalId,
  refresh,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ledgers, setLedgers] = useState<any>([]);
  const intl = useIntl();

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

            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body p-10">
                {/* Main group title */}
                <div className="mb-7">
                  <label className="required fw-bold fs-6 mb-2">
                    Group Title
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("title")}
                    className={clsx("form-control form-control-solid", {
                      "is-invalid": formik.touched.title && formik.errors.title,
                    })}
                  />
                </div>

                <div className="mb-7">
                  <label className="required fw-bold fs-6 mb-2">
                    Group Description
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("description")}
                    className={clsx("form-control form-control-solid", {
                      "is-invalid":
                        formik.touched.description && formik.errors.description,
                    })}
                  />
                </div>

                <div className="separator my-10"></div>
                <h3>Subjects</h3>
                {/* Subjects */}
                <div className="accordion pt-4" id="subjectAccordion"></div>
                <div className="accordion pt-4" id="subjectsAccordion">
                  {formik.values.subjects.map((subject, index) => (
                    <div className="accordion-item mb-7" key={index}>
                      <h2
                        className="accordion-header"
                        id={`subject_heading_${index}`}
                      >
                        <button
                          className="accordion-button collapsed align-items-center bg-secondary"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#subject_collapse_${index}`}
                          aria-expanded="false"
                          aria-controls={`subject_collapse_${index}`}
                        >
                          <i className="ki-duotone ki-book fs-1 me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          {subject.title
                            ? subject.title
                            : `Subject ${index + 1}`}
                        </button>
                      </h2>

                      <div
                        id={`subject_collapse_${index}`}
                        data-bs-parent="#subjectsAccordion"
                        className="accordion-collapse collapse"
                        aria-labelledby={`subject_heading_${index}`}
                      >
                        <div className="separator border-gray-300"></div>
                        <div className="accordion-body bg-secondary">
                          <div className="innerContainer">
                            {/* Title */}
                            <div className="mb-3">
                              <label className="fw-bold mb-2">Title</label>
                              <input
                                type="text"
                                value={subject.title}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `subjects[${index}].title`,
                                    e.target.value
                                  )
                                }
                                className="form-control form-control-white"
                              />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                              <label className="fw-bold mb-2">
                                Description
                              </label>
                              <input
                                type="text"
                                value={subject.description}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `subjects[${index}].description`,
                                    e.target.value
                                  )
                                }
                                className="form-control form-control-white"
                              />
                            </div>

                            {/* Related Ledgers */}
                            <div className="mb-3">
                              <label className="fw-bold mb-2">
                                Related Ledgers
                              </label>
                              <Select
                                isMulti
                                options={ledgers}
                                value={ledgers
                                  .flatMap((g: any) => g.options)
                                  .filter((o: any) =>
                                    subject.relatedLedgerAccounts.includes(
                                      o?.value
                                    )
                                  )}
                                onChange={(selected: any) =>
                                  formik.setFieldValue(
                                    `subjects[${index}].relatedLedgerAccounts`,
                                    selected
                                      ? selected.map((s: any) => s.value)
                                      : []
                                  )
                                }
                              />
                            </div>

                            {/* Delete button */}
                            <div className="text-end">
                              <button
                                type="button"
                                className="btn btn-icon btn-danger btn-sm"
                                onClick={() => removeSubject(index)}
                              >
                                <i className="ki-solid ki-trash text-white fs-2"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-end ">
                  <button
                    type="button"
                    className="btn btn-primary align-items-center"
                    onClick={addSubject}
                  >
                    <i className="ki-duotone ki-plus-square fs-1 text-white">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                    </i>
                    <span>
                      Add Subject
                      {/* {intl.formatMessage({
                        id: "Fields.ModalNewTitleClientContact",
                      })} */}
                    </span>
                  </button>
                </div>
              </div>

              <ProductGroupsAddModalFooter
                formik={formik}
                isSubmitting={isSubmitting}
                setAddModalOpen={setAddModalOpen}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { ProductGroupsAddModal };
