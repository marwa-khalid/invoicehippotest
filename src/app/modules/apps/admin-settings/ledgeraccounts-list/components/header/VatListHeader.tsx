import { useState } from "react";
import { useListView } from "../../core/ListViewProvider";
import { VatListToolbar } from "./VatListToolbar";
// import { VatListGrouping } from "./VatListGrouping";
import { VatListSearchComponent } from "./VatListSearchComponent";
import UserListHeaderTabs from "./VatListHeaderTabs";
import { KTCardBody } from "../../../../../../../_metronic/helpers";
import { Search } from "../../../../../../../_metronic/partials";

interface GroupedOption {
  label: string;
  options: { value: number; label: string }[];
}
interface ComponentProps {
  setSearchTerm: (term: string) => void;
  setVatAreaUsageTypeFilter: (type: number) => void;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  searchTerm: string;
  vatAreaUsageTypeFilter: number;
  ledgerAccountsForFilter: GroupedOption[];
}

const VatListHeader = ({
  setSearchTerm,
  setVatAreaUsageTypeFilter,
  setIsFilterApplied,
  searchTerm,
  isFilterApplied,
  vatAreaUsageTypeFilter,
  ledgerAccountsForFilter,
}: ComponentProps) => {
  const { selected } = useListView();
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <VatListSearchComponent
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
          setIsFilterApplied={setIsFilterApplied}
          isFilterApplied={isFilterApplied}
          vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
          ledgerAccountsForFilter={ledgerAccountsForFilter}
        />

        {/* Tabs Section */}
        {/* <div className="mt-4">
          <UserListHeaderTabs
            
            onTabChange={onTabChange}
          />
        </div> */}

        {/* Card toolbar */}
        {/* <div className="card-toolbar">
        {selected.length > 0 ? <VatListGrouping /> : <VatListToolbar />}
      </div> */}
      </div>
    </KTCardBody>
  );
};

export { VatListHeader };
