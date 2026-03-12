import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintsAPI, usersAPI } from '../services/api';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Edit,
  Eye,
  Search
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getPriorityColor, getStatusColor, timeAgo, truncateText } from '../utils/helpers';

const AdminDashboard = () => {
  useAuth(); // ProtectedRoute already enforces admin; hook kept for future use
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    priority: '',
    pincode: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await complaintsAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }, []);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      };
      if (searchTerm) params.search = searchTerm;
      const response = await complaintsAPI.getAll(params);
      setComplaints(response.data.complaints);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll({ page: pagination.page, limit: 10 });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  useEffect(() => {
    fetchAnalytics();
    if (activeTab === 'complaints') {
      fetchComplaints();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, fetchAnalytics, fetchComplaints, fetchUsers]);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await complaintsAPI.updateStatus({
        complaint_id: complaintId,
        status: newStatus
      });
      fetchComplaints();
      fetchAnalytics();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update complaint status');
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = !searchTerm || 
      complaint.complaint_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.department || complaint.department === filters.department) &&
      (!filters.status || complaint.status === filters.status) &&
      (!filters.priority || complaint.priority_level === filters.priority) &&
      (!filters.pincode || complaint.pincode === filters.pincode);
    
    return matchesSearch && matchesFilters;
  });

  if (loading && !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-left w-full">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage complaints, users, and monitor system performance
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'complaints'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Complaints
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total_complaints}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.pending_complaints}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.in_progress_complaints}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.resolved_complaints}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Department</h3>
                <div className="space-y-3">
                  {analytics.complaints_by_department.map((dept, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{dept._id}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${(dept.count / analytics.total_complaints) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{dept.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Priority</h3>
                <div className="space-y-3">
                  {analytics.complaints_by_priority.map((priority, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getPriorityColor(priority._id)}`}>
                        {priority._id}
                      </span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              priority._id === 'Red' ? 'bg-red-500' :
                              priority._id === 'Yellow' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(priority.count / analytics.total_complaints) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{priority.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Resolved */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Resolved</h3>
              <div className="space-y-4">
                {analytics.recent_resolved.map((complaint, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{complaint.complaint_id}</h4>
                        <p className="text-gray-600 text-sm mt-1">{truncateText(complaint.complaint_text, 100)}</p>
                        <p className="text-gray-500 text-sm mt-2">
                          by {complaint.user_id.name} • {timeAgo(complaint.resolved_date)}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Resolved
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Departments</option>
                  <option value="Sanitation Department">Sanitation</option>
                  <option value="Electrical Department">Electrical</option>
                  <option value="Water Department">Water</option>
                  <option value="Roads Department">Roads</option>
                  <option value="Healthcare Department">Healthcare</option>
                </select>
                
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Priorities</option>
                  <option value="Red">Red</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Green">Green</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Pincode"
                  value={filters.pincode}
                  onChange={(e) => setFilters(prev => ({ ...prev, pincode: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Complaints List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="large" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredComplaints.map((complaint) => (
                      <div key={complaint._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {complaint.complaint_id}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority_level)}`}>
                                {complaint.priority_level}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                {complaint.status}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {truncateText(complaint.complaint_text, 150)}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {complaint.user_id?.name}
                              </span>
                              <span className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {complaint.department}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {timeAgo(complaint.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.location.href = `/track/${complaint.complaint_id}`}
                              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                            >
                              <Eye className="h-4 w-4 inline mr-1" />
                              View Details
                            </button>
                          </div>
                          
                          <div className="flex space-x-2">
                            {complaint.status === 'Pending' && (
                              <button
                                onClick={() => handleStatusUpdate(complaint.complaint_id, 'In Progress')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Start Progress
                              </button>
                            )}
                            {complaint.status === 'In Progress' && (
                              <button
                                onClick={() => handleStatusUpdate(complaint.complaint_id, 'Resolved')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Mark Resolved
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="large" />
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{user.phone}</span>
                            <span>•</span>
                            <span className="capitalize">{user.role}</span>
                            <span>•</span>
                            <span>{user.reward_points} points</span>
                            <span>•</span>
                            <span>Joined {formatDate(user.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                            <Edit className="h-4 w-4 inline mr-1" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
