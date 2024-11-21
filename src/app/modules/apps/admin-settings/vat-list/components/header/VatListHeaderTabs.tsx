// src/components/Tabs.js
import React, { useState } from "react";
import { useIntl } from "react-intl";
interface ComponentProps {
  setVatAreaUsageTypeFilter: (type: number) => void;
}

const VatListHeaderTabs = ({ setVatAreaUsageTypeFilter }: ComponentProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const intl = useIntl();

  const tabContent = [
    {
      value: 1,
      title: intl.formatMessage({ id: "Fields.VatTabSaleCategories" }),
    },
    {
      value: 2,
      title: intl.formatMessage({ id: "Fields.VatTabCostCategories" }),
    },
  ];
  return (
    <div className="d-flex overflow-auto h-55px tax-types-tabs">
      <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
        {tabContent.map((tab, index) => (
          <li
            className="nav-item fs-xl fw-bold cursor-pointer "
            key={tab.value}
          >
            <a
              className={`nav-link ${
                activeTab === index ? "active text-primary" : ""
              }`}
              onClick={() => {
                setVatAreaUsageTypeFilter(tab.value);
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

export default VatListHeaderTabs;
