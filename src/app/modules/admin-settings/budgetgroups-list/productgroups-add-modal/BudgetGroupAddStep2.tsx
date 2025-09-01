import React, { FC, useState } from "react";
import { useIntl } from "react-intl";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FormikProps } from "formik";
import { useAuth } from "../../../auth";
import * as Tooltip from "@radix-ui/react-tooltip";
import { BudgetGroupPost } from "../core/_models";
import { SubjectDetailModal } from "./SubjectDetailModal";

type Props = {
  formik: FormikProps<BudgetGroupPost>;
  ledgers: any;
};

const BudgetGroupAddStep2: FC<Props> = ({ formik, ledgers }) => {
  const intl = useIntl();
  const [productModalOpen, setSubjectModalOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

  const [productModalIndex, setSubjectModalIndex] = useState<number>();

  const handleTempInputChange = (key: any, value: any) => {
    setSelectedSubject((prev: any) => ({ ...prev, [key]: value })); // update temporary state
  };

  const handleQuillChange = (key: any, content: string) => {
    setSelectedSubject((prev: any) => ({ ...prev, [key]: content }));
  };
  const handleSave = () => {
    formik.setFieldValue(`subjects[${productModalIndex}]`, selectedSubject); // update Formik with temp values
    setSubjectModalOpen(false);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedSubjects = [...formik.values.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    formik.setFieldValue("subjects", updatedSubjects);
  };

  const handleAddRow = (product: any, e: any) => {
    e.preventDefault();

    const currentSubjects = formik.values.subjects || [];

    // Get the max orderIndex from current subjects, or -1 if empty
    const maxOrderIndex = currentSubjects.length
      ? Math.max(...currentSubjects.map((p: any) => p.orderIndex ?? 0))
      : -1;

    const newRow = {
      id: 0,
      title: "",
      orderIndex: maxOrderIndex + 1,
      description: "",
      subjects: [
        { title: "", description: "", relatedLedgerAccounts: [] as number[] },
      ],
    };

    formik.setFieldValue("subjects", [...currentSubjects, newRow]);
  };

  const handleRemoveRow = (index: number, e: any) => {
    e.preventDefault();
    const updatedSubjects = formik.values.subjects.filter(
      (_, rowIndex) => rowIndex !== index
    );
    formik.setFieldValue("subjects", updatedSubjects);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedSubjects = [...formik.values.subjects];
    const [reorderedItem] = updatedSubjects.splice(result.source.index, 1);
    updatedSubjects.splice(result.destination.index, 0, reorderedItem);

    // Reassign orderIndex based on new position
    const reorderedWithIndexes = updatedSubjects.map((item, idx) => ({
      ...item,
      orderIndex: idx,
    }));

    formik.setFieldValue("subjects", reorderedWithIndexes);
  };

  return (
    <div className="modal-body" id="#kt_tab_pane_5">
      <form className="form" noValidate>
        {/* Editable Table with Drag and Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="subjects">
            {(provided) => (
              <table
                className="table gs-3 gy-3"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <thead>
                  <tr className="fw-bold text-muted">
                    <th>
                      {intl.formatMessage({ id: "Fields.Title" }).toUpperCase()}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="mt-10">
                    <td
                      colSpan={2}
                      style={{
                        borderTop: "1px dotted #d6d4ce",
                        width: "100%",
                        margin: "0",
                      }}
                    />
                  </tr>
                  {formik.values.subjects.map((subject, index) => (
                    <React.Fragment key={index}>
                      <Draggable
                        key={index}
                        draggableId={index.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <>
                            <tr
                              onClick={() => setSubjectModalIndex(index)}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <td>
                                <div className="d-flex align-items-center mb-2">
                                  <span
                                    {...provided.dragHandleProps} // Attach dragHandleProps here
                                    className="btn btn-icon btn-light btn-sm me-2 drag-handle px-2"
                                    style={{ cursor: "grab" }}
                                  >
                                    <i className="ki-duotone ki-arrow-mix text-muted fs-2">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                  </span>

                                  <Tooltip.Provider delayDuration={0}>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger asChild>
                                        <button
                                          className="btn btn-icon btn-light btn-sm me-2 px-2 "
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setSubjectModalOpen(true);
                                            setSelectedSubject(subject);
                                          }}
                                        >
                                          <i className="ki-solid ki-pencil text-warning fs-2" />
                                        </button>
                                      </Tooltip.Trigger>

                                      <Tooltip.Portal>
                                        <Tooltip.Content
                                          side="top"
                                          className="app-tooltip"
                                        >
                                          {intl.formatMessage({
                                            id: "Fields.ToolTipEdit",
                                          })}
                                          <Tooltip.Arrow className="app-tooltip-arrow" />
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>

                                  <input
                                    type="text"
                                    id={`title_${index}`}
                                    className="form-control form-control-solid border-0 p-3"
                                    value={subject.title || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                {console.log(formik.values.subjects)!}
                                <div>
                                  <span className="text-muted fs-8 d-flex align-items-center mt-2">
                                    {ledgers
                                      .flatMap((g: any) => g.options)
                                      .filter((o: any) =>
                                        subject?.relatedLedgerAccounts?.includes(
                                          o?.value
                                        )
                                      )
                                      .map((item: any, idx: number) => (
                                        <span
                                          key={idx}
                                          className="d-flex align-items-center me-3"
                                        >
                                          <i className="ki-duotone ki-file me-2 fs-4">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                          </i>
                                          {item.label}
                                        </span>
                                      ))}
                                  </span>
                                </div>
                              </td>

                              <td className="w-150px text-end">
                                {formik.values.subjects.length === 1 ? (
                                  // Other rows: Only show the remove button
                                  <button
                                    className="btn btn-icon btn-light btn-sm"
                                    onClick={(e) => handleAddRow(subject, e)}
                                  >
                                    <i className="ki-solid ki-plus text-success fs-2" />
                                  </button>
                                ) : index ===
                                  formik.values.subjects.length - 1 ? (
                                  // Last row: Show both add and remove buttons
                                  <>
                                    <button
                                      className="btn btn-icon btn-light btn-sm me-2"
                                      onClick={(e) => handleRemoveRow(index, e)}
                                    >
                                      <i className="ki-solid ki-minus text-danger fs-2" />
                                    </button>
                                    <button
                                      className="btn btn-icon btn-light btn-sm"
                                      onClick={(e) => handleAddRow(subject, e)}
                                    >
                                      <i className="ki-solid ki-plus text-success fs-2" />
                                    </button>
                                  </>
                                ) : (
                                  // Other rows: Only show the remove button
                                  <button
                                    className="btn btn-icon btn-light btn-sm"
                                    onClick={(e) => handleRemoveRow(index, e)}
                                  >
                                    <i className="ki-solid ki-minus text-danger fs-2" />
                                  </button>
                                )}
                              </td>
                            </tr>
                            {subject.description && (
                              <tr>
                                <td colSpan={2}>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: subject.description,
                                    }}
                                  />
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td
                                colSpan={2}
                                style={{
                                  borderTop: "1px dotted #d6d4ce",
                                  width: "100%",
                                  margin: "0",
                                }}
                              />
                            </tr>
                          </>
                        )}
                      </Draggable>
                    </React.Fragment>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </form>

      {productModalOpen && (
        <SubjectDetailModal
          setSubjectModalOpen={setSubjectModalOpen}
          selectedSubject={selectedSubject}
          handleTempInputChange={handleTempInputChange}
          ledgers={ledgers}
          handleQuillChange={handleQuillChange}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export { BudgetGroupAddStep2 };
