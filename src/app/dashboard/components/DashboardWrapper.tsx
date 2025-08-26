import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { useLayout } from "../../../_metronic/layout/core";
import clsx from "clsx";
import { FooterWrapper } from "../../../_metronic/layout/components/footer";
import { OpenTotals } from "./cards/OpenTotals";
import {
  ListsWidget2,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget9,
  MixedWidget8,
} from "../../../_metronic/partials/widgets";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { getChartOpenTotals } from "../core/_requests";
import { OpenTotalsResult } from "../core/_models";
import FinancialProgress from "./cards/FinancialProgress";

const DashboardPage: FC = () => {
  const [openTotals, setOpenTotals] = useState<OpenTotalsResult>();
  useEffect(() => {
    const fetchOpenTotals = async () => {
      try {
        const res = await getChartOpenTotals();
        if (res.isValid) {
          setOpenTotals(res.result);
        }
      } catch {}
    };
    fetchOpenTotals();
  }, []);
  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* begin::Row */}
        {/* <div className="row g-4 g-xl-10 mb-xl-10 rounded-2xl">
          <div className="col-xl-4 col-md-6 mb-5">
            <OpenTotals chartData={openTotals?.invoices} />
          </div>
          <div className="col-xl-4 col-md-6 mb-5">
            <OpenTotals chartData={openTotals?.receipts} />
          </div>
          <div className="col-xl-4 col-md-6 mb-5">
            <OpenTotals chartData={openTotals?.quotes} />
          </div>
        </div> */}

        {/* end::Row */}

        {/* begin::Row */}
        <div className="row gy-5 gx-xl-8">
          <div className="col-xxl-12">
            {/* <MixedWidget9
              className="card-xl-stretch mb-xl-8"
              chartColor="info"
              chartHeight="200px"
            /> */}
            <FinancialProgress />
          </div>
        </div>
        {/* <div className="row gy-5 gx-xl-8">
          <div className="col-xl-12">
            <TablesWidget9 className="card-xxl-stretch mb-5 mb-xl-8" />
          </div>
        </div> */}
        {/* end::Row */}

        {/* begin::Row */}
        {/* <div className="row gy-5 g-xl-8">
          <div className="col-xl-4">
            <ListsWidget2 className="card-xl-stretch mb-xl-8" />
          </div>
          <div className="col-xl-4">
            <ListsWidget6 className="card-xl-stretch mb-xl-8" />
          </div>
          <div className="col-xl-4">
            <ListsWidget4 className="card-xl-stretch mb-5 mb-xl-8" items={5} />
            {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5'
          </div>
        </div> */}
        {/* end::Row */}
{/* 
        <div className="row g-5 gx-xxl-8">
          <div className="col-xxl-4">
            <MixedWidget8
              className="card-xxl-stretch mb-xl-3"
              chartColor="success"
              chartHeight="150px"
            />
          </div>
          <div className="col-xxl-8">
            <TablesWidget5 className="card-xxl-stretch mb-5 mb-xxl-8" />
          </div>
        </div> */}
      </Content>
    </>
  );
};

const DashboardWrapper: FC = () => {
  const intl = useIntl();
  const { config } = useLayout();

  return (
    <div
      className={clsx(
        "main me-lg-10",
        config.app?.sidebar?.default?.class,
        // {
        //   "bg-dark": config.layoutType === "dark-sidebar",
        //   "bg-white": config.layoutType === "light-sidebar",
        // }
      )}
      // style={{
      //   maxHeight: "calc(100vh - 120px)",
      //   // overflowY: "auto",
      //   // overflowX: "hidden",
      // }}
    >
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "Menu.Dashboard" })}
      </PageTitle>
      <DashboardPage />
      <FooterWrapper />
    </div>
  );
};

export { DashboardWrapper };
