import { useEffect, useState } from "react";
import { LocalizationAddModalHeader } from "./LocalizationAddModalHeader";
import { LocalizationAddModalFooter } from "./LocalizationAddModalFooter";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { LocalizationAddModalBody } from "./LocalizationAddModalBody";
import { getLocalizationById, postLocalization } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
import { ListLoading } from "../../../generic/ListLoading";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
}

const LocalizationAddModal = ({
  setRefresh,
  setAddModalOpen,
  refresh,
  setEditModalId,
  editModalId,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const intl = useIntl();

  const formik = useFormik({
    initialValues: {
      id: 0,
      moduleType: 0,
      key: "",
      isSystemCreated: true,
      webTranslations: {
        contentNL: "",
        contentEN: "",
        contentPL: "",
        contentES: "",
        contentDE: "",
        contentFR: "",
        contentTR: "",
      },
      mobileTranslations: {
        contentNL: "",
        contentEN: "",
        contentPL: "",
        contentES: "",
        contentDE: "",
        contentFR: "",
        contentTR: "",
      },
    },

    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        let response;
        response = await postLocalization(values);
        if (response.isValid) {
          setAddModalOpen(false);
          setRefresh(!refresh);
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const res = await getLocalizationById(editModalId);

        formik.setValues({
          ...formik.values,
          ...res.result, // Merge the response with the existing form values
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [editModalId, refresh]);

  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({
        id: "Fields.BookingRuleModalTabRecognitionRule",
      }),
      icon: "la la-list fs-3 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({
        id: "Fields.BookingRuleModalTabProcessingRule",
      }),
      icon: "la la-cloud-upload fs-3 hippo-tab-icon",
    },
  ];
  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        id="booking_add_modal"
        aria-modal="true"
        tabIndex={-1}
      >
        <div
          className="modal-dialog"
          style={{
            maxWidth: "1024px",
            width: "100%",
          }}
        >
          <div className="modal-content">
            <LocalizationAddModalHeader
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
            />
            <div className="separator px-10"></div>
            <LocalizationAddModalBody
              formik={formik}
              setRefresh={setRefresh}
              refresh={refresh}
            />

            <LocalizationAddModalFooter
              formik={formik}
              setAddModalOpen={setAddModalOpen}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
      {isLoading && <ListLoading />}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { LocalizationAddModal };
