import React, { useEffect, useState } from "react";
import { getVatTypes } from "../core/_requests";
import { VatTypesResult } from "../core/_models";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { UsersListPagination } from "../components/pagination/UsersListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
const UsersTable = ({ searchTerm }: { searchTerm: string }) => {
  const [vatTypesList, setVatTypesList] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    const fetchVatTypes = async () => {
      setIsLoading(true);
      try {
        const response = await getVatTypes(searchTerm, pageIndex);
        setVatTypesList(response.result);
        setTotalPages(response.totalPages);
        setPageIndex(response.pageIndex);
      } catch (error) {
        console.error("Error fetching VAT types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVatTypes();
  }, [searchTerm, pageIndex]);

  const renderLockIcon = (isChecked: boolean) => {
    return isChecked ? (
      <i className="bi bi-unlock-fill text-success"></i>
    ) : (
      <i className="bi bi-lock-fill text-danger"></i>
    );
  };

  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {isLoading && <UsersListLoading />}
        {!isLoading &&
          vatTypesList.map((vatType: VatTypesResult) => (
            <div className="col" key={vatType.id}>
              <div className="card h-100 shadow-sm py-6">
                <div className="card-body">
                  {/* First Row: Checkbox, Divider, Value */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="checkbox"
                        style={{ display: "none" }}
                        checked={vatType.useInLists}
                        readOnly={true}
                      />
                      {renderLockIcon(vatType.useInLists)}
                      <span className="mx-2 text-muted">|</span>
                      <span className="fw-bold">{vatType.value}%</span>
                    </div>
                    <div className="align-items-center">
                      <i className="bi bi-pencil-fill text-warning me-4"></i>

                      <i className="bi bi-trash-fill text-danger"></i>
                    </div>
                  </div>
                  {/* Horizontal Line */}
                  <hr />
                  {/* Verkoopfacturen Text */}
                  <p className="text-muted mb-3">Verkoopfacturen</p>
                  {/* Small Image and Ledger Account + Title */}
                  <div className="d-flex align-items-start">
                    <img
                      src={toAbsoluteUrl("media/auth/ok-dark.png")}
                      alt="Small Image"
                      className="me-3"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <div>
                      <p className="mb-0 mt-1">
                        {intl.formatMessage({ id: "Fields.LedgerAccount" })}
                      </p>
                      <p className="fw-bold mb-0 text-primary">
                        {vatType.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <UsersListPagination
        totalPages={totalPages}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
      />
    </KTCardBody>
  );
};

export { UsersTable };
