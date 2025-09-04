import { useIntl } from "react-intl";
import {
  ActivitiesModel,
  AttachmentsResult,
  MutationsModel,
} from "../accounting/bookings/components/core/_models";
import { Mutations } from "./Mutations";
import { Activities } from "./Activities";
import { AttachmentListing } from "./FileManager/AttachmentListing";
import { Dispatch, SetStateAction } from "react";
import { Spinner } from "react-bootstrap";

interface Props {
  mutations: Record<number, MutationsModel>;
  id: number;
  activeTab: { [key: number]: string };
  handleTabChange: any;
  attachments: Record<number, AttachmentsResult[]>;
  activities: Record<number, ActivitiesModel>;
  setDownloadUrl: (type: string) => void;
  setKey: Dispatch<SetStateAction<number>>;
  loadingRows?: Record<number, boolean>;
  documentFileName?: string;
  description?: string;
  rule?: string;
}
const ExpandedRows = ({
  mutations,
  id,
  activeTab,
  handleTabChange,
  attachments,
  activities,
  setDownloadUrl,
  setKey,
  loadingRows,
  documentFileName,
  description,
  rule,
}: Props) => {
  const intl = useIntl();
  return (
    <div className="tabs-container mt-5">
      <ul className="nav nav-line-tabs nav-line-tabs-2xe nav-stretch fw-bold">
        {documentFileName && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab[id] === "file" ? "active" : ""}`}
              onClick={() => handleTabChange(id, "file")}
            >
              Info
            </button>
          </li>
        )}
        {mutations[id]?.result.length > 0 && (
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab[id] === "mutations" ? "active" : ""
              }`}
              onClick={() => handleTabChange(id, "mutations")}
            >
              {intl.formatMessage({
                id: "Fields.TabBookingMutations",
              })}
            </button>
          </li>
        )}
        {attachments[id]?.length > 0 && (
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab[id] === "attachments" ? "active" : ""
              } position-relative pe-3`} // Add position-relative for badge positioning
              onClick={() => handleTabChange(id, "attachments")}
            >
              {intl.formatMessage({
                id: "Fields.TabAttachments",
              })}
              {/* Add the Bootstrap badge/pill */}

              <span className="position-absolute bottom-60 start-100 translate-middle badge badge-sm badge-circle badge-primary fs-8">
                {attachments[id]?.length}
              </span>
            </button>
          </li>
        )}
        {activities && activities[id]?.result.length > 0 && (
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab[id] === "actionHistory" ? "active" : ""
              }`}
              onClick={() => handleTabChange(id, "actionHistory")}
            >
              {intl.formatMessage({
                id: "Fields.TabActionHistory",
              })}
            </button>
          </li>
        )}
      </ul>
      <div className="tab-content mt-3">
        {activeTab[id] === "file" && (
          <div className="d-flex flex-column gap-3">
            {rule && (
              <>
                <span className="fw-bold">
                  {intl.formatMessage({
                    id: "Fields.TransactionCanBeAutoRouted",
                  })}
                </span>

                <span
                  className="text-primary cursor-pointer"
                  dangerouslySetInnerHTML={{
                    __html: rule,
                  }}
                />
              </>
            )}
            {description && (
              <>
                <span className="fw-bold">
                  {intl.formatMessage({
                    id: "Fields.Description",
                  })}
                </span>
                <span
                  className="text-muted"
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                />
              </>
            )}
            {documentFileName && (
              <>
                <span className="fw-bold">
                  {intl.formatMessage({
                    id: "Fields.ImportResourceFile",
                  })}
                </span>
                <span
                  className="text-muted"
                  dangerouslySetInnerHTML={{ __html: documentFileName }}
                />
              </>
            )}
          </div>
        )}
        {activeTab[id] === "mutations" && (
          <Mutations mutations={mutations} id={id} />
        )}

        {activeTab[id] === "attachments" && (
          <AttachmentListing
            attachments={attachments}
            setDownloadUrl={setDownloadUrl}
            setKey={setKey}
            id={id}
          />
        )}
        {activeTab[id] === "actionHistory" && (
          <Activities activities={activities} id={id} />
        )}
        {loadingRows && loadingRows[id] && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export { ExpandedRows };
