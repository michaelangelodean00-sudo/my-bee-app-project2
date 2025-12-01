import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { RefreshCw, Download, Calendar, TrendingUp, MousePointerClick, Eye, DollarSign } from 'lucide-react';

// Sample data
const impressionsData = [
  { date: 'Mon', impressions: 320, clicks: 18 },
  { date: 'Tue', impressions: 445, clicks: 25 },
  { date: 'Wed', impressions: 380, clicks: 21 },
  { date: 'Thu', impressions: 510, clicks: 28 },
  { date: 'Fri', impressions: 425, clicks: 23 },
  { date: 'Sat', impressions: 310, clicks: 17 },
  { date: 'Sun', impressions: 157, clicks: 10 },
];

const placementData = [
  { name: 'Splash Page', value: 1547, color: 'hsl(var(--chart-1))' },
  { name: 'Widget', value: 680, color: 'hsl(var(--chart-2))' },
  { name: 'Banner', value: 320, color: 'hsl(var(--chart-3))' },
];

const adsTableData = [
  {
    id: 'AD-001',
    title: 'Summer Sale Campaign',
    status: 'active',
    impressions: 1247,
    clicks: 68,
    ctr: 5.45,
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&h=100&fit=crop',
  },
  {
    id: 'AD-002',
    title: 'New Product Launch',
    status: 'active',
    impressions: 890,
    clicks: 52,
    ctr: 5.84,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
  },
  {
    id: 'AD-003',
    title: 'Brand Awareness',
    status: 'active',
    impressions: 410,
    clicks: 22,
    ctr: 5.37,
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=100&fit=crop',
  },
];

const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: 'hsl(var(--chart-1))',
  },
  clicks: {
    label: 'Clicks',
    color: 'hsl(var(--chart-2))',
  },
};

const CustomerAnalytics = () => {
  const [dateRange, setDateRange] = useState('7days');
  
  const totalImpressions = 2547;
  const totalClicks = 142;
  const ctr = ((totalClicks / totalImpressions) * 100).toFixed(2);
  const totalSpent = 245.00;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
              Ad Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">Track your advertising performance in real-time</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px] glass-morphism">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="glass-morphism">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-morphism border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              <Eye className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-1/70 bg-clip-text text-transparent">
                {totalImpressions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑ 12.5%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-chart-2 to-chart-2/70 bg-clip-text text-transparent">
                {totalClicks}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑ 8.2%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-chart-3 to-chart-3/70 bg-clip-text text-transparent">
                {ctr}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-yellow-500">→ 0.3%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-chart-4 to-chart-4/70 bg-clip-text text-transparent">
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-blue-500">↑ 15.8%</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Impressions Over Time */}
          <Card className="lg:col-span-2 glass-morphism border-primary/20">
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Daily impressions and clicks for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={impressionsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="impressions"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-1))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Ad Placement Distribution */}
          <Card className="glass-morphism border-primary/20">
            <CardHeader>
              <CardTitle>Ad Placement</CardTitle>
              <CardDescription>Distribution across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={placementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {placementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Daily Clicks Bar Chart */}
        <Card className="glass-morphism border-primary/20">
          <CardHeader>
            <CardTitle>Daily Click Performance</CardTitle>
            <CardDescription>Click trends throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={impressionsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="clicks" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Active Ads Table */}
        <Card className="glass-morphism border-primary/20">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Performance breakdown of your active ads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Impressions</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Clicks</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {adsTableData.map((ad) => (
                    <tr key={ad.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{ad.title}</p>
                            <p className="text-xs text-muted-foreground">{ad.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          {ad.status}
                        </Badge>
                      </td>
                      <td className="text-right py-4 px-4 font-medium">{ad.impressions.toLocaleString()}</td>
                      <td className="text-right py-4 px-4 font-medium">{ad.clicks}</td>
                      <td className="text-right py-4 px-4">
                        <span className="font-medium text-chart-3">{ad.ctr}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerAnalytics;