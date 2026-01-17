import { getDashboardMetrics } from "@/actions/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { PageWrapper } from "@/components/PageWrapper";

export default async function DashboardPage() {
  // This runs on the server
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>

      <PageWrapper>
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders (Today)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.dailyOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue (Today)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">₹{metrics.dailyRevenue.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pieces (Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.monthlyPieces}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payable (Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{metrics.monthlyPayable.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Seller</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold truncate" title={metrics.topSupplier}>{metrics.topSupplier}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <AnalyticsCharts data={metrics.chartData} />
      </PageWrapper>

    </div>
  );
}
