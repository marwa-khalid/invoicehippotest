import * as Tooltip from "@radix-ui/react-tooltip";
import { useIntl } from "react-intl";
import { KTSVG } from "../../../_metronic/helpers";

type Props = {
  clientDisplayName: string;
  openClientModal: any;
  openClientModalInNewMode: any;
  reset: any;
  setClientSearch: (type: boolean) => void;
  type: string; // 'filter' or 'modal'
};
const ClientAddButtons = ({
  clientDisplayName,
  openClientModal,
  openClientModalInNewMode,
  reset,
  setClientSearch,
  type,
}: Props) => {
  const intl = useIntl();
  return (
    <div className="d-flex w-100 h-40px">
      {/* Primary button - long */}
      {clientDisplayName ? (
        <button
          className="btn btn-primary d-inline-flex align-items-center w-100 rounded-end-0 flex-grow-1"
          onClick={(e) => {
            e.preventDefault();
            openClientModal();
          }}
        >
          <i className="la la-user fs-2"></i>
          <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span className="ms-1">
                  {clientDisplayName.length >
                  (window.innerWidth <= 576 ? 10 : 35)
                    ? `${clientDisplayName.slice(
                        0,
                        window.innerWidth <= 576 ? 10 : 30
                      )}...`
                    : clientDisplayName}
                </span>
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content side="top" className="app-tooltip">
                  {clientDisplayName}
                  <Tooltip.Arrow className="app-tooltip-arrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </button>
      ) : (
        <button
          className="btn btn-primary d-inline-flex align-items-center w-100 rounded-end-0 flex-grow-1"
          onClick={(e) => {
            e.preventDefault();
            openClientModalInNewMode();
          }}
        >
          {type === "modal" ? (
            <>
              <i className="la la-user-plus fs-2"></i>
              <span className="ms-1">
                {intl.formatMessage({
                  id: "Fields.ActionPickerAddNewClient",
                })}
              </span>
            </>
          ) : type === "modalTemplate" ? (
            <>
              <KTSVG
                className="svg-icon svg-icon-1 me-2"
                path="media/icons/hugeicons/user-search.svg"
              />
              <span className="ms-1">select a subscriber</span>
            </>
          ) : (
            <>
              <KTSVG
                className="svg-icon svg-icon-1 me-2"
                path="media/icons/hugeicons/user-search.svg"
              />
              <span className="ms-1">
                {intl.formatMessage({
                  id: "Fields.SelectOptionDefaultClient",
                })}
              </span>
            </>
          )}
        </button>
      )}
      {/* Small icon buttons */}
      {clientDisplayName && (
        <button
          className="btn btn-secondary btn-icon h-40px rounded-0 ms-1 flex-shrink-0"
          onClick={(e) => {
            e.preventDefault();
            reset();
          }}
        >
          <i className="fa fa-remove fs-3"></i>
        </button>
      )}
      <button
        className="btn btn-warning btn-icon rounded-start-0 mx-1 h-40px flex-shrink-0"
        onClick={(e) => {
          e.preventDefault();
          setClientSearch(true);
        }}
      >
        <i className="la la-search fs-3"></i>
      </button>
    </div>
  );
};

export { ClientAddButtons };
