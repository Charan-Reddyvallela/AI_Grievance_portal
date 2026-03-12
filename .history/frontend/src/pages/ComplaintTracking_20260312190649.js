import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Building, 
  ThumbsUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getPriorityColor, getStatusColor, timeAgo } from '../utils/helpers';
import PageLayout from 'examples/LayoutContainers/PageLayout';
import DefaultNavbar from 'examples/Navbars/DefaultNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

const ComplaintTracking = () => {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvoting, setUpvoting] = useState(false);
  const [searchId, setSearchId] = useState(complaintId || '');

  useEffect(() => {
    if (complaintId) {
      fetchComplaint(complaintId);
    } else {
      setLoading(false);
    }
  }, [complaintId]);

  const fetchComplaint = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintsAPI.getByStatus(id);
      setComplaint(response.data.complaint);
    } catch (error) {
      console.error('Failed to fetch complaint:', error);
      setError(error.response?.data?.error || 'Complaint not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchComplaint(searchId.trim());
    }
  };

  const handleUpvote = async () => {
    try {
      setUpvoting(true);
      await complaintsAPI.upvote({ complaint_id: complaint.complaint_id });
      setComplaint(prev => ({
        ...prev,
        upvotes: prev.upvotes + 1
      }));
    } catch (error) {
      console.error('Failed to upvote:', error);
      alert(error.response?.data?.error || 'Failed to upvote complaint');
    } finally {
      setUpvoting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5" />;
      case 'In Progress':
        return <TrendingUp className="h-5 w-5" />;
      case 'Resolved':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <DefaultNavbar />
        <MDBox minHeight="75vh" display="flex" alignItems="center" justifyContent="center">
          <LoadingSpinner size="large" />
        </MDBox>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DefaultNavbar action={{ type: 'internal', route: '/register', label: 'Sign up', color: 'info' }} />
      <MDBox py={6} px={{ xs: 2, sm: 3 }} sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Search Section */}
        <MDBox
          borderRadius="lg"
          shadow="md"
          p={4}
          mb={4}
          sx={{ backgroundColor: 'background.default' }}
        >
          <MDTypography variant="h4" fontWeight="bold" color="dark" mb={3}>
            Track Your Complaint
          </MDTypography>
          <form onSubmit={handleSearch}>
            <MDBox display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
              <MDInput
                fullWidth
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Complaint ID (e.g., COMP123456789ABC)"
              />
              <MDButton type="submit" variant="gradient" color="info" sx={{ minWidth: 120 }}>
                Search
              </MDButton>
            </MDBox>
          </form>
          <MDTypography variant="caption" color="text" mt={2} display="block">
            Enter the complaint ID you received when you submitted your complaint.
          </MDTypography>
        </MDBox>

        {/* Error State */}
        {error && (
          <MDBox
            p={4}
            mb={4}
            borderRadius="lg"
            textAlign="center"
            sx={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
          >
            <AlertCircle style={{ fontSize: 48, marginBottom: 16, color: '#dc2626' }} />
            <MDTypography variant="h6" fontWeight="bold" color="error" mb={1}>Complaint Not Found</MDTypography>
            <MDTypography variant="body2" color="text" mb={2}>{error}</MDTypography>
            <MDTypography variant="caption" color="text">
              Please check the Complaint ID and try again, or contact support if you continue to have issues.
            </MDTypography>
          </MDBox>
        )}

        {/* Complaint Details */}
        {complaint && (
          <MDBox>
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {complaint.complaint_id}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority_level)}`}>
                      {complaint.priority_level} Priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1">{complaint.status}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleUpvote}
                  disabled={upvoting}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{complaint.upvotes}</span>
                  {upvoting && <LoadingSpinner size="small" />}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium text-gray-900">{complaint.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{complaint.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Pincode</p>
                      <p className="font-medium text-gray-900">{complaint.pincode}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-medium text-gray-900">{formatDate(complaint.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-900">{timeAgo(complaint.updated_at)}</p>
                    </div>
                  </div>
                  {complaint.resolved_date && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Resolved On</p>
                        <p className="font-medium text-gray-900">{formatDate(complaint.resolved_date)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Complaint Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Details</h3>
              <p className="text-gray-700 leading-relaxed">{complaint.complaint_text}</p>
              {complaint.uploaded_image_url && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Attached Image:</p>
                  <img 
                    src={complaint.uploaded_image_url} 
                    alt="Complaint attachment" 
                    className="max-w-md rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Admin Notes */}
            {complaint.admin_notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-md border border-blue-200">
                  {complaint.admin_notes}
                </p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Complaint Submitted</p>
                    <p className="text-sm text-gray-500">{formatDate(complaint.created_at)}</p>
                  </div>
                </div>
                
                {complaint.status === 'In Progress' && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Under Review</p>
                      <p className="text-sm text-gray-500">Your complaint is being processed</p>
                    </div>
                  </div>
                )}
                
                {complaint.status === 'Resolved' && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Resolved</p>
                      <p className="text-sm text-gray-500">{formatDate(complaint.resolved_date)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Print Details
                </button>
                <button
                  onClick={() => navigator.share && navigator.share({
                    title: `Complaint ${complaint.complaint_id}`,
                    text: `Check out this complaint: ${complaint.complaint_text}`,
                    url: window.location.href
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Share
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Submit New Complaint
                </button>
              </div>
            </div>
          </MDBox>
        )}
      </MDBox>
    </PageLayout>
  );
};

export default ComplaintTracking;
