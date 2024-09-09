import { UnitTypesHeader } from "./components/header/UnitTypesHeader";
import { UnitTypesList } from "./search-list/UnitTypesList";
import { UnitTypesAddModal } from "./unittypes-add-modal/UnitTypesAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { UnitTypesToolbar } from "./components/header/UnitTypesToolbar";
import { UnitTypesEditModal } from "./unittypes-edit-modal/UnitTypesEditModal";
import { UnitTypesDeleteModal } from "./unittypes-delete-modal/UnitTypesDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentPage = pagination["unit-types-module"].pageIndex || 1;
    const searchTerm = pagination["unit-types-module"].filters.searchTerm || "";

    return {
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { pageIndex: 1, searchTerm: "" };
};
const UnitTypesListInnerWrapper = () => {
  const { pageIndex, searchTerm } = getPaginationValues();
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
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
        searchTerm={searchTerm}
        setSearchCounter={setSearchCounter}
      />

      <UnitTypesToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        deleteSelectedButton={deleteSelectedButton}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <UnitTypesList
        searchCounter={searchCounter}
        searchTerm={searchTerm}
        setDeleteSelectedButton={setDeleteSelectedButton}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDeleteModalId={setDeleteModalId}
        setUnitTypeTitle={setUnitTypeTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
        deleteModalId={deleteModalId}
        addModalOpen={addModalOpen}
      />

      {addModalOpen && (
        <UnitTypesAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      {editModalOpen && (
        <UnitTypesEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <UnitTypesDeleteModal
          deleteModalId={deleteModalId}
          setDeleteModalId={setDeleteModalId}
          unitTypeTitle={unitTypeTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
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
