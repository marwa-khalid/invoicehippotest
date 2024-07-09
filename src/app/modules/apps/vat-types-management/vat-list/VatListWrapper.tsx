import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { VatListHeader } from "./components/header/VatListHeader";
import { VatTypesList } from "./table/VatTypesList";
import { VatAddModal } from "./vat-add-modal/VatAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { VatListToolbar } from "./components/header/VatListToolbar";
import { VatEditModal } from "./vat-edit-modal/VatEditModal";
import { VatDeleteModal } from "./vat-delete-modal/VatDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentFilter = pagination["vat-module"].filters.documentGroup || 0;

    const currentPage = pagination["vat-module"].pageIndex || 1;
    const searchTerm = pagination["vat-module"].filters.searchTerm || "";
 
    return {
      filter: currentFilter,
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { filter: 1, pageIndex: 1, searchTerm: "" };
};
const VatListInnerWrapper = () => {
  const { itemIdForUpdate } = useListView();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { filter, pageIndex, searchTerm } = getPaginationValues();

  const [vatAreaUsageTypeFilter, setVatAreaUsageTypeFilter] =
    useState<number>(filter);
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  useEffect(() => {
    if (filter !== 0) {
      setIsFilterApplied(true);
    }
  }, [filter]);


  const [currentRows, setCurrentRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [vatTitle, setVatTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <VatListHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
        vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
      />

      <VatListToolbar currentRows={currentRows} />

      <VatTypesList
        searchTerm={searchTerm}
        vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
        setCurrentRows={setCurrentRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setVatTitle={setVatTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
      />

      {itemIdForUpdate !== undefined && <VatAddModal setRefresh={setRefresh} />}
      {editModalOpen && (
        <VatEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <VatDeleteModal
          deleteModalId={editModalId}
          vatTitle={vatTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
};

const VatListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          {/* <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}> */}
          <VatListInnerWrapper />
          {/* </div> */}
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { VatListWrapper };
