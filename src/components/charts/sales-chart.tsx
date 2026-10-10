"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MoneyFromKobo } from "@/lib/utils/format";
import type { SalesPoint } from "@/features/dashboard/types";

// Only the pieces this chart uses are registered, which keeps the bundle down.
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/** Design-system colours, so the chart matches the rest of the console. */
const OLIVE = "#4E7A38";
const FOREST = "#163A1F";
const LINE = "#E4DCC8";
const MUTED = "#6B6456";

interface SalesChartProps {
  points: SalesPoint[];
}

/**
 * Daily revenue for the last seven days.
 *
 * Amounts arrive in kobo and are divided for the axis only; the tooltip
 * formats from the original figure so no rounding reaches the reader.
 */
export function SalesChart({ points }: SalesChartProps) {
  const hasRevenue = points.some((point) => point.revenue > 0);

  return (
    <div className="h-[260px]">
      <Bar
        data={{
          labels: points.map((point) => point.label),
          datasets: [
            {
              label: "Revenue",
              data: points.map((point) => point.revenue / 100),
              backgroundColor: OLIVE,
              hoverBackgroundColor: FOREST,
              borderRadius: 8,
              maxBarThickness: 46,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: FOREST,
              padding: 10,
              displayColors: false,
              callbacks: {
                title: (items: TooltipItem<"bar">[]) =>
                  points[items[0].dataIndex]?.date ?? "",
                label: (item: TooltipItem<"bar">) =>
                  MoneyFromKobo(points[item.dataIndex]?.revenue ?? 0),
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { color: LINE },
              ticks: { color: MUTED, font: { size: 12 } },
            },
            y: {
              // An all-zero week would otherwise draw an axis with no scale.
              suggestedMax: hasRevenue ? undefined : 10,
              beginAtZero: true,
              grid: { color: LINE },
              border: { display: false },
              ticks: {
                color: MUTED,
                font: { size: 11 },
                callback: (value) => "₦" + Number(value).toLocaleString("en-NG"),
              },
            },
          },
        }}
      />
    </div>
  );
}
