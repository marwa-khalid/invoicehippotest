import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getFinancialProgress } from "../../core/_requests";
import BarChartIcon from "./BarChartIcon";

const FinancialBarChart = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [labels, setLabels] = useState<any>({});
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [costData, setCostData] = useState<number[]>([]);
  const [resultData, setResultData] = useState<number[]>([]);

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [previousYearResultData, setPreviousYearResultData] = useState<
    number[]
  >([]);
  const [wholeData, setWholeData] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFinancialProgress(selectedYear);
        const result = res?.result;
        setWholeData(result);
        setLabels(result.labels);

        if (result?.availableYears) setYearOptions(result.availableYears);

        const usePrev = result.activeYear !== selectedYear;
        const totals = usePrev
          ? result.previousYearTotalsPerMonth
          : result.totalsPerMonth;

        const getValues = (arr: any[]) =>
          monthLabels.map((_, i) => arr[i]?.value ?? 0);

        setIncomeData(getValues(totals.totalIncomeList || []));
        setCostData(getValues(totals.totalCostList || []));
        setResultData(getValues(totals.totalResultList || []));
        const prevYearResult =
          result.previousYearItems?.map((item: any) => item.result) || [];
        setPreviousYearResultData(prevYearResult);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, [selectedYear]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "line", // ✅ Set to 'line' to support mixed chart
      height: 350,
      toolbar: { show: false },
    },
    markers: {
      size: 4, // ✅ Dots on line
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    stroke: {
      width: [2, 2, 2, 2], // Thicker line for previous year
      curve: "smooth",
    },
    //   chart: {
    //     type: "bar",
    //     height: 350,
    //     stacked: false,
    //     toolbar: { show: false },
    //   },
    xaxis: {
      categories: monthLabels,
    },
    yaxis: {
      title: { text: "kosten-/inkomsten-/resultaat" },
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        columnWidth: "100%",
      },
    },

    colors: ["#67b7dc", "#d63031", "#db66ab", "#7d8295"], // income, cost, result, previous years
    legend: {
      position: "bottom",
      horizontalAlign: "left",
    },
  };

  const chartSeries = [
    {
      name: labels?.totalIncomeAmountPerMonth || "Income",
      data: incomeData,
      type: "column",
    },
    {
      name: labels?.totalCostAmountPerMonth || "Cost",
      data: costData,
      type: "column",
    },
    {
      name: labels?.totalResultAmountPerMonth || "Result",
      data: resultData,
      type: "line",
    },
    {
      name:
        labels?.previousYearTotalResultAmountPerMonth || "Previous Year Result",
      data: previousYearResultData,
      type: "line",
    },
  ];

  return (
    <div className="card p-10 mb-10">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="mb-1 text-gray-900">{labels?.title}</h3>
          <div className="text-muted">{labels?.subTitle}</div>
        </div>
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="form-select"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="fv-row d-flex gap-10">
        <div className="d-flex align-items-center gap-3">
          <div className="symbol symbol-45 symbol-light mr-4">
            <span className="symbol-label">
              <BarChartIcon color="#67b7dc" />
            </span>
          </div>

          <div className="d-flex flex-column flex-grow-1">
            <a className="text-dark mb-1 fw-bold">Jaar Omzet</a>
            <span className="text-muted font-weight-bold">
              € {wholeData?.yearTotals?.totalIncome || "0.00"}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="symbol symbol-45 symbol-light mr-4">
            <span className="symbol-label">
              <BarChartIcon color="#d63031" />
            </span>
          </div>

          <div className="d-flex flex-column flex-grow-1">
            <a className="text-dark mb-1 fw-bold">Jaar Kosten</a>
            <span className="text-muted font-weight-bold">
              € {wholeData?.yearTotals.totalCost || "0.00"}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="symbol symbol-45 symbol-light mr-4">
            <span className="symbol-label">
              <BarChartIcon color="#db66ab" />
            </span>
          </div>

          <div className="d-flex flex-column flex-grow-1">
            <a className="text-dark mb-1 fw-bold">Jaar Resultaat</a>
            <span className="text-muted font-weight-bold">
              € {wholeData?.yearTotals.totalResult || "0.00"}
            </span>
          </div>
        </div>
      </div>

      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="line" // type doesn't matter here since it's overridden in series types
        height={400}
      />
    </div>
  );
};

export default FinancialBarChart;
