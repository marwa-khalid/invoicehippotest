import React from "react";
import {  useIntl } from "react-intl";

interface ArchiveType {
  value: string;
  name: string;
}

interface InboxArchive {
  archiveType: ArchiveType;
  isFavorite?: boolean;
  icon?: React.ReactNode;
  itemCount?: number;
}

interface ListSideBarProps {
  archiveTypeList: { leaves: InboxArchive[] };
  selected: number;
  setSelected: (number: number) => void;
  setStatusTypes: (types: number) => void;
}

const ListSideBar: React.FC<ListSideBarProps> = ({
  archiveTypeList,
  selected,
  setSelected,
  setStatusTypes,
}) => {
  const handleChanges = (e: React.MouseEvent<HTMLDivElement>, value: string) => {
    e.preventDefault();
    setSelected(parseInt(value));
    setStatusTypes(parseInt(value)); // Updates with an array containing the selected value
  };
 
  const intl = useIntl();
  return (
    <div className="col-lg-3 col-xl-3">
      <div className="card card-flush">
        <div className="card-body pt-5">
          <div
            className="d-flex flex-column gap-3"
            style={{ maxHeight: "300px", overflowY: "auto", overflowX: "hidden", paddingRight: "5px" }}
          >
            {archiveTypeList?.leaves
              ?.sort((a, b) =>
                Number(a.archiveType.value) === 0 ? -1 :
                  Number(b.archiveType.value) === 0 ? 1 :
                    String(a.archiveType.name).localeCompare(String(b.archiveType.name))
              ) // "All" (None) first, then sort alphabetically
              ?.map((inboxArchive, index) => {
                const { archiveType, isFavorite, icon, itemCount } = inboxArchive;
                const isAll = Number(archiveType.value) === 0; // Check if it's "All"
                const isSelected = Number(selected) === Number(archiveType.value); // Fix type comparison

                return (
                  <div
                    key={index}
                    className={`d-flex align-items-center justify-content-between px-3 py-2 rounded ${isSelected ? "bg-light-primary text-primary fw-bold" : ""
                      }`}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handleChanges(e, archiveType.value)}
                  >
                    <div className="d-flex align-items-center">
                      <span className={`me-2 ${isFavorite ? "text-primary" : "text-muted"}`} role="img">
                        {icon}
                      </span>
                      <span className={`fs-6 fw-bold ${isSelected ? "text-primary" : "text-gray-800"}`}>
                        {isAll ? intl.formatMessage({
                        id: "Fields.ALL",
                      }) : archiveType.name} {/* Rename "None" to "All" */}
                      </span>
                    </div>
                    <div className="badge badge-light-primary">{itemCount}</div>
                  </div>
                );
              })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ListSideBar;
