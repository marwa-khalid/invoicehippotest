import { useEffect, useState } from "react";
import { ReminderAddModalHeader } from "./ReminderAddModalHeader";
import { ReminderAddModalFooter } from "./ReminderAddModalFooter";
import { getNotificationById, postNotificationCycle } from "../core/_requests";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { ReminderAddModalForm } from "./ReminderAddModalForm";
import { handleToast } from "../../../auth/core/_toast";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  refresh: boolean;
}
const ReminderAddModal = ({
  setRefresh,
  setAddModalOpen,
  editModalId,
  refresh,
}: Props) => {
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
  const intl = useIntl();

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      isDefault: false,
      areaUsageType: 1,
      reminder1: {
        isActive: false,
        sendMeAnCopy: false,
        reminderDays: 14,
        emailReminderType: 2,
      },
      reminder2: {
        isActive: false,
        sendMeAnCopy: false,
        reminderDays: 14,
        emailReminderType: 2,
      },
      reminder3: {
        isActive: false,
        sendMeAnCopy: false,
        reminderDays: 14,
        emailReminderType: 2,
      },
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(
          3,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.FullName" }))
            .replace("{1}", `3`)
        )
        .max(
          100,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.FullName" }))
            .replace("{1}", `100`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.FullName" }))
        ),

      areaUsageType: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace(
            "{0}",
            intl.formatMessage({ id: "Fields.NotificationCycleAreaUsageType" })
          )
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postNotificationCycle(values);
        if (response.isValid) {
          formik.resetForm();
          setAddModalOpen(false);
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getNotificationById(editModalId);
        if (response.isValid) {
          formik.setValues({
            ...formik.values,
            ...response.result, // Merge the response with the existing form values
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
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <ReminderAddModalHeader
              setAddModalOpen={setAddModalOpen}
              editModalId={editModalId}
            />
            <div className="modal-body">
              <ReminderAddModalForm
                formik={formik}
                isSubmitting={isSubmitting}
              />
            </div>
            <ReminderAddModalFooter
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

export { ReminderAddModal };
