import { FC } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useIntl } from "react-intl";

type Props = {
  chartData: any;
};

const RADIAN = Math.PI / 180;

const OpenTotals: FC<Props> = ({ chartData }) => {
  const sepaCount = chartData?.openSepaVerificationsCount ?? 0;
  const overdueCount = chartData?.overDueCount ?? 0;
  const openCount = chartData?.openCount ?? 0;

  const totalCount = sepaCount + overdueCount;

  const pieData = [
    {
      name: chartData?.labels.openCount,
      valueName: chartData?.labels.openAmount,
      count: openCount,
      amount: chartData?.openCount ?? 0,
      color: "#00b300",
    },
    {
      name: chartData?.labels.overDueCount,
      valueName: chartData?.labels.overDueAmount,
      count: overdueCount,
      amount: chartData?.overDueAmount ?? 0,
      color: "#F1416C",
    },
    {
      name: chartData?.labels.scheduledCount,
      valueName: chartData?.labels.scheduledAmount,
      count: overdueCount,
      amount: chartData?.scheduledAmount ?? 0,
      color: "#1086ff",
    },

    {
      name: chartData?.labels.openSepaVerificationsCount,
      valueName: chartData?.labels.openSepaVerificationsCount,
      count: sepaCount,
      amount: -1,
      color: "#808080",
    },
  ]; // ignore 0-count entries
  const intl = useIntl();
  return (
    <div className="card card-flush mb-10" style={{ height: "65vh" }}>
      {chartData?.hasData ? (
        <>
          <div
            className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-start h-250px"
            style={{
              backgroundColor: "#1086ff",
            }}
            data-bs-theme="light"
          >
            <h3 className="card-title align-items-start flex-column text-white pt-15">
              <span className="fw-bold fs-3 mb-3">
                {chartData?.labels.title}
              </span>
            </h3>
          </div>
          <div className="card-body mt-n20">
            <div className="mt-n20 position-relative">
              <div className="row g-3 g-lg-6">
                {pieData.map((item, index) => (
                  <div className="col-6" key={index}>
                    <div className="bg-gray-100 bg-opacity-70 rounded-2 px-4 py-3">
                      <div className="symbol symbol-30px me-5 mb-8">
                        <span className="symbol-label">
                          <i
                            className="ki-duotone ki-award fs-2 me-1"
                            style={{ color: item.color }}
                          >
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                          </i>
                          <span className="" style={{ color: item.color }}>
                            {item.count}
                          </span>
                        </span>
                      </div>
                      <div className="m-0">
                        <span className="text-gray-700 fw-bolder d-block fs-4 lh-1 ls-n1 mb-1">
                          € {item.amount}
                        </span>

                        <span className="text-gray-500 fw-semibold fs-8">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card-body d-flex flex-column flex-center">
            <div className="mb-2">
              <h1 className="fw-semibold text-gray-800 text-center lh-lg">
                {chartData?.labels.title}
              </h1>

              <div className="py-10 text-center">
                <img
                  src={toAbsoluteUrl("media/svg/illustrations/easy/2.svg")}
                  className="theme-light-show w-200px"
                  alt=""
                />
                <img
                  src={toAbsoluteUrl("media/svg/illustrations/easy/2-dark.svg")}
                  className="theme-dark-show w-200px"
                  alt=""
                />
              </div>
            </div>
            <div className="text-center mb-1">
              <a
                className="btn btn-sm btn-primary me-2"
                data-bs-target="#kt_modal_new_address"
                data-bs-toggle="modal"
              >
                Try Now{" "}
              </a>

              <a
                className="btn btn-sm btn-light"
                href="/metronic8/demo1/apps/user-management/users/view.html"
              >
                Learn More{" "}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { OpenTotals };
