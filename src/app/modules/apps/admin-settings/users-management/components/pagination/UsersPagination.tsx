import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";

interface PaginationProps {
  totalPages: number;
  pageIndex: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  setPageIndex: (page: number) => void;
}

const UsersPagination = ({
  totalPages,
  pageIndex,
  onPageChange,
  totalItems,
  setPageIndex,
}: PaginationProps) => {
  const [state, setState] = useState(pageIndex);
  const intl = useIntl();

  useEffect(() => {
    let storedPaginationString = localStorage.getItem("pagination");

    // Parse the JSON string to get the JavaScript object, or initialize an empty object if it doesn't exist
    let pagination = storedPaginationString
      ? JSON.parse(storedPaginationString)
      : JSON.parse(import.meta.env.VITE_APP_PAGINATION);

    // Update the page in the users-module
    pagination["users-module"].pageIndex = state;

    // Convert the updated object back to a JSON string
    const updatedPaginationString = JSON.stringify(pagination);

    // Store the updated JSON string in local storage
    localStorage.setItem("pagination", updatedPaginationString);
  }, [state]);

  const handlePageChange = (newPageIndex: number) => {
    setState(newPageIndex);
    onPageChange(newPageIndex);
  };

  const handleFirstPage = () => {
    if (state !== 1) {
      setState(1);
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (state > 1) {
      setState(state - 1);
      onPageChange(state - 1);
    }
  };

  const handleNextPage = () => {
    if (state < totalPages) {
      setState(state + 1);
      onPageChange(state + 1);
    }
  };

  const handleLastPage = () => {
    if (state !== totalPages) {
      setState(totalPages);
      onPageChange(totalPages);
    }
  };

  const paginationLinks = useMemo(() => {
    const start = Math.max(1, Math.min(state - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    const links = [];
    for (let i = start; i <= end; i++) {
      links.push({
        label: i.toString(),
        active: i === state,
        page: i,
      });
    }
    return links;
  }, [totalPages, state]);

  const handlePageDropdownChange = (selectedOption: any) => {
    if (!selectedOption) return;

    const pageNumber = parseInt(selectedOption.value, 10);

    setState(pageNumber);

    if (!isNaN(pageNumber) && pageNumber !== state) {
      onPageChange(pageNumber);
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
            <li className={clsx("page-item", { disabled: state === 1 })}>
              <button
                className="page-link"
                onClick={handleFirstPage}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-chevron-double-left"></i>
              </button>
            </li>
            <li
              className={clsx("page-item previous", {
                disabled: state === 1,
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
            {paginationLinks.map((link) => (
              <li
                key={link.label}
                className={clsx("page-item", { active: link.active })}
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
            <li
              className={clsx("page-item next", {
                disabled: state === totalPages,
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
            <li
              className={clsx("page-item", {
                disabled: state === totalPages,
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
          {intl.formatMessage({ id: "Fields.SearchFooterPageTitle" })} {state}{" "}
          {intl.formatMessage({ id: "Fields.SearchFooterPageOfTitle" })}{" "}
          {totalPages} |{" "}
          {intl.formatMessage({ id: "Fields.SearchFooterTotalItemsTitle" })}:{" "}
          {totalItems}
        </span>
        <Select
          className="react-select-styled ms-3"
          options={pageOptions}
          value={pageOptions.find(
            (option) => option.value === state.toString()
          )}
          onChange={handlePageDropdownChange}
          menuPlacement="top"
        />
      </div>
    </div>
  );
};

export { UsersPagination };
