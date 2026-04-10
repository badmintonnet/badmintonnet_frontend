'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Users, 
  TrendingUp,
  Activity,
  Flag
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dữ liệu mẫu cho biểu đồ người dùng
const userActivityData = [
  { name: 'T1', active: 400, new: 240 },
  { name: 'T2', active: 450, new: 139 },
  { name: 'T3', active: 520, new: 180 },
  { name: 'T4', active: 580, new: 250 },
  { name: 'T5', active: 620, new: 210 },
  { name: 'T6', active: 700, new: 300 },
  { name: 'T7', active: 750, new: 320 },
  { name: 'T8', active: 800, new: 280 },
  { name: 'T9', active: 850, new: 350 },
  { name: 'T10', active: 900, new: 390 },
  { name: 'T11', active: 950, new: 420 },
  { name: 'T12', active: 1000, new: 450 },
];

// Dữ liệu mẫu cho biểu đồ sự kiện
const eventData = [
  { name: 'T1', count: 20 },
  { name: 'T2', count: 25 },
  { name: 'T3', count: 30 },
  { name: 'T4', count: 35 },
  { name: 'T5', count: 40 },
  { name: 'T6', count: 45 },
  { name: 'T7', count: 50 },
  { name: 'T8', count: 55 },
  { name: 'T9', count: 60 },
  { name: 'T10', count: 65 },
  { name: 'T11', count: 70 },
  { name: 'T12', count: 75 },
];

// Dữ liệu mẫu cho biểu đồ câu lạc bộ theo thể loại
const clubCategoryData = [
  { name: 'Bóng đá', value: 35 },
  { name: 'Cầu lông', value: 25 },
  { name: 'Bóng bàn', value: 15 },
  { name: 'Tennis', value: 10 },
  { name: 'Bơi lội', value: 8 },
  { name: 'Khác', value: 7 },
];

// Dữ liệu mẫu cho biểu đồ báo cáo
const reportData = [
  { name: 'T1', resolved: 10, pending: 5 },
  { name: 'T2', resolved: 12, pending: 6 },
  { name: 'T3', resolved: 15, pending: 8 },
  { name: 'T4', resolved: 18, pending: 7 },
  { name: 'T5', resolved: 20, pending: 9 },
  { name: 'T6', resolved: 22, pending: 10 },
  { name: 'T7', resolved: 25, pending: 12 },
  { name: 'T8', resolved: 28, pending: 14 },
  { name: 'T9', resolved: 30, pending: 15 },
  { name: 'T10', resolved: 32, pending: 16 },
  { name: 'T11', resolved: 35, pending: 18 },
  { name: 'T12', resolved: 38, pending: 20 },
];

// Màu sắc cho biểu đồ tròn
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState('year');
  const [chartData, setChartData] = useState({
    users: userActivityData,
    events: eventData,
    reports: reportData
  });

  // Giả lập thay đổi dữ liệu khi thay đổi khoảng thời gian
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call để lấy dữ liệu theo khoảng thời gian
    if (timeRange === 'month') {
      // Dữ liệu cho 30 ngày gần nhất
      const days = Array.from({ length: 30 }, (_, i) => ({ name: `${i + 1}`, active: Math.floor(Math.random() * 100) + 20, new: Math.floor(Math.random() * 50) + 5 }));
      const eventDays = Array.from({ length: 30 }, (_, i) => ({ name: `${i + 1}`, count: Math.floor(Math.random() * 10) + 1 }));
      const reportDays = Array.from({ length: 30 }, (_, i) => ({ name: `${i + 1}`, resolved: Math.floor(Math.random() * 5) + 1, pending: Math.floor(Math.random() * 3) }));
      
      setChartData({
        users: days,
        events: eventDays,
        reports: reportDays
      });
    } else if (timeRange === 'week') {
      // Dữ liệu cho 7 ngày gần nhất
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => ({ name: day, active: Math.floor(Math.random() * 100) + 20, new: Math.floor(Math.random() * 50) + 5 }));
      const eventDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => ({ name: day, count: Math.floor(Math.random() * 10) + 1 }));
      const reportDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => ({ name: day, resolved: Math.floor(Math.random() * 5) + 1, pending: Math.floor(Math.random() * 3) }));
      
      setChartData({
        users: days,
        events: eventDays,
        reports: reportDays
      });
    } else {
      // Dữ liệu cho cả năm (mặc định)
      setChartData({
        users: userActivityData,
        events: eventData,
        reports: reportData
      });
    }
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Thống kê</h1>
          <p className="text-muted-foreground text-gray-500 dark:text-gray-400">Phân tích dữ liệu và thống kê hệ thống</p>
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
              <SelectItem value="year">12 tháng qua</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sự kiện
          </TabsTrigger>
          <TabsTrigger value="clubs" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Câu lạc bộ
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Báo cáo
          </TabsTrigger>
        </TabsList>

        {/* Thống kê người dùng */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.3% so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">450</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +7.2% so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,000</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% so với kỳ trước
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hoạt động người dùng</CardTitle>
              <CardDescription>
                Số lượng người dùng hoạt động và người dùng mới theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData.users}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#8884d8" name="Người dùng hoạt động" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="new" stroke="#82ca9d" name="Người dùng mới" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thống kê sự kiện */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tổng sự kiện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +10.5% so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sự kiện đang diễn ra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <Activity className="h-3 w-3 mr-1" />
                  Đang hoạt động
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sự kiện sắp tới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground flex items-center text-blue-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  Trong 30 ngày tới
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Số lượng sự kiện</CardTitle>
              <CardDescription>
                Số lượng sự kiện được tạo theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.events}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Số lượng sự kiện" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thống kê câu lạc bộ */}
        <TabsContent value="clubs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tổng câu lạc bộ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3% so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Câu lạc bộ mới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Thành viên trung bình</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.5% so với kỳ trước
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố câu lạc bộ theo thể loại</CardTitle>
              <CardDescription>
                Tỷ lệ câu lạc bộ theo từng thể loại thể thao
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clubCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clubCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} câu lạc bộ`, 'Số lượng']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thống kê báo cáo */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tổng báo cáo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">58</div>
                <p className="text-xs text-muted-foreground flex items-center text-yellow-600">
                  <Activity className="h-3 w-3 mr-1" />
                  +12.5% so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Báo cáo đã giải quyết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.2% so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Báo cáo chờ xử lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20</div>
                <p className="text-xs text-muted-foreground flex items-center text-red-600">
                  <Flag className="h-3 w-3 mr-1" />
                  Cần xử lý
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tình trạng báo cáo</CardTitle>
              <CardDescription>
                Số lượng báo cáo đã giải quyết và đang chờ xử lý theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.reports}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="resolved" name="Đã giải quyết" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="pending" name="Chờ xử lý" stackId="a" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
