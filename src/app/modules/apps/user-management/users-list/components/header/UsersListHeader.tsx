import { useState } from "react";
import { useListView } from "../../core/ListViewProvider";
import { UsersListToolbar } from "./UserListToolbar";
import { UsersListGrouping } from "./UsersListGrouping";
import { UsersListSearchComponent } from "./UsersListSearchComponent";
import UserListHeaderTabs from "./UserListHeaderTabs";
import { KTCardBody } from "../../../../../../../_metronic/helpers";
interface UsersListSearchComponentProps {
  setSearchTerm: (term: string) => void;
  setVatAreaUsageTypeFilter: (type: number) => void;
}

const UsersListHeader = ({
  setSearchTerm,
  setVatAreaUsageTypeFilter,
}: UsersListSearchComponentProps) => {
  const { selected } = useListView();
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <UsersListSearchComponent setSearchTerm={setSearchTerm} />

        {/* Tabs Section */}
        <div className="mt-4">
          <UserListHeaderTabs
            setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
          />
        </div>

        {/* Card toolbar */}
        {/* <div className="card-toolbar">
        {selected.length > 0 ? <UsersListGrouping /> : <UsersListToolbar />}
      </div> */}
      </div>
    </KTCardBody>
  );
};

export { UsersListHeader };
