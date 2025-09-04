import { CustomFieldsHeader } from "./header/CustomFieldsHeader";
import { CustomFieldsList } from "./search-list/CustomFieldsList";
import { CustomFieldsAddModal } from "./customfields-add-modal/CustomFieldsAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { CustomFieldsToolbar } from "./header/CustomFieldsToolbar";
import { CustomFieldsDeleteModal } from "./customfields-delete-modal/CustomFieldsDeleteModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const CustomFieldsInnerWrapper = () => {
  const moduleKey = "customfields-module";
  let filters = getPaginationModule(moduleKey);

  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
  const [fieldTypeFilter, setFieldTypeFilter] = useState<number>(
    filters.fieldTypeFilter || 0
  );
  const [areaTypeFilter, setAreaTypeFilter] = useState<number>(
    filters.areaTypeFilter || 0
  );
  const [searchCounter, setSearchCounter] = useState<number>(0);
  const [deleteSelectedButton, setDeleteSelectedButton] =
    useState<boolean>(false);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [discountMarginTitle, setDiscountMarginTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  useEffect(() => {
    if (filters.fieldTypeFilter && filters.fieldTypeFilter !== 0) {
      setIsFilterApplied(true);
    }
  }, [filters.fieldTypeFilter]);
  return (
    <>
      <CustomFieldsHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setFieldTypeFilter={setFieldTypeFilter}
        setAreaTypeFilter={setAreaTypeFilter}
        areaTypeFilter={areaTypeFilter}
        fieldTypeFilter={fieldTypeFilter}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />

      <CustomFieldsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        deleteSelectedButton={deleteSelectedButton}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <CustomFieldsList
        searchTerm={searchTermState}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDiscountMarginTitle={setDiscountMarginTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        addModalOpen={addModalOpen}
        deleteModalOpen={deleteModalOpen}
        deleteModalId={deleteModalId}
        searchCounter={searchCounter}
        setDeleteSelectedButton={setDeleteSelectedButton}
        setDeleteModalId={setDeleteModalId}
        fieldTypeFilter={fieldTypeFilter}
        areaTypeFilter={areaTypeFilter}
      />

      {addModalOpen && (
        <CustomFieldsAddModal
          setRefresh={setRefresh}
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
          editModalId={editModalId}
          setEditModalId={setEditModalId}
        />
      )}

      {deleteModalOpen && (
        <CustomFieldsDeleteModal
          deleteModalId={deleteModalId}
          discountMarginTitle={discountMarginTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          setDeleteModalId={setDeleteModalId}
        />
      )}
    </>
  );
};

const CustomFieldsWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <CustomFieldsInnerWrapper />
    </Content>
  </>
);

export { CustomFieldsWrapper };
