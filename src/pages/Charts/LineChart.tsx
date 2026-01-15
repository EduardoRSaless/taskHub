import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PageMeta from "../../components/common/PageMeta";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget.tsx";

export default function LineChart() {
  return (
    <>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="D A S H B O A R D " />
      <div className="space-y-6">
        <ComponentCard title="Acompanhe as métricas de produtividade">
          <LineChartOne />
        </ComponentCard>
      </div>
        <div className="space-y-6">
            <ComponentCard title="Line Chart 1">
                <MonthlyTarget />
            </ComponentCard>
        </div>
    </>
  );
}
