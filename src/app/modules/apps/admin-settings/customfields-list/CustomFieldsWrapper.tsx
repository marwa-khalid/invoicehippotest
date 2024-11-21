import { CustomFieldsHeader } from "./components/header/CustomFieldsHeader";
import { CustomFieldsList } from "./search-list/CustomFieldsList";
import { CustomFieldsAddModal } from "./customfields-add-modal/CustomFieldsAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { CustomFieldsToolbar } from "./components/header/CustomFieldsToolbar";
import { CustomFieldsDeleteModal } from "./customfields-delete-modal/CustomFieldsDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination");

  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);
    const fieldType =
      pagination["customfields-module"].filters.fieldTypeFilter || 0;
    const areaType =
      pagination["customfields-module"].filters.areaTypeFilter || 0;

    const currentPage = pagination["customfields-module"].pageIndex || 1;
    const searchTerm =
      pagination["customfields-module"].filters.searchTerm || "";

    return {
      fieldType,
      areaType,
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return {
    fieldType: 0,
    areaType: 0,
    pageIndex: 1,
    searchTerm: "",
  };
};
const CustomFieldsInnerWrapper = () => {
  const { fieldType, areaType, pageIndex, searchTerm } = getPaginationValues();
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  const [fieldTypeFilter, setFieldTypeFilter] = useState<number>(fieldType);
  const [areaTypeFilter, setAreaTypeFilter] = useState<number>(areaType);
  const [searchCounter, setSearchCounter] = useState(0);
  const [deleteSelectedButton, setDeleteSelectedButton] =
    useState<boolean>(false);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([]);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [discountMarginTitle, setDiscountMarginTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  useEffect(() => {
    if (fieldType !== 0) {
      setIsFilterApplied(true);
    }
  }, [fieldType]);
  return (
    <>
      <CustomFieldsHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setFieldTypeFilter={setFieldTypeFilter}
        setAreaTypeFilter={setAreaTypeFilter}
        areaTypeFilter={areaTypeFilter}
        fieldTypeFilter={fieldTypeFilter}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
        setSearchCounter={setSearchCounter}
      />

      <CustomFieldsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        deleteSelectedButton={deleteSelectedButton}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <CustomFieldsList
        searchTerm={searchTerm}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDiscountMarginTitle={setDiscountMarginTitle}
        refresh={refresh}
        pageIndex={pageIndex}
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
