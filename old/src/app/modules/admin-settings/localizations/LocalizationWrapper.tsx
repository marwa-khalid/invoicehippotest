// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";
import { LocalizationToolbar } from "./header/LocalizationToolbar";
import { LocalizationHeader } from "./header/LocalizationHeader";
import { LocalizationList } from "./search-list/LocalizationList";
import { LocalizationModel } from "./core/_models";
import { LocalizationAddModal } from "./localization-add-modal/LocalizationAddModal";
import { LocalizationDeleteModal } from "./localization-delete-modal/LocalizationDeleteModal";
import { useState } from "react";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar/ToolbarWrapper";
import { Content } from "../../../../_metronic/layout/components/content";

const LocalizationInnerWrapper = () => {
  const moduleKey = "localization-module";
  let filters = getPaginationModule(moduleKey);
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters?.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters?.searchTerm || ""
  );

  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [translationKey, setTranslationKey] = useState<string>("");
  const [localizations, setLocalizations] = useState<LocalizationModel>();

  return (
    <>
      <LocalizationHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setSearchCounter={setSearchCounter}
        setPageIndexState={setPageIndexState}
      />
      <LocalizationToolbar
        totalRows={totalRows}
        setEditModalId={setEditModalId}
        setAddModalOpen={setAddModalOpen}
      />
      <LocalizationList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        setTotalRows={setTotalRows}
        setRefresh={setRefresh}
        setEditModalId={setEditModalId}
        setAddModalOpen={setAddModalOpen}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        localizations={localizations}
        setLocalizations={setLocalizations}
        setDeleteModalOpen={setDeleteModalOpen}
        setTranslationKey={setTranslationKey}
      />
      {addModalOpen && (
        <LocalizationAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
        />
      )}
      {deleteModalOpen && (
        <LocalizationDeleteModal
          refresh={refresh}
          setRefresh={setRefresh}
          deleteModalId={editModalId}
          setDeleteModalOpen={setDeleteModalOpen}
          translationKey={translationKey}
        />
      )}
    </>
  );
};

const LocalizationWrapper = ({ isModal }: { isModal?: boolean }) => (
  <>
    {!isModal && <ToolbarWrapper />}
    <Content>
      <LocalizationInnerWrapper />
    </Content>
  </>
);

export { LocalizationWrapper };
