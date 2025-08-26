// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils";
import { TemplateToolbar } from "./header/TemplateToolbar";
import { TemplateHeader } from "./header/TemplateHeader";
import { TemplateList } from "./search-list/TemplateList";
import { TemplateListModel } from "./core/_models";
import { TemplateAddModal } from "./template-add-modal/TemplateAddModal";
import { TemplateDeleteModal } from "./template-delete-modal/TemplateDeleteModal";
import { useEffect, useState } from "react";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar/ToolbarWrapper";
import { Content } from "../../../../_metronic/layout/components/content/Content";
import { TemplatePublishModal } from "./template-publish-modal/TemplatePublishModal";
import { SubscriberPicker } from "../../generic/SubscriberPicker";

const TemplatesInnerWrapper = () => {
  const moduleKey = "template-module";
  let filters = getPaginationModule(moduleKey);
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters?.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters?.searchTerm || ""
  );
  const [subscriberIdForFilter, setSubscriberIdForFilter] = useState(
    filters?.subscriberFilter || null
  );
  const [statusType, setStatusType] = useState(filters?.statusType || 0);
  const [tempSubscriberId, setTempSubscriberId] = useState(
    subscriberIdForFilter || null
  );
  const [showSubscriberSearch, setShowSubscriberSearch] =
    useState<boolean>(false);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [translationKey, setTranslationKey] = useState<string>("");
  const [templates, setTemplates] = useState<TemplateListModel>();
  const [publishModalOpen, setPublishModalOpen] = useState<boolean>(false);
  const [subscriberName, setSubscriberName] = useState<string>("");
  const handleSearchModalClose = () => {
    const storedSubscriber = JSON.parse(
      localStorage.getItem("storedSubscriberForTemplate")!
    );

    if (storedSubscriber) {
      setTempSubscriberId(storedSubscriber.id);
      setSubscriberName(storedSubscriber.billingContact);
    }
    setShowSubscriberSearch(false);
  };

  useEffect(() => {
    localStorage.removeItem("subscriberResponse");
  }, [addModalOpen]);
  return (
    <>
      <TemplateHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setSearchCounter={setSearchCounter}
        setPageIndexState={setPageIndexState}
        setShowSubscriberSearch={setShowSubscriberSearch}
        setStatusType={setStatusType}
        setSubscriberIdForFilter={setSubscriberIdForFilter}
        setSubscriberName={setSubscriberName}
        setTempSubscriberId={setTempSubscriberId}
        statusType={statusType}
        subscriberIdForFilter={subscriberIdForFilter}
        subscriberName={subscriberName}
        tempSubscriberId={tempSubscriberId}
      />
      <TemplateToolbar
        totalRows={totalRows}
        setEditModalId={setEditModalId}
        setAddModalOpen={setAddModalOpen}
      />
      <TemplateList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        setTotalRows={setTotalRows}
        setEditModalId={setEditModalId}
        setAddModalOpen={setAddModalOpen}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        templates={templates}
        setTemplates={setTemplates}
        setDeleteModalOpen={setDeleteModalOpen}
        setTranslationKey={setTranslationKey}
        setPublishModalOpen={setPublishModalOpen}
        statusType={statusType}
        subscriberIdForFilter={subscriberIdForFilter}
      />
      {addModalOpen && (
        <TemplateAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
        />
      )}
      {deleteModalOpen && (
        <TemplateDeleteModal
          refresh={refresh}
          setRefresh={setRefresh}
          deleteModalId={editModalId}
          setDeleteModalOpen={setDeleteModalOpen}
          translationKey={translationKey}
        />
      )}
      {publishModalOpen && (
        <TemplatePublishModal
          refresh={refresh}
          setRefresh={setRefresh}
          deleteModalId={editModalId}
          setDeleteModalOpen={setPublishModalOpen}
          translationKey={translationKey}
        />
      )}
      {showSubscriberSearch && (
        <SubscriberPicker
          handleClose={handleSearchModalClose}
          formik={null}
          storageName="storedSubscriberForTemplate"
        />
      )}
    </>
  );
};

const TemplatesWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <TemplatesInnerWrapper />
    </Content>
  </>
);

export { TemplatesWrapper };
