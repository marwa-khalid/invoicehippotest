// src/components/Tabs.js
import React, { useState } from "react";
import { useIntl } from "react-intl";
interface UsersListSearchComponentProps {
  setVatAreaUsageTypeFilter: (type: number) => void;
}

const UsersListHeaderTabs = ({
  setVatAreaUsageTypeFilter,
}: UsersListSearchComponentProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const intl = useIntl();

  const tabContent = [
    {
      title: intl.formatMessage({ id: "Fields.VatTabSaleCategories" }),
    },
    {
      title: intl.formatMessage({ id: "Fields.VatTabCostCategories" }),
    },
  ];

  return (
    <div className="d-flex overflow-auto h-55px tax-types-tabs">
      <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
        {tabContent.map((tab, index) => (
          <li className="nav-item fs-xl fw-bold " key={index}>
            <a
              className={`nav-link ${
                activeTab === index ? "active text-primary" : ""
              }`}
              onClick={() => {
                setVatAreaUsageTypeFilter(index);
                setActiveTab(index);
              }}
            >
              {tab.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersListHeaderTabs;
