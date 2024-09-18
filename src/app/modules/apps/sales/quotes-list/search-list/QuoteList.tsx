import React, { useEffect, useState } from "react";
import { QuoteListResult } from "../core/_models";
import { getQuotes } from "../core/_requests";
import { ListLoading } from "../../../components/ListLoading";
import { FinancialListPagination } from "../components/pagination/FinancialListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { KTSVG } from "../../../../../../_metronic/helpers";
import { Tooltip } from "@chakra-ui/react";
import { useAuth } from "../../../../auth";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setEditModalOpen: (type: boolean) => void;
  setUnlinkModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setQuoteNumber: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  addModalOpen: boolean;
  searchCounter: number;
}
const QuoteList = ({
  searchTerm,
  setTotalRows,
  setEditModalOpen,
  setEditModalId,
  setQuoteNumber,
  setDeleteModalOpen,
  setUnlinkModalOpen,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  editModalOpen,
  deleteModalOpen,
  addModalOpen,
}: ComponentProps) => {
  const [quoteLists, setQuoteList] = useState<any>([]);

  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();
  const fetchQuotes = async () => {
    setIsLoading(true);

    try {
      const response = await getQuotes(searchTerm, pageIndex);
      setQuoteList(response);
      console.log(response.result);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching Quote List:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchQuotes();
  };

  useEffect(() => {
    fetchQuotes();
  }, [searchTerm, pageIndex, searchCounter]);

  useEffect(() => {
    fetchQuotes();
  }, [refresh, editModalOpen, deleteModalOpen, addModalOpen]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, quoteNr: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setQuoteNumber(quoteNr);
  };

  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          quoteLists?.result?.map((quoteList: QuoteListResult) => (
            <div className="col" key={quoteList.id}>
              <div className="card h-100 pt-6 position-relative">
                {/* Ribbons */}

                <div
                  className="ribbon ribbon-end ribbon-clip position-absolute"
                  style={{
                    top: "10px",
                    right: "0px",
                    height: "30px",
                    width: "100px",
                  }}
                >
                  <div className="ribbon-label  fw-bold">
                    {quoteList.valuta.sign}{" "}
                    {quoteList.totals.totalPriceWithVAT.toFixed(2)}
                    <span className="ribbon-inner bg-primary"></span>
                  </div>
                </div>

                {/*center ribbon */}
                <div
                  className="ribbon ribbon-top ribbon-vertical position-absolute"
                  style={{
                    top: "3px",
                    width: "100px",
                    left: "50%",
                  }}
                >
                  <div
                    className="ribbon-label fw-bold"
                    style={{
                      whiteSpace: "nowrap", // Prevents text wrapping
                      overflow: "hidden", // Clips overflowing content
                      textOverflow: "ellipsis", // Adds ellipsis if the text is too long
                    }}
                  >
                    {quoteList.quoteStatus.description}
                    <span className="ribbon-inner bg-success"></span>
                  </div>
                </div>

                <div
                  className="ribbon ribbon-start ribbon-clip position-absolute"
                  style={{
                    top: "10px",
                    height: "30px",
                    width: "100px",
                  }}
                >
                  <div className="ribbon-label fw-bold">
                    {quoteList.quoteNr}
                    <span className="ribbon-inner bg-success"></span>
                  </div>
                </div>
                <div className="card-body ">
                  {/* First Row: Client Name (Left) and Amount (Right) */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    {/* Client Name on the Left */}
                    <div
                      className="d-flex flex-column"
                      onClick={() => openEditModal(quoteList.id)}
                    >
                      <strong>{quoteList.client}</strong>
                      <span className="text-muted fs-9">
                        {quoteList.clientReferenceNr}
                      </span>
                    </div>

                    {/* Current/Total Amount on the Right */}

                    <div className="d-flex flex-column text-end fs-9">
                      {/* Total Price */}
                      {quoteList.totals.totalPrice > 0 && (
                        <div className="d-flex gap-3 justify-content-end">
                          <small className="text-muted">
                            {intl.formatMessage({ id: "Fields.TotalPrice" })}
                          </small>
                          <span className="text-muted ">
                            {quoteList.valuta.sign}{" "}
                            {quoteList.totals.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {/* Total VAT Amount */}
                      {quoteList.totals.totalVATAmount > 0 && (
                        <div className="d-flex gap-3 justify-content-end">
                          <small className="text-muted">
                            {intl.formatMessage({
                              id: "Fields.TotalVATAmount",
                            })}
                          </small>
                          <span className="text-muted">
                            {quoteList.valuta.sign}{" "}
                            {quoteList.totals.totalVATAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* separator Line */}
                  <div className="separator separator-solid mb-6"></div>

                  {/* <div className="my-6 text-muted">
                      <ul className="breadcrumb breadcrumb-black breadcrumb-dot">
                        {quoteList.quoteStatus.name && (
                          <small className="bg-success rounded p-1 text-white fw-bold">
                            {quoteList.quoteStatus.description}
                          </small>
                        )}
                        {/* {quoteList.quoteStatus.description && (
                          <li className="breadcrumb-item">
                            <small className=" bg-secondary rounded p-1 text-dark fw-bold">
                              {quoteList.quoteStatus.description}
                            </small>
                          </li>
                        )} */}

                  {/* {quoteList.clientReferenceNr && (
                          <li className="breadcrumb-item">
                            <small>{quoteList.clientReferenceNr}</small>
                          </li>
                        )} */}
                  {/* </ul> */}
                  {/* </div> */}

                  <div className="d-flex flex-row flex-wrap fs-8 gap-4 mt-5">
                    {quoteList.quoteDate && (
                      <>
                        <div className="d-flex align-items-center flex-wrap">
                          <i className="ki-duotone ki-calendar fs-3x text-primary">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="d-flex flex-column mx-6">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({
                                id: "Fields.QuoteDate",
                              })}
                            </span>
                            <span className="text-primary fw-bolder">
                              {quoteList.quoteDateAsString}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    {quoteList.quoteDueDate && (
                      <>
                        <span className=" h-37px bg-gray-400 w-1px me-3 "></span>
                        <div className="d-flex align-items-center flex-wrap">
                          <i className="ki-duotone ki-calendar fs-3x text-danger">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="d-flex flex-column mx-6">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({
                                id: "Fields.InvoiceDueDate",
                              })}
                            </span>

                            <span className="text-primary fw-bolder">
                              {quoteList.quoteDueDateAsString}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    {quoteList.hasRelatedInvoice && (
                      <>
                        <span className=" h-37px bg-gray-400 w-1px me-3 "></span>
                        <div className="d-flex align-items-center flex-wrap">
                          <i className="ki-duotone ki-document fs-3x text-dark">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="d-flex flex-column mx-6">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({
                                id: "Fields.InvoiceNr",
                              })}
                            </span>

                            <span className="text-primary fw-bolder">
                              {quoteList.relatedInvoice.invoiceNr}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="d-flex w-100 justify-content-end ">
                      {quoteList.actions.canEdit && (
                        <Tooltip
                          label={intl.formatMessage({
                            id: "Fields.ToolTipEdit",
                          })}
                          fontSize="sm"
                          className="bg-gray-800 text-white p-2 rounded "
                          placement="top"
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm ms-auto me-4"
                            onClick={() => {
                              openEditModal(quoteList.id);
                            }}
                          >
                            <i className="ki-solid ki-pencil text-warning fs-2 " />
                          </button>
                        </Tooltip>
                      )}
                      {quoteList.actions.canDelete && (
                        <Tooltip
                          label={intl.formatMessage({
                            id: "Fields.ToolTipDelete",
                          })}
                          fontSize="sm"
                          className="bg-gray-800 text-white p-2 rounded "
                          placement="top"
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm"
                            onClick={() => {
                              openDeleteModal(quoteList.id, quoteList.quoteNr);
                            }}
                          >
                            <i className="ki-solid ki-trash text-danger fs-2"></i>
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        }

        {quoteLists?.result?.length == 0 && (
          <div className="text-center">
            <img
              alt=""
              src={toAbsoluteUrl("media/logos/searchnotfound.png")}
              className="h-350px w-450px"
            />
            <h3>
              {intl.formatMessage({
                id: "Fields.SearchNoItemsAvailableDefault",
              })}
            </h3>
          </div>
        )}
        {isLoading && <ListLoading />}
      </div>

      {quoteLists?.result?.length > 0 && (
        <FinancialListPagination
          totalPages={quoteLists.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={quoteLists.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { QuoteList };
