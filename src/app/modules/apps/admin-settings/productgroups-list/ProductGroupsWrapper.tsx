import { ProductGroupsHeader } from "./components/header/ProductGroupsHeader";
import { ProductGroupsList } from "./search-list/ProductGroupsList";
import { ProductGroupsAddModal } from "./productgroups-add-modal/ProductGroupsAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { ProductGroupsToolbar } from "./components/header/ProductGroupsToolbar";
import { ProductGroupsEditModal } from "./productgroups-edit-modal/ProductGroupsEditModal";
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

  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productGroupTitle, setProductGroupTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <ProductGroupsHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
      />

      <ProductGroupsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
      />

      <ProductGroupsList
        searchTerm={searchTerm}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setProductGroupTitle={setProductGroupTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
      />

      {addModalOpen && (
        <ProductGroupsAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      {editModalOpen && (
        <ProductGroupsEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <ProductGroupsDeleteModal
          deleteModalId={editModalId}
          productGroupTitle={productGroupTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
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
