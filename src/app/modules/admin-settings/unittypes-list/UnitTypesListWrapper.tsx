import { UnitTypesHeader } from "./header/UnitTypesHeader";
import { UnitTypesList } from "./search-list/UnitTypesList";
import { UnitTypesAddModal } from "./unittypes-add-modal/UnitTypesAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useState } from "react";
import { UnitTypesToolbar } from "./header/UnitTypesToolbar";
import { UnitTypesEditModal } from "./unittypes-edit-modal/UnitTypesEditModal";
import { UnitTypesDeleteModal } from "./unittypes-delete-modal/UnitTypesDeleteModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const UnitTypesListInnerWrapper = () => {
  const moduleKey = "unit-types-module";
  let filters = getPaginationModule(moduleKey);

  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([]);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [unitTypeTitle, setUnitTypeTitle] = useState<string>("");
  const [deleteSelectedButton, setDeleteSelectedButton] =
    useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <UnitTypesHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />

      <UnitTypesToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        deleteSelectedButton={deleteSelectedButton}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <UnitTypesList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        setDeleteSelectedButton={setDeleteSelectedButton}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDeleteModalId={setDeleteModalId}
        setUnitTypeTitle={setUnitTypeTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        deleteModalId={deleteModalId}
      />

      {addModalOpen && (
        <UnitTypesAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
        />
      )}
      {editModalOpen && (
        <UnitTypesEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
          refresh={refresh}
        />
      )}
      {deleteModalOpen && (
        <UnitTypesDeleteModal
          deleteModalId={deleteModalId}
          setDeleteModalId={setDeleteModalId}
          unitTypeTitle={unitTypeTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </>
  );
};

const UnitTypesListWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <UnitTypesListInnerWrapper />
    </Content>
  </>
);

export { UnitTypesListWrapper };
