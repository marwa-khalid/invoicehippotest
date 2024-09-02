import { CustomFieldsHeader } from "./components/header/CustomFieldsHeader";
import { DiscountMarginsList } from "./search-list/DiscountMarginsList";
import { DiscountAddModal } from "./discount-add-modal/DiscountAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { CustomFieldsToolbar } from "./components/header/CustomFieldsToolbar";
import { DiscountEditModal } from "./discount-edit-modal/DiscountEditModal";
import { DiscountDeleteModal } from "./discount-delete-modal/DiscountDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentPage = pagination["discounts-module"].pageIndex || 1;
    const searchTerm = pagination["discounts-module"].filters.searchTerm || "";

    return {
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { pageIndex: 1, searchTerm: "" };
};
const DiscountMarginsInnerWrapper = () => {
  const { pageIndex, searchTerm } = getPaginationValues();
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
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

  return (
    <>
      <CustomFieldsHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
      />

      <CustomFieldsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        deleteSelectedButton={deleteSelectedButton}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <DiscountMarginsList
        searchTerm={searchTerm}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDiscountMarginTitle={setDiscountMarginTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
        deleteModalId={deleteModalId}
        setDeleteSelectedButton={setDeleteSelectedButton}
        setDeleteModalId={setDeleteModalId}
      />

      {addModalOpen && (
        <DiscountAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      {editModalOpen && (
        <DiscountEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <DiscountDeleteModal
          deleteModalId={deleteModalId}
          discountMarginTitle={discountMarginTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
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
      <DiscountMarginsInnerWrapper />
    </Content>
  </>
);

export { CustomFieldsWrapper };
