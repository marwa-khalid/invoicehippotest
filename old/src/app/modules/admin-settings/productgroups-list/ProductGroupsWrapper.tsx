import { ProductGroupsHeader } from "./header/ProductGroupsHeader";
import { ProductGroupsList } from "./search-list/ProductGroupsList";
import { ProductGroupsAddModal } from "./productgroups-add-modal/ProductGroupsAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useState } from "react";
import { ProductGroupsToolbar } from "./header/ProductGroupsToolbar";
import { ProductGroupsDeleteModal } from "./productgroups-delete-modal/ProductGroupsDeleteModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const ProductGroupsInnerWrapper = () => {
  const moduleKey = "productgroups-module";
  let filters = getPaginationModule(moduleKey);

  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
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
  const closeAddModal = () => {
    setAddModalOpen(false);
  };
  return (
    <>
      <ProductGroupsHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
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
        searchTerm={searchTermState}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setProductGroupTitle={setProductGroupTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
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
          setAddModalOpen={closeAddModal}
          editModalId={editModalId}
          refresh={refresh}
        />
      )}

      {deleteModalOpen && (
        <ProductGroupsDeleteModal
          deleteModalId={deleteModalId}
          productGroupTitle={productGroupTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          setDeleteModalId={setDeleteModalId}
          refresh={refresh}
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
