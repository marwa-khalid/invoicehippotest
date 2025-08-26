import { DiscountHeader } from "./header/DiscountHeader";
import { DiscountMarginsList } from "./search-list/DiscountMarginsList";
import { DiscountAddModal } from "./discount-add-modal/DiscountAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useState } from "react";
import { DiscountToolbar } from "./header/DiscountToolbar";
import { DiscountEditModal } from "./discount-edit-modal/DiscountEditModal";
import { DiscountDeleteModal } from "./discount-delete-modal/DiscountDeleteModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const DiscountMarginsInnerWrapper = () => {
  const moduleKey = "discounts-module";
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
        searchTerm={searchTermState}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />

      <DiscountToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        deleteSelectedButton={deleteSelectedButton}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <DiscountMarginsList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDiscountMarginTitle={setDiscountMarginTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
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
