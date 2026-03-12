/**
 * Seed script for AI Grievance Portal MongoDB (localhost:27017).
 * Creates database ai-grievance-portal, collections (users, complaints, departments),
 * ensures indexes, and seeds department documents.
 *
 * Run: npm run seed   (from backend folder)
 * Or:  node scripts/seedDb.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-grievance-portal';

// Department seed data (matches Complaint/Department schema enums)
const DEPARTMENTS = [
  { department_name: 'Sanitation Department', department_email: 'sanitation@example.gov', department_head: 'Head of Sanitation', contact_phone: '+91-1234567890', is_active: true },
  { department_name: 'Electrical Department', department_email: 'electrical@example.gov', department_head: 'Head of Electrical', contact_phone: '+91-1234567891', is_active: true },
  { department_name: 'Water Department', department_email: 'water@example.gov', department_head: 'Head of Water', contact_phone: '+91-1234567892', is_active: true },
  { department_name: 'Roads Department', department_email: 'roads@example.gov', department_head: 'Head of Roads', contact_phone: '+91-1234567893', is_active: true },
  { department_name: 'Healthcare Department', department_email: 'healthcare@example.gov', department_head: 'Head of Healthcare', contact_phone: '+91-1234567894', is_active: true },
  { department_name: 'General Administration', department_email: 'admin@example.gov', department_head: 'Head of General Admin', contact_phone: '+91-1234567895', is_active: true },
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB at', MONGODB_URI.replace(/\/\/[^@]+@/, '//***@'));

    const db = mongoose.connection.db;
    const dbName = db.databaseName;

    // Ensure collections exist (create empty if missing)
    const existing = await db.listCollections().toArray();
    const names = existing.map((c) => c.name);

    for (const coll of ['users', 'complaints', 'departments']) {
      if (!names.includes(coll)) {
        await db.createCollection(coll);
        console.log('Created collection:', coll);
      }
    }

    // Load models so indexes are registered, then sync indexes
    const User = require('../models/User');
    const Complaint = require('../models/Complaint');
    const Department = require('../models/Department');

    try {
      await User.createIndexes();
      await Complaint.createIndexes();
      await Department.createIndexes();
      console.log('Indexes ensured for users, complaints, departments.');
    } catch (idxErr) {
      if (idxErr.code === 85 || idxErr.code === 86 || (idxErr.message && idxErr.message.includes('same name'))) {
        console.log('Indexes already exist, skipping.');
      } else {
        throw idxErr;
      }
    }

    // Seed departments (insert only if empty)
    const count = await Department.countDocuments();
    if (count === 0) {
      await Department.insertMany(DEPARTMENTS);
      console.log('Seeded', DEPARTMENTS.length, 'departments.');
    } else {
      console.log('Departments already exist (' + count + '), skip seed.');
    }

    console.log('Database "' + dbName + '" is ready.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
