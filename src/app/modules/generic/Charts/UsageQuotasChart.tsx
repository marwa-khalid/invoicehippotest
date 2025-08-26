import { FC, useEffect, useRef } from "react";
import { getCSSVariableValue } from "../../../../_metronic/assets/ts/_utils";

import Tippy from "@tippyjs/react";
type Props = {
  chartSize?: number;
  chartLine?: number;
  chartRotate?: number;
  title: string;
  totalCount: number;
  currentAllowedCount: number;
  descriptionCurrent: string;
  descriptionTotal: string;
};

const UsageQuotasChart: FC<Props> = ({
  chartSize = 70,
  chartLine = 11,
  chartRotate = 145,
  title,
  totalCount,
  currentAllowedCount,
  descriptionCurrent,
  descriptionTotal,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refreshChart();
  }, [totalCount, currentAllowedCount]);

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    setTimeout(() => {
      initChart(
        chartRef.current!,
        chartSize,
        chartLine,
        chartRotate,
        totalCount,
        currentAllowedCount
      );
    }, 10);
  };

  return (
    <div className="text-center">
      <div className="d-flex flex-column">
        <span className="text-gray-500">used</span>
        <span>
          {totalCount} / {currentAllowedCount}
        </span>
      </div>
      <div className="align-items-center mb-3">
        <div className="pt-2">
          <Tippy
            placement="right"
            content={
              <span>
                {descriptionTotal} / {descriptionCurrent}
              </span>
            }
          >
            <div
              id={`kt_card_widget_17_chart_${title.replace(/\s+/g, "_")}`}
              ref={chartRef}
              style={{
                minWidth: chartSize + "px",
                minHeight: chartSize + "px",
              }}
            ></div>
          </Tippy>
        </div>
      </div>
      <Tippy content={title}>
        <span className="fw-bold text-gray-900 cursor-pointer">
          {title.length > 10 ? `${title.slice(0, 10)}...` : title}
        </span>
      </Tippy>
    </div>
  );
};

const initChart = function (
  element: HTMLDivElement,
  chartSize: number,
  chartLine: number,
  chartRotate: number,
  totalCount: number,
  currentAllowedCount: number
) {
  const usagePercentage = currentAllowedCount
    ? totalCount / currentAllowedCount
    : 0;

  element.innerHTML = "";

  const options = {
    size: chartSize,
    lineWidth: chartLine,
    rotate: chartRotate,
  };

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.height = options.size;

  element.appendChild(canvas);

  ctx?.translate(options.size / 2, options.size / 2);
  ctx?.rotate((-1 / 2 + options.rotate / 180) * Math.PI);

  const radius = (options.size - options.lineWidth) / 2;

  const drawCircle = (color: string, lineWidth: number, percent: number) => {
    if (!ctx) return;

    percent = Math.min(Math.max(0, percent), 1);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  drawCircle("#E4E6EF", options.lineWidth, 1); // Grey background
  drawCircle(
    getCSSVariableValue("--bs-success"),
    options.lineWidth,
    usagePercentage
  ); // Green foreground
};

export { UsageQuotasChart };
