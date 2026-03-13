import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintsAPI } from '../services/api';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getStatusColor } from '../utils/helpers';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';

const DEPARTMENT_OPTIONS = [
  'Sanitation Department',
  'Electrical Department',
  'Water Department',
  'Roads Department',
  'Healthcare Department',
  'General Administration',
];

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved'];

function formatTableDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function exportToCsv(complaints) {
  const headers = ['Complaint ID', 'Department', 'Timestamp', 'Status', 'Location', 'Pincode'];
  const rows = complaints.map((c) => [
    c.complaint_id,
    c.department || '',
    formatTableDate(c.created_at),
    c.status || '',
    c.location || '',
    c.pincode || '',
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `complaints-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

const ComplaintsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_complaints: 0,
    per_page: 20,
  });

  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: '',
  });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPagination((p) => ({ ...p, current_page: 1 }));
  };

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        ...(filters.status && { status: filters.status }),
        ...(filters.department && { department: filters.department }),
        ...(filters.search && { search: filters.search }),
      };

      let response;
      if (isAdmin) {
        response = await complaintsAPI.getAll(params);
      } else {
        response = await complaintsAPI.getUserComplaints(user?.id, {
          page: params.page,
          limit: params.limit,
        });
      }

      const list = response.data?.complaints ?? [];
      setComplaints(list);

      if (response.data?.pagination) {
        const p = response.data.pagination;
        setPagination((prev) => ({
          ...prev,
          current_page: p.current_page ?? prev.current_page,
          total_pages: p.total_pages ?? prev.total_pages,
          total_complaints: p.total_complaints ?? prev.total_complaints,
          per_page: p.per_page ?? prev.per_page,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.id, pagination.current_page, pagination.per_page, filters.status, filters.department, filters.search]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const applyDateFilter = (list) => {
    if (!fromDate && !toDate) return list;
    return list.filter((c) => {
      const d = new Date(c.created_at).getTime();
      if (fromDate && d < new Date(fromDate).getTime()) return false;
      if (toDate && d > new Date(toDate + 'T23:59:59').getTime()) return false;
      return true;
    });
  };

  const displayedComplaints = applyDateFilter(complaints);

  const handleRefresh = () => {
    fetchComplaints();
  };

  const handleExport = () => {
    exportToCsv(displayedComplaints);
  };

  const handleView = (complaintId) => {
    navigate(`/track/${complaintId}`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 text-left">
          {/* Page title and description */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
            <p className="text-gray-600 mt-1">
              All complaints raised in the system with filtering and export options.
            </p>
          </div>

          {/* Action buttons: Refresh, Export */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RefreshIcon sx={{ fontSize: 20 }} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <FileDownloadIcon sx={{ fontSize: 20 }} />
              Export
            </button>
          </div>

          {/* Filters card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <FilterListIcon sx={{ color: 'gray', fontSize: 22 }} />
              <span className="font-medium text-gray-700">Filters</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={filters.department}
                onChange={(e) => updateFilter('department', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d.replace(' Department', '')}</option>
                ))}
              </select>
              {isAdmin && (
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                />
              )}
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <input
                  type="date"
                  placeholder="From Date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  placeholder="To Date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Complaint ID
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedComplaints.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No complaints found.
                        </td>
                      </tr>
                    ) : (
                      displayedComplaints.map((complaint) => (
                        <tr key={complaint._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            {complaint.complaint_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {complaint.department || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatTableDate(complaint.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}
                            >
                              {complaint.status || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => handleView(complaint.complaint_id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                              <VisibilityIcon sx={{ fontSize: 18 }} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {!loading && pagination.total_pages > 1 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_complaints} total)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pagination.current_page <= 1}
                  onClick={() => setPagination((p) => ({ ...p, current_page: p.current_page - 1 }))}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.current_page >= pagination.total_pages}
                  onClick={() => setPagination((p) => ({ ...p, current_page: p.current_page + 1 }))}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintsPage;
