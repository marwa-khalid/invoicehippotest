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

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState("tab1");

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

      {/* begin::Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "tab1" ? "active" : ""}`}
            onClick={() => setActiveTab("tab1")}
          >
            Tab 1
          </button>
          <button
            className={`tab ${activeTab === "tab2" ? "active" : ""}`}
            onClick={() => setActiveTab("tab2")}
          >
            Tab 2
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "tab1" && <div>Content for Tab 1</div>}
          {activeTab === "tab2" && <div>Content for Tab 2</div>}
        </div>
      </div>
      {/* end::Tabs */}
    </div>
  );
};

export { UsersListHeader };

// CSS for the tabs
const styles = `
  .tabs-container {
    margin-top: 10px; /* Adjust as needed */
  }
  .tabs {
    display: flex;
    justify-content: space-around;
  }
  .tab {
    padding: 10px 20px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-bottom: none;
    background: #f9f9f9;
  }
  .tab.active {
    background: #fff;
    border-bottom: 1px solid #fff;
  }
  .tab-content {
    padding: 10px;
    border: 1px solid #ccc;
    background: #fff;
  }
`;

// Add styles to the document head (for demonstration purposes)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
