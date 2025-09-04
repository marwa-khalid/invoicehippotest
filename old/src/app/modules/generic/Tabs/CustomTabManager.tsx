interface TabManagerProps {
  tabs: any[];
  activeTab: any;
  onTabClick: (tab: any) => void;
  onExtraOptionsClick?: () => void;
  onSubscriptionsClick?: () => void;
  hasOptions: boolean;
  hasSubscriptions: boolean;
  hasCustomFields?: boolean;
}
const CustomTabManager = ({
  tabs,
  activeTab,
  onTabClick,
  onExtraOptionsClick,
  onSubscriptionsClick,
  hasOptions,
  hasSubscriptions,
  hasCustomFields,
}: TabManagerProps) => {
  return (
    <div className="hippo-tab-manager d-flex justify-content-between p-5 flex-grow-1 bg-secondary">
      <div className="d-flex justify-content-start">
        {tabs.map((tab: any) => {
          // Check if tab is "tab4" and should be conditionally displayed
          if (tab.id === "tab4" && !hasCustomFields) {
            return null;
          }
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab)}
              className={`btn bg-light border-0 mx-2 px-4 ${
                activeTab.id === tab.id
                  ? "hippo-selected-tab text-white bg-primary"
                  : "text-gray bg-body"
              }`}
              style={{ borderBottomColor: "1px solid black" }}
            >
              <i
                className={`${tab.icon} ${
                  activeTab.id === tab.id ? "text-white" : "text-gray-600"
                }`}
              />
              <span
                className={`me-1 ${
                  activeTab.id === tab.id ? "text-white" : "text-gray-600"
                }`}
              >
                |
              </span>
              <span
                className={
                  activeTab.id === tab.id ? "text-white" : "text-gray-600"
                }
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-end">
        {hasOptions && (
          <button
            onClick={onExtraOptionsClick}
            className="btn btn-icon btn-primary me-4"
          >
            <i className="ki-duotone ki-setting-2 fs-2x">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </button>
        )}
        {hasSubscriptions && (
          <button
            onClick={onSubscriptionsClick}
            className="btn btn-icon btn-primary"
          >
            <i className="ki-duotone ki-calendar fs-2x">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </button>
        )}
      </div>
    </div>
  );
};

export { CustomTabManager };
