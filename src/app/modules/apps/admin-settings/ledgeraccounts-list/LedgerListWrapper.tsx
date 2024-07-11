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
import { BalanceItem, LedgerAccountsForFilterResult } from "./core/_models";
import { getLedgerAccountsForFilter } from "./core/_requests";
interface GroupedOption {
  label: string;
  options: { value: number; label: string }[];
}
const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentFilter =
      pagination["ledger-module"].filters.documentGroup || 0;

    const currentPage = pagination["ledger-module"].pageIndex || 1;
    const searchTerm = pagination["ledger-module"].filters.searchTerm || "";

    return {
      filter: currentFilter,
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { filter: 0, pageIndex: 1, searchTerm: "" };
};
const LedgerListInnerWrapper = () => {
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

  const [ledgerAccountsForFilter, setLedgerAccountsForFilter] = useState<
    GroupedOption[]
  >([]);

  useEffect(() => {
    const fetchLedgerAccounts = async () => {
      try {
        // Fetch data from API
        const res = await getLedgerAccountsForFilter();
        const response = res.result;
        // Function to map BalanceItem to the required format
        const mapBalanceItemToOption = (
          item: BalanceItem
        ): { value: number; label: string } => ({
          value: item.id,
          label: item.bearingType.description,
        });

        // Function to group items by ledgerSubType
        const groupItemsByLedgerSubType = (
          items: BalanceItem[]
        ): Map<string, BalanceItem[]> => {
          const groupedItems = new Map<string, BalanceItem[]>();
          items.forEach((item) => {
            const key = `${item.ledgerSubType.description}`;
            if (!groupedItems.has(key)) {
              groupedItems.set(key, []);
            }
            groupedItems.get(key)?.push(item);
          });

          return groupedItems;
        };

        // Function to map group data to the required format
        const mapGroupedOptions = (
          items: BalanceItem[],
          groupTitle: string
        ): GroupedOption[] => {
          const groupedItems = groupItemsByLedgerSubType(items);
          return Array.from(groupedItems.entries()).map(
            ([ledgerSubTypeDesc, items]) => ({
              label: `${groupTitle} - ${ledgerSubTypeDesc}`,
              options: items.map((item) => mapBalanceItemToOption(item)),
            })
          );
        };

        // Map data to grouped options
        const groupedOptions: GroupedOption[] = [
          ...mapGroupedOptions(
            response.balanceActivaItems,
            response.balanceActivaItemsGroupTitle
          ),
          ...mapGroupedOptions(
            response.balancePassivaItems,
            response.balancePassivaItemsGroupTitle
          ),
          ...mapGroupedOptions(
            response.resultItems,
            response.resultItemsGroupTitle
          ),
        ];

        // Set state with grouped options
        setLedgerAccountsForFilter(groupedOptions);
      } catch (error) {
        console.error("Error fetching ledger accounts:", error);
        // Handle errors as needed
      }
    };

    fetchLedgerAccounts();
  }, []);

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
        ledgerAccountsForFilter={ledgerAccountsForFilter}
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
