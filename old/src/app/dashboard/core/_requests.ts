import { OpenTotalsModel } from "./_models";
import { getRequest } from "../../modules/auth/core/_apiservice";
import { CHART_OPEN_TOTALS, FINANCIAL_PROGRESS } from "./constants";

export function getChartOpenTotals() {
  return getRequest<OpenTotalsModel>(CHART_OPEN_TOTALS, true);
}

export function getFinancialProgress(year: number) {
  return getRequest<any>(`${FINANCIAL_PROGRESS}/${year}`, true);
}
