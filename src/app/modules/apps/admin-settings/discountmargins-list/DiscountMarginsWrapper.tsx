import { DiscountHeader } from "./components/header/DiscountHeader";
import { DiscountMarginsList } from "./search-list/DiscountMarginsList";
import { DiscountAddModal } from "./discount-add-modal/DiscountAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { DiscountToolbar } from "./components/header/DiscountToolbar";
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
  const [searchCounter, setSearchCounter] = useState(0);

  return (
    <>
      <DiscountHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setSearchCounter={setSearchCounter}
      />

      <DiscountToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        deleteSelectedButton={deleteSelectedButton}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <DiscountMarginsList
        searchCounter={searchCounter}
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
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      {editModalOpen && (
        <DiscountEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          refresh={refresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <DiscountDeleteModal
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

const DiscountMarginsWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <DiscountMarginsInnerWrapper />
    </Content>
  </>
);

export { DiscountMarginsWrapper };
