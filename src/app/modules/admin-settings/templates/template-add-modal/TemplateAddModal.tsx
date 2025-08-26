import { useEffect, useState } from "react";
import { TemplateAddModalHeader } from "./TemplateAddModalHeader";
import { TemplateAddModalFooter } from "./TemplateAddModalFooter";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import { TemplateAddStep2 } from "./TemplateAddStep2";
import { getTemplateById, postTemplate } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
import { ListLoading } from "../../../generic/ListLoading";
import { CustomTabManager } from "../../../generic/Tabs/CustomTabManager";
import { TemplateAddStep1 } from "./TemplateAddStep1";
import { AttachmentsModal } from "../../../generic/FileManager/AttachmentsModal";
import { TemplatePost } from "../core/_models";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
}

const TemplateAddModal = ({
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
      title: "",
      categoryType: 1,
      ownerSubscriberId: 0,
      documents: [] as TemplatePost["documents"],
      previewImageFileId: 0,
      previewImageFileUrl: "",
      hasOwner: false,
      owner: {
        id: 0,
        fullName: "",
      },
      hasPreviewImage: false,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(
          5,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `5`)
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

    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const response = await postTemplate(values);
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
        const res = await getTemplateById(editModalId);

        formik.setValues({
          ...formik.values,
          ...res.result, // Merge the response with the existing form values
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (editModalId !== 0) {
      fetchInitialData();
    }
  }, [editModalId, refresh]);

  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({
        id: "Fields.TabSettingsCommon",
      }),
      icon: "ki-solid ki-profile-circle fs-2 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({
        id: "Fields.TabSettingsTemplate",
      }),
      icon: "ki-solid ki-folder fs-2 hippo-tab-icon",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  const [type, setType] = useState<any>();
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);
  const [info, setInfo] = useState<string>("");
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
            maxWidth: "850px",
            width: "100%",
          }}
        >
          <div className="modal-content">
            <TemplateAddModalHeader
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
              editModalId={editModalId}
            />
            <CustomTabManager
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              hasOptions={false}
              hasSubscriptions={false}
            />
            <div className="separator px-10"></div>
            {activeTab.id === "tab1" && (
              <TemplateAddStep1
                formik={formik}
                setInfo={setInfo}
                setAttachmentsModalOpen={setAttachmentsModalOpen}
                setType={setType}
              />
            )}
            {activeTab.id === "tab2" && (
              <TemplateAddStep2
                formik={formik}
                setRefresh={setRefresh}
                refresh={refresh}
                setAttachmentsModalOpen={setAttachmentsModalOpen}
                setType={setType}
                setInfo={setInfo}
              />
            )}

            <TemplateAddModalFooter
              formik={formik}
              setAddModalOpen={setAddModalOpen}
              isSubmitting={isSubmitting}
            />
            {attachmentsModalOpen && (
              <AttachmentsModal
                formik={formik}
                setAttachmentsModalOpen={setAttachmentsModalOpen}
                type={type}
                info={info}
              />
            )}
          </div>
        </div>
      </div>
      {isLoading && <ListLoading />}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { TemplateAddModal };
