import React, { useState, useEffect, useCallback } from 'react';
import { keyframes } from '@emotion/react';
import { useAuth } from '../context/AuthContext';
import { complaintsAPI } from '../services/api';
import { 
  Plus, 
  FileText, 
  Clock, 
  AlertCircle,
  ThumbsUp,
  Eye,
  Award,
  Search,
  Filter,
  ClipboardList,
  Hourglass,
  TrendingUp,
  MapPin
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getPriorityColor, getStatusColor, timeAgo, truncateText } from '../utils/helpers';

// Chart imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
  Area,
  AreaChart
} from 'recharts';

// Material Dashboard Components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import CheckCircle from "@mui/icons-material/CheckCircle";

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [activeTab] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [trendTimeRange, setTrendTimeRange] = useState('month'); // 'day' | 'week' | 'month'
  const [weekRange, setWeekRange] = useState('this'); // 'this' | 'last' for activity chart

  const fetchComplaints = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setBackendError(false);
      const response = await complaintsAPI.getUserComplaints(user.id);
      setComplaints(response.data?.complaints ?? []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setComplaints([]);
      const isNetworkError = error?.message?.includes('Network Error') || error?.code === 'ERR_NETWORK' || (error?.response?.status === undefined && error?.message);
      if (isNetworkError || error?.response?.status >= 500) {
        setBackendError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Open submit modal when navigating from sidebar (e.g. /dashboard#submit)
  useEffect(() => {
    if (window.location.hash === '#submit') {
      setShowSubmitForm(true);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // Auto-refresh every 30 seconds
  const getComplaintStats = () => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const totalUpvotes = complaints.reduce((sum, c) => sum + c.upvotes, 0);

    return { total, pending, inProgress, resolved, totalUpvotes };
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.complaint_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = getComplaintStats();

  // Theme-aligned palette for charts (defined after stats, used in JSX)
  const chartColors = {
    pending: '#fb8c00',
    inProgress: '#1A73E8',
    resolved: '#4CAF50',
    primary: '#344767',
  };

  // Prepare chart data – same palette as stats cards
  const statusData = [
    { name: 'Pending', value: stats.pending, color: chartColors.pending },
    { name: 'In Progress', value: stats.inProgress, color: chartColors.inProgress },
    { name: 'Resolved', value: stats.resolved, color: chartColors.resolved },
  ];

  // Trend data from real complaints (day = 24h, week = 7 days, month = 12 months). Unified shape: { label, complaints }
  const trendChartData = React.useMemo(() => {
    const now = new Date();
    const parseDate = (c) => (c?.created_at ? new Date(c.created_at) : null);

    if (trendTimeRange === 'day') {
      const buckets = Array.from({ length: 24 }, (_, i) => ({ label: `${i}:00`, complaints: 0 }));
      complaints.forEach((c) => {
        const d = parseDate(c);
        if (!d) return;
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        if (d >= today) buckets[d.getHours()].complaints += 1;
      });
      return buckets;
    }
    if (trendTimeRange === 'week') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const buckets = days.map((name) => ({ label: name, complaints: 0 }));
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      complaints.forEach((c) => {
        const d = parseDate(c);
        if (!d || d < weekStart) return;
        buckets[d.getDay()].complaints += 1;
      });
      return buckets;
    }
    // month: last 12 months
    const buckets = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        complaints: 0,
        _date: d
      });
    }
    complaints.forEach((c) => {
      const d = parseDate(c);
      if (!d) return;
      const idx = (d.getFullYear() - buckets[0]._date.getFullYear()) * 12 + (d.getMonth() - buckets[0]._date.getMonth());
      if (idx >= 0 && idx < 12) buckets[idx].complaints += 1;
    });
    return buckets.map(({ label, complaints: count }) => ({ label, complaints: count }));
  }, [complaints, trendTimeRange]);

  // Activity this week / last week (bar chart: 7 days)
  const weekActivityData = React.useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() + mondayOffset);
    thisMonday.setHours(0, 0, 0, 0);
    const weekStart = new Date(thisMonday);
    if (weekRange === 'last') weekStart.setDate(weekStart.getDate() - 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const buckets = days.map((name, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return { name: `${name} ${d.getDate()}`, complaints: 0 };
    });

    complaints.forEach((c) => {
      if (!c?.created_at) return;
      const d = new Date(c.created_at);
      if (d >= weekStart && d < weekEnd) {
        const dayIndex = (d.getDay() + 6) % 7;
        buckets[dayIndex].complaints += 1;
      }
    });
    return buckets;
  }, [complaints, weekRange]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <LoadingSpinner size="large" />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2.5}>
        {/* Welcome & info – clear layout, not cramped */}
        <MDBox
          mb={3}
          p={3}
          borderRadius="lg"
          bgColor="white"
          shadow="sm"
          sx={{ border: '1px solid', borderColor: 'grey.300' }}
        >
          <MDBox display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="flex-start" gap={3}>
            <MDBox flex="1 1 280px" minWidth={0}>
              <MDTypography variant="h4" fontWeight="bold" color="dark" sx={{ letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                Welcome back, {user?.name || 'User'}!
              </MDTypography>
              <MDTypography variant="body2" color="text" sx={{ mt: 1, opacity: 0.9, display: 'block' }}>
                Manage your complaints and track their progress
              </MDTypography>
              <MDBox mt={2.5} display="flex" flexDirection="column" gap={1.5}>
                <MDBox display="flex" alignItems="center" gap={1.5}>
                  <Award size={22} style={{ color: '#fb8c00', flexShrink: 0 }} />
                  <MDTypography variant="button" fontWeight="semibold" color="dark">
                    {user?.reward_points ?? 0} Reward Points
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text" sx={{ opacity: 0.85 }}>
                  Member since {formatDate(user?.created_at)}
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox display="flex" flexDirection="column" alignItems="flex-end" gap={2} flexShrink={0}>
              {lastUpdate && !backendError && (
                <MDBox display="flex" alignItems="center" gap={1}>
                  <MDBox width={8} height={8} borderRadius="50%" bgColor="success" sx={{ animation: 'pulse 1.5s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />
                  <MDTypography variant="caption" color="text">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </MDTypography>
                </MDBox>
              )}
              <MDBox display="flex" gap={1.5} flexWrap="wrap" justifyContent="flex-end">
                <MDButton variant="gradient" color="info" onClick={() => setShowSubmitForm(true)} startIcon={<Plus size={18} />} size="medium">
                  Submit new complaint
                </MDButton>
                <MDButton variant="outlined" color="info" onClick={() => window.location.href = '/track'} startIcon={<Eye size={18} />} size="medium">
                  Track complaint
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Backend error banner */}
        {backendError && (
          <MDBox mb={2} p={2} borderRadius="lg" bgColor="error" sx={{ border: '1px solid', borderColor: 'error.main', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <AlertCircle size={20} style={{ color: '#fff', flexShrink: 0 }} />
            <MDBox flex={1} minWidth={0}>
              <MDTypography variant="body2" fontWeight="medium" color="white">
                Backend server is not running
              </MDTypography>
              <MDTypography variant="caption" color="white" opacity={0.9}>
                Please start the backend (e.g. <code style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4 }}>npm start</code> in the backend folder). Then click Retry.
              </MDTypography>
            </MDBox>
            <MDButton variant="contained" color="light" size="small" onClick={fetchComplaints}>
              Retry
            </MDButton>
          </MDBox>
        )}

        {/* Stats Cards – wider and bigger */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
              <ComplexStatisticsCard color="dark" icon={<ClipboardList size={22} strokeWidth={2} />} title="Total Complaints" count={stats.total} percentage={{ color: "dark", amount: "", label: "All time" }} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
              <ComplexStatisticsCard color="warning" icon={<Hourglass size={22} strokeWidth={2} />} title="Pending" count={stats.pending} percentage={{ color: "warning", amount: "", label: "Awaiting action" }} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
              <ComplexStatisticsCard color="info" icon={<TrendingUp size={22} strokeWidth={2} />} title="In Progress" count={stats.inProgress} percentage={{ color: "info", amount: "", label: "Being addressed" }} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
              <ComplexStatisticsCard color="success" icon={<CheckCircle sx={{ fontSize: 22 }} />} title="Resolved" count={stats.resolved} percentage={{ color: "success", amount: "", label: "Completed" }} />
            </Grid>
          </Grid>
        </MDBox>

        {/* Row 1: Bar + Line charts – same size panels, same chart height */}
        <MDBox mb={2.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <MDBox bgColor="white" borderRadius="lg" p={2} shadow="sm" sx={{ border: '1px solid', borderColor: 'grey.300', height: '100%', minHeight: 340 }}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={1}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" sx={{ fontSize: '1rem' }}>Activity by week</MDTypography>
                  <MDBox component="select" value={weekRange} onChange={(e) => setWeekRange(e.target.value)} sx={{ fontSize: 13, padding: '5px 10px', borderRadius: 1, border: '1px solid', borderColor: 'grey.400', backgroundColor: 'white', color: 'grey.700', cursor: 'pointer', minWidth: 110 }}>
                    <option value="this">This week</option>
                    <option value="last">Last week</option>
                  </MDBox>
                </MDBox>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={weekActivityData} margin={{ top: 8, right: 8, bottom: 36, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#495057' }} angle={-25} textAnchor="end" height={40} interval={0} />
                    <YAxis width={28} tick={{ fontSize: 10, fill: '#495057' }} />
                    <Tooltip />
                    <Bar dataKey="complaints" name="Complaints" fill={chartColors.inProgress} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </MDBox>
            </Grid>
            <Grid item xs={12} lg={6}>
              <MDBox bgColor="white" borderRadius="lg" p={2} shadow="sm" sx={{ border: '1px solid', borderColor: 'grey.300', height: '100%', minHeight: 340 }}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={1}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" sx={{ fontSize: '1rem' }}>Complaint trends</MDTypography>
                  <MDBox display="flex" gap={0.5} flexWrap="wrap">
                    {['day', 'week', 'month'].map((range) => (
                      <MDButton key={range} variant={trendTimeRange === range ? 'gradient' : 'outlined'} color="info" size="small" onClick={() => setTrendTimeRange(range)} sx={{ textTransform: 'capitalize', minWidth: 56, py: 0.5, fontSize: '0.75rem' }}>
                        {range === 'day' ? 'Day' : range === 'week' ? 'Week' : 'Month'}
                      </MDButton>
                    ))}
                  </MDBox>
                </MDBox>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={trendChartData} margin={{ top: 8, right: 8, bottom: 20, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#495057' }} interval={trendTimeRange === 'day' ? 2 : 0} />
                    <YAxis width={28} tick={{ fontSize: 10, fill: '#495057' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="complaints" name="Complaints" stroke={chartColors.inProgress} fill={chartColors.inProgress} fillOpacity={0.35} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Row 2: Pie + Recent activity – equal 50/50 panels, same height */}
        <MDBox mb={2.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <MDBox bgColor="white" borderRadius="lg" p={2} shadow="sm" sx={{ border: '1px solid', borderColor: 'grey.300', height: '100%', minHeight: 340 }}>
                <MDTypography variant="h6" fontWeight="bold" color="dark" mb={1} sx={{ fontSize: '1rem' }}>Complaint Status Distribution</MDTypography>
                <ResponsiveContainer width="100%" height={280}>
                  {stats.total === 0 ? (
                    <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" sx={{ color: 'grey.500' }}>
                      <MDTypography variant="body2">No complaints yet</MDTypography>
                      <MDTypography variant="caption" sx={{ mt: 0.5 }}>Submit a complaint to see distribution</MDTypography>
                    </MDBox>
                  ) : (
                    <PieChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
                      <Pie
                        data={statusData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="78%"
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                      >
                        {(statusData.filter(d => d.value > 0)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                        <LabelList
                          dataKey="value"
                          position="outside"
                          formatter={(value, entry) => `${value} (${stats.total ? Math.round((value / stats.total) * 100) : 0}%)`}
                          style={{ fontSize: 12, fontWeight: 500, fill: '#495057' }}
                        />
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, 'Count']}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                        labelFormatter={(name) => name}
                      />
                      <Legend
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        wrapperStyle={{ paddingTop: 12 }}
                        iconType="circle"
                        iconSize={10}
                        formatter={(value, entry) => <span style={{ color: '#495057', fontSize: 13 }}>{value}</span>}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </MDBox>
            </Grid>
            <Grid item xs={12} lg={6}>
              <MDBox bgColor="white" borderRadius="lg" p={2} shadow="sm" sx={{ border: '1px solid', borderColor: 'grey.300', height: '100%', minHeight: 340 }}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" sx={{ fontSize: '1rem' }}>Recent activity</MDTypography>
                  <MDButton variant="outlined" color="info" size="small" onClick={fetchComplaints} sx={{ minWidth: 0, py: 0.5, fontSize: '0.75rem' }}>Refresh</MDButton>
                </MDBox>
                {complaints.length === 0 ? (
                  <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={5}>
                    <FileText style={{ fontSize: 40, color: '#9CA3AF' }} />
                    <MDTypography variant="body2" color="text" mt={1}>No complaints yet</MDTypography>
                    <MDButton variant="gradient" color="info" size="small" onClick={() => setShowSubmitForm(true)} sx={{ mt: 1.5 }}>Submit your first complaint</MDButton>
                  </MDBox>
                ) : (
                  <MDBox component="table" width="100%" sx={{ borderCollapse: 'collapse', '& th, & td': { borderBottom: '1px solid', borderColor: 'grey.200', py: 1.25, px: 1, textAlign: 'left', fontSize: '0.8125rem' }, '& th': { fontWeight: 600, color: 'grey.700' }, '& tbody tr:hover': { bgcolor: 'grey.50' } }}>
                    <thead>
                      <tr>
                        <th>Complaint</th>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 6).map((complaint) => (
                        <tr key={complaint._id}>
                          <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={complaint.complaint_text}>{truncateText(complaint.complaint_text, 40)}</td>
                          <td>{complaint.complaint_id}</td>
                          <td>
                            <MDBox
                              component="span"
                              px={1}
                              py={0.5}
                              borderRadius="md"
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                ...(complaint.status === 'Pending' && { bgcolor: 'rgba(251,140,0,0.12)', color: '#e65100' }),
                                ...(complaint.status === 'In Progress' && { bgcolor: 'rgba(26,115,232,0.12)', color: '#1A73E8' }),
                                ...(complaint.status === 'Resolved' && { bgcolor: 'rgba(76,175,80,0.12)', color: '#2e7d32' }),
                                ...(!['Pending', 'In Progress', 'Resolved'].includes(complaint.status) && { bgcolor: 'grey.200', color: 'grey.700' }),
                              }}
                            >
                              {complaint.status}
                            </MDBox>
                          </td>
                          <td>{timeAgo(complaint.created_at)}</td>
                          <td>
                            <MDButton variant="text" color="info" size="small" onClick={() => window.location.href = `/track/${complaint.complaint_id}`}>View</MDButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </MDBox>
                )}
                {complaints.length > 6 && (
                  <MDBox textAlign="right" mt={1.5}>
                    <MDButton variant="text" color="info" size="small" onClick={() => window.location.href = '/track'}>View all →</MDButton>
                  </MDBox>
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Tabs Content (complaints list view) */}
        <MDBox>
          {activeTab === 'overview' && (
            <MDBox />
          )}

          {activeTab === 'complaints' && (
            <MDBox>
              {/* Search and Filter */}
              <MDBox mb={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <MDInput
                      fullWidth
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <Search style={{ marginRight: '8px', color: '#9CA3AF' }} />
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MDInput
                      fullWidth
                      select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      SelectProps={{
                        native: true,
                      }}
                      InputProps={{
                        startAdornment: <Filter style={{ marginRight: '8px', color: '#9CA3AF' }} />
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </MDInput>
                  </Grid>
                </Grid>
              </MDBox>

              {/* Complaints List */}
              {filteredComplaints.length === 0 ? (
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  py={6}
                >
                  <AlertCircle style={{ fontSize: '48px', color: '#9CA3AF', marginBottom: '16px' }} />
                  <MDTypography variant="h6" color="text">
                    No complaints found
                  </MDTypography>
                </MDBox>
              ) : (
                <MDBox>
                  {filteredComplaints.map((complaint) => (
                    <MDBox
                      key={complaint._id}
                      component="div"
                      borderRadius="lg"
                      shadow="sm"
                      p={3}
                      mb={2}
                      border="1px solid #E5E7EB"
                      sx={{ 
                        '&:hover': { 
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                    >
                      <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <MDBox flex={1}>
                          <MDBox display="flex" alignItems="center" gap={2} mb={2}>
                            <MDTypography variant="h6" fontWeight="medium">
                              {complaint.complaint_id}
                            </MDTypography>
                            <MDBox
                              px={2}
                              py={0.5}
                              borderRadius="lg"
                              sx={{
                                backgroundColor: getPriorityColor(complaint.priority_level).replace('text-', 'bg-').replace('-600', '-100'),
                                color: getPriorityColor(complaint.priority_level).replace('text-', 'text-')
                              }}
                            >
                              <MDTypography variant="caption" fontWeight="medium">
                                {complaint.priority_level}
                              </MDTypography>
                            </MDBox>
                            <MDBox
                              px={2}
                              py={0.5}
                              borderRadius="lg"
                              sx={{
                                backgroundColor: getStatusColor(complaint.status).replace('text-', 'bg-').replace('-600', '-100'),
                                color: getStatusColor(complaint.status).replace('text-', 'text-')
                              }}
                            >
                              <MDTypography variant="caption" fontWeight="medium">
                                {complaint.status}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                          <MDTypography variant="body2" color="text" mb={2}>
                            {complaint.complaint_text}
                          </MDTypography>
                          <MDBox display="flex" gap={3}>
                            <MDBox display="flex" alignItems="center">
                              <FileText style={{ fontSize: '16px', marginRight: '4px', color: '#6B7280' }} />
                              <MDTypography variant="caption" color="text">
                                {complaint.department}
                              </MDTypography>
                            </MDBox>
                            <MDBox display="flex" alignItems="center">
                              <Clock style={{ fontSize: '16px', marginRight: '4px', color: '#6B7280' }} />
                              <MDTypography variant="caption" color="text">
                                {timeAgo(complaint.created_at)}
                              </MDTypography>
                            </MDBox>
                            <MDBox display="flex" alignItems="center">
                              <ThumbsUp style={{ fontSize: '16px', marginRight: '4px', color: '#6B7280' }} />
                              <MDTypography variant="caption" color="text">
                                {complaint.upvotes} upvotes
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      <MDBox display="flex" justifyContent="flex-end">
                        <MDButton
                          variant="text"
                          color="info"
                          size="small"
                          onClick={() => window.location.href = `/track/${complaint.complaint_id}`}
                        >
                          View Details
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  ))}
                </MDBox>
              )}
            </MDBox>
          )}
        </MDBox>
      </MDBox>

      {/* Submit Complaint Modal - solid background for visibility */}
      {showSubmitForm && (
        <MDBox
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            zIndex: 1300,
          }}
        >
          <MDBox
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
              maxWidth: 800,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid #e0e0e0',
            }}
          >
            <MDBox p={4} sx={{ color: '#1a1a1a' }}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <MDTypography variant="h4" fontWeight="medium" color="dark">
                  Submit New Complaint
                </MDTypography>
                <MDButton
                  variant="text"
                  color="dark"
                  onClick={() => setShowSubmitForm(false)}
                  iconOnly
                  sx={{
                    minWidth: 48,
                    minHeight: 48,
                    fontSize: '1.75rem',
                    fontWeight: 300,
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  ×
                </MDButton>
              </MDBox>
              
              <ComplaintSubmissionForm 
                onSuccess={() => {
                  setShowSubmitForm(false);
                  fetchComplaints();
                }}
              />
            </MDBox>
          </MDBox>
        </MDBox>
      )}

      <Footer />
    </DashboardLayout>
  );
};

// Complaint Submission Form Component
const ComplaintSubmissionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    complaint_text: '',
    location: '',
    pincode: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: 'Geolocation is not supported by your browser.' }));
      return;
    }
    setGpsLoading(true);
    setErrors(prev => ({ ...prev, location: '', pincode: '' }));
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          if (data && data.address) {
            const a = data.address;
            const parts = [a.road, a.suburb, a.village, a.town, a.city, a.state_district, a.state].filter(Boolean);
            const locationStr = parts.length ? parts.join(', ') : (data.display_name || '');
            const pincodeStr = (a.postcode && String(a.postcode).replace(/\s/g, '').slice(0, 6)) || '';
            setFormData(prev => ({
              ...prev,
              location: locationStr || prev.location,
              pincode: pincodeStr || prev.pincode,
            }));
          }
        } catch (err) {
          setErrors(prev => ({ ...prev, location: 'Could not fetch address from coordinates.' }));
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        const msg = err.code === 1 ? 'Location permission denied.' : err.code === 2 ? 'Location unavailable.' : 'Could not get your location.';
        setErrors(prev => ({ ...prev, location: msg }));
      }
    );
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.complaint_text.trim()) {
      newErrors.complaint_text = 'Complaint text is required';
    } else if (formData.complaint_text.trim().length < 10) {
      newErrors.complaint_text = 'Complaint text must be at least 10 characters';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await complaintsAPI.submit(formData);
      if (response.data) {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess();
        }, 2200);
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setErrors({ general: error.response?.data?.error || 'Failed to submit complaint' });
    } finally {
      setLoading(false);
    }
  };

  const successFadeIn = keyframes`
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  `;
  const successCheckPop = keyframes`
    0% { transform: scale(0); opacity: 0; }
    55% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  `;

  if (submitted) {
    return (
      <MDBox
        py={6}
        px={4}
        textAlign="center"
        sx={{ animation: `${successFadeIn} 0.45s ease-out` }}
      >
        <CheckCircle
          sx={{
            fontSize: 72,
            color: '#22c55e',
            display: 'block',
            mx: 'auto',
            animation: `${successCheckPop} 0.5s ease-out 0.1s both`,
          }}
        />
        <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#16a34a', mt: 2 }}>
          Submitted successfully!
        </MDTypography>
        <MDTypography variant="body2" color="text" mt={1}>
          Your complaint has been registered. You can track it from the dashboard.
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <MDAlert color="error" mb={3}>
          {errors.general}
        </MDAlert>
      )}
      
      <MDBox mb={3}>
        <MDTypography variant="h6" fontWeight="medium" mb={1}>
          Complaint Details *
        </MDTypography>
        <MDInput
          fullWidth
          multiline
          rows={4}
          name="complaint_text"
          value={formData.complaint_text}
          onChange={handleChange}
          error={!!errors.complaint_text}
          helperText={errors.complaint_text}
          placeholder="Describe your complaint in detail..."
        />
      </MDBox>

      <MDBox mb={3}>
        <MDTypography variant="h6" fontWeight="medium" mb={1}>
          Location *
        </MDTypography>
        <MDInput
          fullWidth
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={!!errors.location}
          helperText={errors.location}
          placeholder="Enter the location of the issue"
        />
      </MDBox>

      <MDBox mb={3}>
        <MDTypography variant="h6" fontWeight="medium" mb={1}>
          Pincode *
        </MDTypography>
        <MDInput
          fullWidth
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          inputProps={{ maxLength: 6 }}
          error={!!errors.pincode}
          helperText={errors.pincode}
          placeholder="Enter 6-digit pincode"
        />
      </MDBox>

      <MDBox mb={3} display="flex" alignItems="center" gap={1}>
        <MDButton
          type="button"
          variant="outlined"
          color="info"
          size="small"
          onClick={handleGetLocation}
          disabled={gpsLoading}
          startIcon={<MapPin size={18} />}
        >
          {gpsLoading ? 'Getting location...' : 'Use my location (GPS)'}
        </MDButton>
      </MDBox>

      <MDBox mb={3}>
        <MDTypography variant="h6" fontWeight="medium" mb={1}>
          Upload Image (Optional)
        </MDTypography>
        <MDInput
          fullWidth
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />
        <MDTypography variant="caption" color="text" mt={1}>
          Supported formats: JPEG, JPG, PNG, GIF (Max size: 5MB)
        </MDTypography>
      </MDBox>

      <MDBox display="flex" justifyContent="flex-end" gap={2}>
        <MDButton
          variant="outlined"
          color="info"
          onClick={onSuccess}
        >
          Cancel
        </MDButton>
        <MDButton
          variant="gradient"
          color="info"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </MDButton>
      </MDBox>
    </form>
  );
};

export default CitizenDashboard;
