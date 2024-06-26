import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";

interface UsersListPaginationProps {
  totalPages: number;
  pageIndex: number;
  onPageChange: (page: number) => void;
}

const UsersListPagination = ({
  totalPages,
  pageIndex,
  onPageChange,
}: UsersListPaginationProps) => {
  const intl = useIntl();
  const [selectedPage, setSelectedPage] = useState<string>(
    pageIndex.toString()
  );

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

  const handlePageDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPage(event.target.value);
    const pageNumber = parseInt(event.target.value, 10);
    if (!isNaN(pageNumber) && pageNumber !== pageIndex) {
      onPageChange(pageNumber);
    }
  };

  const pageOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= totalPages; i++) {
      options.push(
        <option key={i} value={i} className="m-0 text-primary">
          {i}
        </option>
      );
    }
    return options;
  }, [totalPages]);
  return (
    <div className="row mt-10">
      <div className="col-sm-12 col-md-6 d-flex align-items-center text-grey-800 justify-content-start">
        <p className="content-fit m-0">
          Showing Page {pageIndex} of {totalPages}
        </p>
        <select
          className="form-select form-select-sm ms-2 w-auto bg-light-primary text-primary rounded-0"
          value={selectedPage}
          onChange={handlePageDropdownChange}
        >
          {pageOptions}
        </select>
      </div>
      <div className="col-sm-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-end">
        <div id="kt_table_users_paginate">
          <ul className="pagination">
            {/* First Page Button */}
            <li className={clsx("page-item", { disabled: pageIndex === 1 })}>
              <a
                href="#"
                className="page-link"
                onClick={handleFirstPage}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-chevron-double-left"></i>
              </a>
            </li>

            {/* Previous Button */}
            <li
              className={clsx("page-item previous", {
                disabled: pageIndex === 1,
              })}
            >
              <a
                href="#"
                className="page-link"
                onClick={handlePreviousPage}
                style={{ cursor: "pointer" }}
              >
                <i className="previous"></i>
              </a>
            </li>

            {/* Page Number Links */}
            {paginationLinks.map((link) => (
              <li
                key={link.label}
                className={clsx("page-item", {
                  active: link.active,
                })}
              >
                <a
                  href="#"
                  className="page-link"
                  onClick={() => handlePageChange(link.page)}
                  style={{ cursor: "pointer" }}
                >
                  {link.label}
                </a>
              </li>
            ))}

            {/* Next Button */}
            <li
              className={clsx("page-item next", {
                disabled: pageIndex === totalPages,
              })}
            >
              <a
                href="#"
                className="page-link"
                onClick={handleNextPage}
                style={{ cursor: "pointer" }}
              >
                <i className="next"></i>
              </a>
            </li>

            {/* Last Page Button */}
            <li
              className={clsx("page-item", {
                disabled: pageIndex === totalPages,
              })}
            >
              <a
                href="#"
                className="page-link"
                onClick={handleLastPage}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-chevron-double-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { UsersListPagination };
