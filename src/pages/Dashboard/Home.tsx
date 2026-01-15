import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import DayOverview from "../../components/ecommerce/DayOverview";
import WeeklySummary from "../../components/ecommerce/WeeklySummary";
import QuickActions from "../../components/ecommerce/QuickActions";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-3 md:space-y-4">
        <div className="space-y-3">
          <EcommerceMetrics />
          <QuickActions />
        </div>

        <div className="grid grid-cols-12 gap-3 md:gap-4">
          <div className="col-span-12">
            <DayOverview />
          </div>

          <div className="col-span-12 xl:col-span-6">
            <WeeklySummary />
          </div>
          <div className="col-span-12 xl:col-span-6">
            <MonthlySalesChart />
          </div>
        </div>
      </div>
    </>
  );
}
