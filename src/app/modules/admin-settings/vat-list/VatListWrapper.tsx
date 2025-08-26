import { VatListHeader } from "./header/VatListHeader";
import { VatTypesList } from "./search-list/VatTypesList";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { VatListToolbar } from "./header/VatListToolbar";
import { VatAddModal } from "./vat-add-modal/VatAddModal";
import { VatDeleteModal } from "./vat-delete-modal/VatDeleteModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const VatListInnerWrapper = () => {
  const moduleKey = "vat-module";
  let filters = getPaginationModule(moduleKey);

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [searchCounter, setSearchCounter] = useState(0);
  const [vatAreaUsageTypeFilter, setVatAreaUsageTypeFilter] = useState<number>(
    filters.documentGroup
  );
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex
  );
  const [searchTermState, setSearchTermState] = useState(filters.searchTerm);
  useEffect(() => {
    if (filters.documentGroup && filters.documentGroup !== 0) {
      setIsFilterApplied(true);
    }
  }, [filters.documentGroup]);

  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [vatTitle, setVatTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <VatListHeader
        setSearchCounter={setSearchCounter}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
        vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
        setPageIndex={setPageIndexState}
      />

      <VatListToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setEditModalId={setEditModalId}
      />

      <VatTypesList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setVatTitle={setVatTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
      />

      {addModalOpen && (
        <VatAddModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
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
  <>
    <ToolbarWrapper />
    <Content>
      <VatListInnerWrapper />
    </Content>
  </>
);

export { VatListWrapper };
