import React, { useEffect, useState } from "react";
import { getFinancialAccounts } from "../core/_requests";
import { FinancialAccountsResult } from "../core/_models";
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
  setLedgerAccountTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  addModalOpen: boolean;
  searchCounter: number;
}
const FinancialAccountsList = ({
  searchTerm,
  setTotalRows,
  setEditModalOpen,
  setEditModalId,
  setLedgerAccountTitle,
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
  const [financialAccounts, setFinancialAccounts] = useState<any>([]);

  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();
  const fetchQuotes = async () => {
    setIsLoading(true);

    try {
      const response = await getQuotes(searchTerm, pageIndex);
      setFinancialAccounts(response);
      console.log(response.result);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching financial accounts:", error);
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

  const openDeleteModal = (id: number, ledgerTitle: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setLedgerAccountTitle(ledgerTitle);
  };

  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          financialAccounts?.result?.map(
            (financialAccount: QuoteListResult) => (
              <div className="col" key={financialAccount.id}>
                <div className="card h-100 py-6 position-relative">
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
                      {financialAccount.valuta.sign}{" "}
                      {financialAccount.totals.totalPriceWithVAT.toFixed(2)}
                      <span className="ribbon-inner bg-primary"></span>
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
                      {financialAccount.quoteNr}
                      <span className="ribbon-inner bg-success"></span>
                    </div>
                  </div>
                  <div className="card-body my-3">
                    {/* First Row: Client Name (Left) and Amount (Right) */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      {/* Client Name on the Left */}
                      <div
                        className="d-flex flex-column"
                        onClick={() => openEditModal(financialAccount.id)}
                      >
                        <strong>{financialAccount.client}</strong>
                        <span className="text-muted fs-9">
                          {financialAccount.clientReferenceNr}
                        </span>
                      </div>

                      {/* Current/Total Amount on the Right */}
                      <div className="d-flex flex-column text-end fs-9">
                        {/* Total Price */}
                        <div className="d-flex gap-3 justify-content-end">
                          <small className="text-muted">
                            {intl.formatMessage({ id: "Fields.TotalPrice" })}
                          </small>
                          <span className="text-muted ">
                            {financialAccount.valuta.sign}{" "}
                            {financialAccount.totals.totalPrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Total VAT Amount */}
                        <div className="d-flex gap-3 justify-content-end">
                          <small className="text-muted">
                            {intl.formatMessage({
                              id: "Fields.TotalVATAmount",
                            })}
                          </small>
                          <span className="text-muted">
                            {financialAccount.valuta.sign}{" "}
                            {financialAccount.totals.totalVATAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* separator Line */}
                    <div className="separator separator-solid mb-6"></div>

                    <div className="my-6 text-muted">
                      <ul className="breadcrumb breadcrumb-black breadcrumb-dot">
                        {financialAccount.quoteStatus.name && (
                          <small className="bg-success rounded p-1 text-white fw-bold">
                            {financialAccount.quoteStatus.description}
                          </small>
                        )}
                        {/* {financialAccount.quoteStatus.description && (
                          <li className="breadcrumb-item">
                            <small className=" bg-secondary rounded p-1 text-dark fw-bold">
                              {financialAccount.quoteStatus.description}
                            </small>
                          </li>
                        )} */}

                        {/* {financialAccount.clientReferenceNr && (
                          <li className="breadcrumb-item">
                            <small>{financialAccount.clientReferenceNr}</small>
                          </li>
                        )} */}
                      </ul>
                    </div>

                    <div className="d-flex flex-row flex-wrap fs-8 gap-4 mt-5">
                      {financialAccount.quoteDate && (
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
                                {financialAccount.quoteDateAsString}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      {financialAccount.quoteDueDate && (
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
                                {financialAccount.quoteDueDateAsString}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        }

        {financialAccounts?.result?.length == 0 && (
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

      {financialAccounts?.result?.length > 0 && (
        <FinancialListPagination
          totalPages={financialAccounts.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={financialAccounts.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { FinancialAccountsList };
