# AI Grievance Portal

A comprehensive AI-powered civic complaint management platform where citizens can submit complaints about public issues and government departments can manage and resolve them efficiently.

## Features

### 🏛️ For Citizens
- **Easy Complaint Submission**: Submit complaints with photos, location, and detailed descriptions
- **AI-Powered Categorization**: Automatic department assignment based on complaint content
- **Priority Detection**: AI analyzes urgency and assigns priority levels (Red/Yellow/Green)
- **Real-time Tracking**: Monitor complaint status from submission to resolution
- **Duplicate Detection**: Identifies similar complaints to avoid duplicates
- **Multi-language Support**: Detects and translates complaints from various languages
- **Reward System**: Earn points for submitting complaints and community engagement
- **Upvote System**: Support complaints from other citizens

### 👨‍💼 For Administrators
- **Comprehensive Dashboard**: View all complaints with advanced filtering
- **Analytics & Insights**: Track performance metrics and trends
- **Department-wise Management**: Filter and manage complaints by department
- **Status Updates**: Update complaint status and add admin notes
- **User Management**: Manage citizen accounts and permissions
- **Bulk Operations**: Efficiently handle multiple complaints

### 🤖 AI Features
- **Smart Categorization**: Automatically routes complaints to appropriate departments
- **Priority Scoring**: Analyzes text content for urgency indicators
- **Duplicate Detection**: Prevents duplicate complaints using similarity algorithms
- **Language Processing**: Supports multiple Indian languages
- **Intelligent Suggestions**: Provides automated responses and next steps

### 🔒 Security & Performance
- **JWT Authentication**: Secure user authentication and authorization
- **Role-Based Access Control**: Different access levels for citizens and admins
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Input Validation**: Comprehensive validation for all user inputs
- **XSS & SQL Injection Protection**: Built-in security measures

## Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Helmet** - Security middleware

### AI/NLP Processing
- **Natural** - Natural language processing
- **Franc** - Language detection
- **Compromise** - Text analysis
- **Translate Tools** - Multi-language support

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_Grievance_Portal
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Backend (create `.env` file in `backend/`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ai-grievance-portal
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   ```
   
   Frontend (create `.env` file in `frontend/`):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in backend/.env
   ```

6. **Run the Application**
   
   Start Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Start Frontend:
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Health Check: http://localhost:5000/api/health

## API Endpoints

### Authentication (per prompt)
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/user/profile` - Get user profile (JWT required)
- `PUT /api/user/profile` - Update profile
- `PUT /api/change-password` - Change password

### Complaints
- `POST /api/complaints/submit` - Submit new complaint
- `GET /api/complaints` - Get all complaints (Admin only)
- `GET /api/complaints/user/:userId` - Get user complaints
- `GET /api/complaints/status/:complaintId` - Track complaint
- `PUT /api/complaints/update-status` - Update status (Admin only)
- `POST /api/complaints/upvote` - Upvote complaint
- `GET /api/complaints/analytics` - Get analytics (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/leaderboard/top` - Get top users

### Chatbot
- `POST /api/chatbot` - Chat with AI assistant
- `GET /api/chatbot/info` - Get chatbot info

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (citizen/admin),
  reward_points: Number,
  is_active: Boolean,
  created_at: Date,
  last_login: Date
}
```

### Complaints Collection
```javascript
{
  complaint_id: String (unique),
  user_id: ObjectId,
  complaint_text: String,
  translated_text: String,
  location: String,
  pincode: String,
  uploaded_image_url: String,
  department: String,
  priority_level: String (Red/Yellow/Green),
  status: String (Pending/In Progress/Resolved),
  upvotes: Number,
  is_duplicate: Boolean,
  ai_suggestions: String,
  admin_notes: String,
  created_at: Date,
  updated_at: Date,
  resolved_date: Date
}
```

### Departments Collection
```javascript
{
  department_name: String (unique),
  department_email: String,
  department_head: String,
  contact_phone: String,
  is_active: Boolean
}
```

## Deployment

### Backend Deployment (Hostinger/Node.js Hosting)
1. Install dependencies: `npm install --production`
2. Set environment variables
3. Start server: `npm start`

### Frontend Deployment
1. Build the app: `npm run build`
2. Deploy the `build` folder to your hosting service

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and queries:
- Email: support@aigrievance.com
- Phone: 1800-123-4567
- Documentation: Check the built-in chatbot assistant

## Acknowledgments

- Built with React.js and Node.js
- Powered by MongoDB
- AI processing with Natural Language Processing libraries
- Icons by Lucide React
