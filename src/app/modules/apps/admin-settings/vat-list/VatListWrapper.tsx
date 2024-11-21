import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { VatListHeader } from "./components/header/VatListHeader";
import { VatTypesList } from "./list/VatTypesList";
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

    const currentPage = pagination["vat-module"]?.pageIndex || 1;
    const searchTerm = pagination["vat-module"].filters.searchTerm || "";

    return {
      filter: currentFilter,
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { filter: 0, pageIndex: 1, searchTerm: "" };
};
const VatListInnerWrapper = () => {
  const { itemIdForUpdate } = useListView();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { filter, pageIndex, searchTerm } = getPaginationValues();
  const [searchCounter, setSearchCounter] = useState(0);
  const [vatAreaUsageTypeFilter, setVatAreaUsageTypeFilter] =
    useState<number>(filter);
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  useEffect(() => {
    if (filter !== 0) {
      setIsFilterApplied(true);
    }
  }, [filter]);

  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [vatTitle, setVatTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <VatListHeader
        setSearchCounter={setSearchCounter}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
        vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
      />

      <VatListToolbar totalRows={totalRows} />

      <VatTypesList
        searchCounter={searchCounter}
        searchTerm={searchTerm}
        vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setVatTitle={setVatTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
      />

      {itemIdForUpdate !== undefined && (
        <VatAddModal setRefresh={setRefresh} refresh={refresh} />
      )}
      {editModalOpen && (
        <VatEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          refresh={refresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <VatDeleteModal
          deleteModalId={editModalId}
          vatTitle={vatTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
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
          <VatListInnerWrapper />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { VatListWrapper };
