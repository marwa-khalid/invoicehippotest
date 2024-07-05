import { useState } from "react";
import { useListView } from "../../core/ListViewProvider";
import { VatListToolbar } from "./VatListToolbar";
// import { VatListGrouping } from "./VatListGrouping";
import { VatListSearchComponent } from "./VatListSearchComponent";
import UserListHeaderTabs from "./VatListHeaderTabs";
import { KTCardBody } from "../../../../../../../_metronic/helpers";
interface ComponentProps {
  setSearchTerm: (term: string) => void;
  setVatAreaUsageTypeFilter: (type: number) => void;
}

const VatListHeader = ({
  setSearchTerm,
  setVatAreaUsageTypeFilter,
}: ComponentProps) => {
  const { selected } = useListView();
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <VatListSearchComponent
          setSearchTerm={setSearchTerm}
          setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
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
