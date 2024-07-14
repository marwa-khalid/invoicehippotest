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

    const currentMainFilter =
      pagination["ledger-module"].filters.ledgerTypeFilter || 0;
    const currentSubTypeFilter =
      pagination["ledger-module"].filters.bearingTypeFilter || 0;

    const currentPage = pagination["ledger-module"].pageIndex || 1;
    const searchTerm = pagination["ledger-module"].filters.searchTerm || "";

    return {
      mainfilter: currentMainFilter,
      subTypeFilter: currentSubTypeFilter,
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { mainfilter: 0, subTypeFilter: 0, pageIndex: 1, searchTerm: "" };
};
const LedgerListInnerWrapper = () => {
  const { itemIdForUpdate } = useListView();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { mainfilter, subTypeFilter, pageIndex, searchTerm } =
    getPaginationValues();

  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<number>(mainfilter);
  const [bearingTypeFilter, setBearingTypeFilter] =
    useState<number>(subTypeFilter);
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  useEffect(() => {
    if (mainfilter !== 0) {
      setIsFilterApplied(true);
    }
  }, [mainfilter]);

  const [totalRows, setTotalRows] = useState(0);
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
        setLedgerTypeFilter={setLedgerTypeFilter}
        ledgerTypeFilter={ledgerTypeFilter}
        setBearingTypeFilter={setBearingTypeFilter}
        bearingTypeFilter={bearingTypeFilter}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
      />

      <VatListToolbar totalRows={totalRows} />

      <VatTypesList
        searchTerm={searchTerm}
        ledgerTypeFilter={ledgerTypeFilter}
        bearingTypeFilter={bearingTypeFilter}
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

const LedgerListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          {/* <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}> */}
          <LedgerListInnerWrapper />
          {/* </div> */}
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { LedgerListWrapper };
