import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { LogOut, TrendingUp, Package, Users, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [adminUser, setAdminUser] = useState<any>(null);

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (!stored) {
      setLocation("/admin");
      return;
    }
    setAdminUser(JSON.parse(stored));
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    setLocation("/admin");
  };

  if (!adminUser) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Transform data for charts
  const fabricReturnsData = analyticsData?.fabricReturns ? 
    Object.entries(analyticsData.fabricReturns).map(([fabric, count]) => ({
      fabric,
      returns: count
    })) : [];

  const fabricExchangesData = analyticsData?.fabricExchanges ? 
    Object.entries(analyticsData.fabricExchanges).map(([fabric, count]) => ({
      fabric,
      exchanges: count
    })) : [];

  const returnReasonsData = analyticsData?.returnReasons ? 
    Object.entries(analyticsData.returnReasons).map(([reason, count]) => ({
      reason,
      count
    })) : [];

  const sizeRecommendationData = analyticsData?.sizeRecommendationAcceptance ? 
    Object.entries(analyticsData.sizeRecommendationAcceptance).map(([month, percentage]) => ({
      month,
      percentage
    })) : [];

  const sizingData = analyticsData?.sizingData || { golden: {}, actual: {} };
  const goldenRatio = sizingData.golden;
  const actualRatio = sizingData.actual;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="https://cdn.shopify.com/oxygen-v2/23879/21990/45558/2073582/build/_assets/VirgioIcon-dark-LIXEJ3S2.svg" 
                alt="Virgio" 
                className="h-8 w-auto mr-4"
              />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {adminUser.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics">Material & Product Analytics</TabsTrigger>
            <TabsTrigger value="sourcing">Sourcing Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">43</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Exchanges</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Size Rec. Acceptance</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">93%</div>
                  <p className="text-xs text-muted-foreground">
                    +4% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">
                    +0.2 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fabric-wise Returns</CardTitle>
                  <CardDescription>
                    Number of returns by fabric type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fabricReturnsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fabric" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="returns" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fabric-wise Exchanges</CardTitle>
                  <CardDescription>
                    Number of exchanges by fabric type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fabricExchangesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fabric" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="exchanges" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Return/Exchange Reasons</CardTitle>
                  <CardDescription>
                    Breakdown of why customers return or exchange items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={returnReasonsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ reason, percent }) => `${reason}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {returnReasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Size Recommendation Acceptance</CardTitle>
                  <CardDescription>
                    Percentage of users who accepted our size recommendations over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sizeRecommendationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="percentage" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sourcing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Object.entries(goldenRatio).map(([size, ratio]) => (
                <Card key={size}>
                  <CardHeader>
                    <CardTitle className="text-center">Size {size}</CardTitle>
                    <CardDescription className="text-center">
                      Production ratio analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-600">Golden Ratio</div>
                        <div className="text-2xl font-bold text-blue-600">{ratio}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Actual This Month</div>
                        <div className="text-2xl font-bold text-green-600">{actualRatio[size as keyof typeof actualRatio]}</div>
                      </div>
                      <div className="mt-4">
                        <div className={`text-sm font-medium ${
                          (actualRatio[size as keyof typeof actualRatio] || 0) > ratio ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {((actualRatio[size as keyof typeof actualRatio] || 0) > ratio ? '+' : '') + 
                           (((actualRatio[size as keyof typeof actualRatio] || 0) - ratio) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">vs golden ratio</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Production Ratio Summary</CardTitle>
                <CardDescription>
                  Comparison between golden production ratio and actual monthly data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">Golden Production Ratio</div>
                      <div className="text-sm text-gray-600">Optimal production distribution</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        S:{goldenRatio.S} : M:{goldenRatio.M} : L:{goldenRatio.L} : XL:{goldenRatio.XL}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Actual This Month</div>
                      <div className="text-sm text-gray-600">Current production distribution</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        S:{actualRatio.S} : M:{actualRatio.M} : L:{actualRatio.L} : XL:{actualRatio.XL}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-yellow-800">Recommendations</div>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• Reduce Medium size production by 5%</li>
                      <li>• Increase Large size production by 5%</li>
                      <li>• Maintain current Small and XL production levels</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}