import Tippy from "@tippyjs/react";
import React from "react";
import { KTIcon, KTSVG } from "../../../../_metronic/helpers";
interface DetailsCardProps {
  details: {
    iconClass: string;
    labelId?: string | null; // ID for `intl.formatMessage`
    attachmentsCount?: number;
    hasAttachments?: boolean;
    value2?: string;
    value3?: string;
    value: string | number | null; // The value to display
    colorClass?: string; // Optional class for text color
    isCheck?: boolean;
    hasProgress?: boolean;
  }[];
  intl: any; // Assuming you are using react-intl's useIntl hook
  openEditMode?: any;
}

const DetailsCard: React.FC<DetailsCardProps> = ({
  details,
  intl,
  openEditMode,
}) => {
  return (
    <div className="d-flex align-items-center flex-wrap">
      {details.map(
        (detail, index) =>
          (detail.value || detail.value2 || detail.isCheck) && ( // Render only if the value is provided
            <React.Fragment key={index}>
              {/* Separator for all but the first item */}
              {index > 0 && (
                <span
                  style={{
                    backgroundColor: "#f1f1f4",
                    height: "37px",
                    width: "1px",
                  }}
                  className="me-5"
                ></span>
              )}

              {/* Detail Item */}
              <div className="d-flex align-items-center flex-wrap">
                <i
                  className={`${detail.iconClass} fs-3x ${
                    detail.colorClass || "text-muted"
                  }`}
                >
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>

                <div className="d-flex flex-column mx-6">
                  <span className="fs-sm text-muted d-flex align-items-center position-relative pe-6">
                    {detail.labelId ? (
                      intl.formatMessage({ id: detail.labelId })
                    ) : detail.value2 && detail.value2.length >= 40 ? (
                      <Tippy content={detail.value2}>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            openEditMode && openEditMode(true);
                          }}
                        >
                          {detail.value2?.slice(0, 40) || "\u00A0"}
                          ....
                        </span>
                      </Tippy>
                    ) : (
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          openEditMode && openEditMode(true);
                        }}
                      >
                        {detail.value2 || "\u00A0"}
                      </span>
                    )}

                    {detail.hasAttachments && (
                      <span className="position-absolute bottom-60 start-100 translate-middle badge badge-sm badge-square badge-primary fs-8 p-2">
                        <KTIcon
                          iconName="paper-clip"
                          className="icon-1 text-white"
                        />
                        {detail.attachmentsCount}
                      </span>
                    )}
                  </span>

                  {detail.isCheck ? (
                    detail.value ? (
                      <KTSVG
                        path="media/icons/duotune/general/gen037.svg"
                        className="svg-icon-success svg-icon-2x"
                      />
                    ) : (
                      <KTSVG
                        path="media/icons/duotune/general/gen037.svg"
                        className="svg-icon-danger svg-icon-2x"
                      />
                    )
                  ) : (
                    <span className="fw-bolder text-primary">
                      {detail.hasProgress ? (
                        <div
                          className="d-flex gap-3 align-items-center"
                          style={{ minWidth: "300px", flex: 1 }}
                        >
                          <div className="progress w-100 mt-2 mb-2 bg-gray-300">
                            <div
                              className="progress-bar bg-danger"
                              role="progressbar"
                              style={{ width: `${detail.value || 0}%` }}
                              aria-valuenow={Number(detail.value) || 0}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                          {detail.value}%
                        </div>
                      ) : (
                        detail.value || "\u00A0"
                      )}
                    </span>
                  )}
                  {/* {detail.value3 ? (
                    <span className="text-muted mt-1">
                      {detail.value3.length > 40 ? (
                        <Tippy content={detail.value3}>
                          <span
                            className="cursor-pointer"
                            dangerouslySetInnerHTML={{
                              __html: `${detail.value3.slice(0, 40)}...`,
                            }}
                          />
                        </Tippy>
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{ __html: detail.value3 }}
                        />
                      )}
                    </span>
                  ) : (
                    "\u00A0"
                  )} */}
                </div>
              </div>
            </React.Fragment>
          )
      )}
    </div>
  );
};

export default DetailsCard;
