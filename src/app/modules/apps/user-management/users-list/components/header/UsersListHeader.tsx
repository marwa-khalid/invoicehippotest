import { useState } from "react";
import { useListView } from "../../core/ListViewProvider";
import { UsersListToolbar } from "./UserListToolbar";
import { UsersListGrouping } from "./UsersListGrouping";
import { UsersListSearchComponent } from "./UsersListSearchComponent";
interface UsersListSearchComponentProps {
  setSearchTerm: (term: string) => void;
}
const UsersListHeader = ({ setSearchTerm }: UsersListSearchComponentProps) => {
  const { selected } = useListView();
  return (
    <div className="card-header border-0 pt-6">
      <UsersListSearchComponent setSearchTerm={setSearchTerm} />
      {/* begin::Card toolbar */}
      <div className="card-toolbar">
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <UsersListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  );
};

export { UsersListHeader };
