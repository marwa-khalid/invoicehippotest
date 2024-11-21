import { ProductGroupsHeader } from "./components/header/ProductGroupsHeader";
import { ProductList } from "./search-list/ProductList";
import { ProductAddModal } from "./product-add-modal/ProductAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { ProductGroupsToolbar } from "./components/header/ProductGroupsToolbar";
import { ProductDeleteModal } from "./product-delete-modal/ProductDeleteModal";

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
const ProductInnerWrapper = () => {
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

      <ProductList
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
        <ProductAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          editModalId={editModalId}
          refresh={refresh}
          setEditModalId={setEditModalId}
        />
      )}

      {deleteModalOpen && (
        <ProductDeleteModal
          deleteModalId={deleteModalId}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          setDeleteModalId={setDeleteModalId}
          refresh={refresh}
        />
      )}
    </>
  );
};

const ProductWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <ProductInnerWrapper />
    </Content>
  </>
);

export { ProductWrapper };
