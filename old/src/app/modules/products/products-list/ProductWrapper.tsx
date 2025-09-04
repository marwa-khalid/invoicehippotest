import { ProductsHeader } from "./header/ProductsHeader";
import { ProductList } from "./search-list/ProductList";
import { ProductAddModal } from "./product-add-modal/ProductAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useState } from "react";
import { ProductsToolbar } from "./header/ProductsToolbar";
import { ProductDeleteModal } from "./product-delete-modal/ProductDeleteModal";
import { ClientSearch } from "../../generic/ClientSearch";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const ProductInnerWrapper = () => {
  const moduleKey = "products-module";
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
  const [refresh, setRefresh] = useState<boolean>(false);
  const [searchCounter, setSearchCounter] = useState(0);
  const [clientName, setClientName] = useState<string>("");
  const [productGroupId, setProductGroupId] = useState<number | null>(
    filters.productGroupId || null
  );

  const [clientIdForFilter, setClientIdForFilter] = useState<number | null>(
    filters.clientFilter || null
  );
  const [tempClientId, setTempClientId] = useState<number | null>(
    clientIdForFilter
  );

  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const itemm = JSON.parse(localStorage.getItem("storedClientForProduct")!);

  const handleClientModalClose = () => {
    const storedClient = JSON.parse(
      localStorage.getItem("storedClientForProduct")!
    );

    if (storedClient) {
      setTempClientId(storedClient.id);
      setClientName(storedClient.displayName);
    }
    setShowClientSearch(false); // Close the modal
  };

  const resetClient = () => {
    setTempClientId(null);
    setClientName("");
    setClientIdForFilter(null);
    localStorage.removeItem("storedClientForProduct");
  };

  return (
    <>
      <ProductsHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setProductGroupId={setProductGroupId}
        productGroupId={productGroupId}
        setClientIdForFilter={setClientIdForFilter}
        clientIdForFilter={clientIdForFilter}
        setSearchCounter={setSearchCounter}
        clientName={clientName}
        setClientName={setClientName}
        tempClientId={tempClientId}
        setTempClientId={setTempClientId}
        setPageIndexState={setPageIndexState}
        resetClient={resetClient}
      />

      <ProductsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setEditModalId={setEditModalId}
      />

      <ProductList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        productGroupId={productGroupId}
        clientId={clientIdForFilter}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        addModalOpen={addModalOpen}
        deleteModalOpen={deleteModalOpen}
        deleteModalId={deleteModalId}
        setDeleteSelectedButton={setDeleteSelectedButton}
        setDeleteModalId={setDeleteModalId}
      />

      {showClientSearch && (
        <ClientSearch
          handleClose={handleClientModalClose}
          formik={null}
          storageName="storedClientForProduct"
        />
      )}

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
