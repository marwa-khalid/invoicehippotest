import { ProductGroupsHeader } from "./components/header/ProductGroupsHeader";
import { ProductGroupsList } from "./search-list/ProductGroupsList";
import { ProductGroupsAddModal } from "./productgroups-add-modal/ProductGroupsAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { ProductGroupsToolbar } from "./components/header/ProductGroupsToolbar";
import { ProductGroupsDeleteModal } from "./productgroups-delete-modal/ProductGroupsDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentPage = pagination["productgroups-module"].pageIndex || 1;
    const searchTerm =
      pagination["productgroups-module"].filters.searchTerm || "";

    return {
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { pageIndex: 1, searchTerm: "" };
};
const ProductGroupsInnerWrapper = () => {
  const { pageIndex, searchTerm } = getPaginationValues();
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  const [deleteSelectedButton, setDeleteSelectedButton] =
    useState<boolean>(false);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productGroupTitle, setProductGroupTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [searchCounter, setSearchCounter] = useState(0);
  return (
    <>
      <ProductGroupsHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setSearchCounter={setSearchCounter}
      />

      <ProductGroupsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setEditModalId={setEditModalId}
        deleteSelectedButton={deleteSelectedButton}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <ProductGroupsList
        searchCounter={searchCounter}
        searchTerm={searchTerm}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setProductGroupTitle={setProductGroupTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        addModalOpen={addModalOpen}
        deleteModalOpen={deleteModalOpen}
        deleteModalId={deleteModalId}
        setDeleteSelectedButton={setDeleteSelectedButton}
        setDeleteModalId={setDeleteModalId}
      />

      {addModalOpen && (
        <ProductGroupsAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          editModalId={editModalId}
        />
      )}

      {deleteModalOpen && (
        <ProductGroupsDeleteModal
          deleteModalId={deleteModalId}
          productGroupTitle={productGroupTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          setDeleteModalId={setDeleteModalId}
        />
      )}
    </>
  );
};

const ProductGroupsWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <ProductGroupsInnerWrapper />
    </Content>
  </>
);

export { ProductGroupsWrapper };
