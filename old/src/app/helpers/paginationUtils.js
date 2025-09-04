import { defaultPaginationConfig } from "./paginationConfig";

const PAGINATION_KEY = "pagination";

export const getPagination = () => {
  const storedPagination = localStorage.getItem(PAGINATION_KEY);
  return storedPagination
    ? JSON.parse(storedPagination)
    : { ...defaultPaginationConfig };
};

export const getPaginationModule = (module) => {
  const pagination = getPagination();
  if (pagination[module]) {
    const { filters, pageIndex } = pagination[module];
    const currentFilters = { ...filters, pageIndex };
    return currentFilters;
  }
  return null;
};

export const updatePagination = (module, updates, pageIndex) => {
  const pagination = getPagination();
  if (pagination[module]) {
    pagination[module] = {
      ...pagination[module],
      filters: {
        ...pagination[module].filters,
        ...updates,
      },
      pageIndex: pageIndex,
    };
    localStorage.setItem(PAGINATION_KEY, JSON.stringify(pagination));
  } else {
    console.warn(`Module ${module} not found in pagination configuration.`);
  }
};

// export const resetWholePagination = () => {
//   localStorage.setItem(PAGINATION_KEY, JSON.stringify(defaultPaginationConfig));
// };

export const resetPaginationModule = (module) => {
  const pagination = getPagination();
  if (pagination[module]) {
    pagination[module] = {
      ...pagination[module],
      filters: {},
      pageIndex: 1,
    };
    localStorage.setItem(PAGINATION_KEY, JSON.stringify(pagination));
  } else {
    console.warn(`Module ${module} not found in pagination configuration.`);
  }
};
