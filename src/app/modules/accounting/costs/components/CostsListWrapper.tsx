import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { ViewCanvas } from "../../../generic/ViewCanvas";
import { ClientSearch } from "../../../generic/ClientSearch";
import { toast } from "react-toastify";
// @ts-ignore
import { getPaginationModule } from "../../../../helpers/paginationUtils.js";
import { AttachmentsResult } from "../../bookings/components/core/_models";
import { attachCostFile, getAttachmentsForCost } from "./core/_requests";
import { useIntl } from "react-intl";
import { AttachmentsModal } from "../../../generic/FileManager/AttachmentsModal";
import { handleToast } from "../../../auth/core/_toast";
import { CostList } from "./search-list/CostList";
import { CostAddModal } from "./cost-add-modal/CostAddModal";
import { CostDeleteModal } from "./cost-delete-modal/CostDeleteModal";
import { CostToolbar } from "./header/CostToolbar";
import { CostHeader } from "./header/CostHeader";
const CostsListInnerWrapper = ({
  isModal,
  setCostId,
}: {
  isModal?: boolean;
  setCostId?: (type: number) => void;
}) => {
  const intl = useIntl();
  const moduleKey = "cost-module";
  let filters = getPaginationModule(moduleKey);
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters?.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters?.searchTerm || ""
  );

  const [periodValueType, setPeriodValueType] = useState<number | null>(
    filters?.periodType || null
  );
  const [statusTypes, setStatusTypes] = useState<any>(filters?.status || []);

  const [clientIdForFilter, setClientIdForFilter] = useState<number | null>(
    filters?.clientFilter || null
  );
  const [tempClientId, setTempClientId] = useState<number | null>(
    clientIdForFilter || null
  );
  const [attachmentType, setAttachmentType] = useState<number>(
    filters?.attachmentTypeFilter || 0
  );

  const [paymentSourceType, setPaymentSourceType] = useState<number>(
    filters?.paymentSourceTypeFilter || 0
  );
  const [year, setYear] = useState<number | null>(filters?.yearFilter || null);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [invoiceNr, setInvoiceNr] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [clientName, setClientName] = useState<string>("");

  const [key, setKey] = useState(1);
  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  const handleClientModalClose = () => {
    const storedClient = JSON.parse(
      localStorage.getItem("storedClientForCost")!
    );

    if (storedClient) {
      setTempClientId(storedClient.id);
      setClientName(storedClient.displayName);
    }
    setShowClientSearch(false);
  };

  useEffect(() => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
  }, [addModalOpen]);

  const [attachments, setAttachments] = useState<
    Record<number, AttachmentsResult[]>
  >({});
  const fetchAttachments = async (id: number) => {
    const response = await getAttachmentsForCost(id);
    if (response.isValid && response.result.length > 0) {
      setAttachments((prev) => ({
        ...prev,
        [id]: response.result,
      }));
    }
  };
  const attachFile = async (attachment: any) => {
    try {
      if (
        Object.entries(attachments).length > 0 &&
        attachments[attachment.fileId].length === 5
      ) {
        toast.warning(
          intl.formatMessage({
            id: "System.AccessValidation_MaxAttachmentUploadOnCommon",
          })
        );
      } else {
        const response = await attachCostFile(
          attachment.inboxItemId,
          attachment.fileId,
          editModalId
        );
        if (response.isValid) {
          fetchAttachments(editModalId);
          handleToast(response);
        }
      }
    } catch (error) {
      return;
    }
  };

  return (
    <>
      <CostHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        setStatusTypes={setStatusTypes}
        statusTypes={statusTypes}
        searchTerm={searchTermState}
        setPeriodValueType={setPeriodValueType}
        periodValueType={periodValueType}
        attachmentType={attachmentType}
        setAttachmentType={setAttachmentType}
        setPaymentSourceType={setPaymentSourceType}
        paymentSourceType={paymentSourceType}
        setClientIdForFilter={setClientIdForFilter}
        clientIdForFilter={clientIdForFilter}
        setSearchCounter={setSearchCounter}
        year={year}
        setYear={setYear}
        clientName={clientName}
        setClientName={setClientName}
        tempClientId={tempClientId}
        setTempClientId={setTempClientId}
        setPageIndexState={setPageIndexState}
      />
      {!isModal && (
        <CostToolbar
          totalRows={totalRows}
          setAddModalOpen={setAddModalOpen}
          setEditModalId={setEditModalId}
        />
      )}
      <CostList
        searchCounter={searchCounter}
        year={year}
        searchTerm={searchTermState}
        periodValueType={periodValueType}
        statusTypes={statusTypes}
        attachmentType={attachmentType}
        paymentSourceType={paymentSourceType}
        clientIdForFilter={clientIdForFilter}
        setTotalRows={setTotalRows}
        setDownloadUrl={setDownloadUrl}
        setKey={setKey}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setInvoiceNr={setInvoiceNr}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        setAttachmentsModalOpen={setAttachmentsModalOpen}
        isModal={isModal}
        setCostId={setCostId}
        attachments={attachments}
        fetchAttachments={fetchAttachments}
      />
      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />

      {addModalOpen && (
        <CostAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          hasMutation={false}
        />
      )}

      {deleteModalOpen && (
        <CostDeleteModal
          deleteModalId={editModalId}
          invoiceNr={invoiceNr}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {showClientSearch && (
        <ClientSearch
          handleClose={handleClientModalClose}
          formik={null}
          storageName="storedClientForCost"
        />
      )}

      {attachmentsModalOpen && (
        <AttachmentsModal
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          type="separate"
          attachFile={attachFile}
          separateAttachments={attachments}
          info="Fields.InboxUploadModuleInfo"
        />
      )}
    </>
  );
};

const CostsListWrapper = ({
  isModal,
  setCostId,
}: {
  isModal?: boolean;
  setCostId?: (type: number) => void;
}) => (
  <>
    {!isModal && <ToolbarWrapper />}
    <Content>
      <CostsListInnerWrapper isModal={isModal} setCostId={setCostId} />
    </Content>
  </>
);

export { CostsListWrapper };
