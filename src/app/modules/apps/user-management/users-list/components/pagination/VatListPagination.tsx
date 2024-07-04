import React, { useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";

interface VatListPaginationProps {
  totalPages: number;
  pageIndex: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

const VatListPagination = ({
  totalPages,
  pageIndex,
  onPageChange,
  totalItems,
}: VatListPaginationProps) => {
  const intl = useIntl();
  const [selectedPage, setSelectedPage] = useState<number>(pageIndex);

  useEffect(() => {
    setSelectedPage(pageIndex);
  }, [pageIndex]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== pageIndex) {
      onPageChange(page);
    }
  };

  const handleFirstPage = () => {
    if (pageIndex !== 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      onPageChange(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages) {
      onPageChange(pageIndex + 1);
    }
  };

  const handleLastPage = () => {
    if (pageIndex !== totalPages) {
      onPageChange(totalPages);
    }
  };

  const paginationLinks = useMemo(() => {
    const links = [];
    for (let i = 1; i <= totalPages; i++) {
      links.push({
        label: i.toString(),
        active: i === pageIndex,
        page: i,
      });
    }
    return links;
  }, [totalPages, pageIndex]);

  const handlePageDropdownChange = (selectedOption: any) => {
    if (!selectedOption) return;

    // Log the selected value
    console.log(selectedOption.value);

    // Convert the value to a number
    const pageNumber = parseInt(selectedOption.value, 10);

    // Update the selected page state
    setSelectedPage(pageNumber);

    // Check if it's a valid number and different from the current pageIndex
    if (!isNaN(pageNumber) && pageNumber !== pageIndex) {
      onPageChange(pageNumber); // Call the onPageChange function with the new page number
    }
  };

  const pageOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= totalPages; i++) {
      options.push({ value: `${i}`, label: `${i}` });
    }
    return options;
  }, [totalPages]);

  return (
    <div className="row mt-10">
      <div className="col-sm-12 col-md-6 d-flex align-items-center text-grey-800 justify-content-start">
        <div id="kt_table_users_paginate">
          <ul className="pagination">
            {/* First Page Button */}
            <li className={clsx("page-item", { disabled: pageIndex === 1 })}>
              <button
                className="page-link"
                onClick={handleFirstPage}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-chevron-double-left"></i>
              </button>
            </li>

            {/* Previous Button */}
            <li
              className={clsx("page-item previous", {
                disabled: pageIndex === 1,
              })}
            >
              <button
                className="page-link"
                onClick={handlePreviousPage}
                style={{ cursor: "pointer" }}
              >
                <i className="previous"></i>
              </button>
            </li>

            {/* Page Number Links */}
            {paginationLinks.map((link) => (
              <li
                key={link.label}
                className={clsx("page-item", {
                  active: link.active,
                })}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(link.page)}
                  style={{ cursor: "pointer" }}
                >
                  {link.label}
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li
              className={clsx("page-item next", {
                disabled: pageIndex === totalPages,
              })}
            >
              <button
                className="page-link"
                onClick={handleNextPage}
                style={{ cursor: "pointer" }}
              >
                <i className="next"></i>
              </button>
            </li>

            {/* Last Page Button */}
            <li
              className={clsx("page-item", {
                disabled: pageIndex === totalPages,
              })}
            >
              <button
                className="page-link"
                onClick={handleLastPage}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-chevron-double-right"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-end">
        <span className="content-fit m-0 text-muted fs-xs">
          {intl.formatMessage({ id: "Fields.SearchFooterPageTitle" })}{" "}
          {pageIndex}{" "}
          {intl.formatMessage({ id: "Fields.SearchFooterPageOfTitle" })}{" "}
          {totalPages} |{" "}
          {intl.formatMessage({ id: "Fields.SearchFooterTotalItemsTitle" })}:{" "}
          {totalItems}
        </span>

        <Select
          className="react-select-styled ms-3"
          options={pageOptions} // The options array created dynamically
          value={pageOptions.find(
            (option) => option.value === selectedPage.toString()
          )} // Set the currently selected option
          onChange={handlePageDropdownChange} // Updated onChange handler
          menuPlacement="top"
        />
      </div>
    </div>
  );
};

export { VatListPagination };
