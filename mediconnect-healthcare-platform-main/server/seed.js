require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

const runSeed = async () => {
  try {
    if (process.env.MONGO_URI.includes('localhost') || !process.env.MONGO_URI) {
      console.log('⚠️ Warning: You appear to be running this without a valid MongoDB Atlas URI.');
      console.log('Make sure to connect to your remote database first if you don\'t have local MongoDB.');
    }

    await connectDB();
    console.log('Connected to DB. Clearing old data...');

    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});

    console.log('Seeding new data...');

    // 1. Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@mediconnect.com',
      password: 'password123',
      role: 'admin',
    });

    // 2. Doctor 1 (Verified)
    const doc1 = await User.create({
      name: 'Dr. Gregory House',
      email: 'house@mediconnect.com',
      password: 'password123',
      phone: '9876543210',
      role: 'doctor',
    });
    await Doctor.create({
      user: doc1._id,
      specialization: 'Diagnostic Medicine',
      qualification: 'MD, Nephrology and Infectious Diseases',
      experience: 25,
      hospital: 'Princeton-Plainsboro Teaching Hospital',
      consultationFee: 1000,
      bio: 'Everybody lies. But I can figure out what\'s wrong with you.',
      isVerified: true,
      availability: [
        { day: 'Monday', slots: [{ startTime: '09:00', endTime: '12:00' }, { startTime: '14:00', endTime: '18:00' }] },
        { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '12:00' }] },
      ]
    });

    // 3. Doctor 2 (Verified)
    const doc2 = await User.create({
      name: 'Dr. Meredith Grey',
      email: 'grey@mediconnect.com',
      password: 'password123',
      phone: '9876543211',
      role: 'doctor',
    });
    await Doctor.create({
      user: doc2._id,
      specialization: 'General Surgery',
      qualification: 'MD, FACS',
      experience: 15,
      hospital: 'Grey Sloan Memorial Hospital',
      consultationFee: 800,
      bio: 'Head of General Surgery with extensive experience in trauma.',
      isVerified: true,
      availability: [
        { day: 'Tuesday', slots: [{ startTime: '10:00', endTime: '14:00' }] },
        { day: 'Thursday', slots: [{ startTime: '10:00', endTime: '14:00' }] },
        { day: 'Friday', slots: [{ startTime: '08:00', endTime: '12:00' }] },
      ]
    });

    // 4. Doctor 3 (Pending Verification)
    const doc3 = await User.create({
      name: 'Dr. John Watson',
      email: 'watson@mediconnect.com',
      password: 'password123',
      phone: '9876543212',
      role: 'doctor',
    });
    await Doctor.create({
      user: doc3._id,
      specialization: 'General Practitioner',
      qualification: 'MBBS, MD',
      experience: 10,
      hospital: 'Barts Hospital',
      consultationFee: 500,
      bio: 'Former army doctor, currently in private practice.',
      isVerified: false,
      availability: []
    });

    // 5. Patient 1
    const pat1 = await User.create({
      name: 'John Doe',
      email: 'patient@mediconnect.com',
      password: 'password123',
      phone: '5551234567',
      role: 'patient',
    });
    await Patient.create({
      user: pat1._id,
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      chronicConditions: ['Asthma']
    });

    console.log('✅ Seeding Complete!');
    console.log('----------------------------------------------------');
    console.log('Test Accounts (Password for all: password123)');
    console.log('Admin  : admin@mediconnect.com');
    console.log('Doctor : house@mediconnect.com');
    console.log('Patient: patient@mediconnect.com');
    console.log('----------------------------------------------------');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

runSeed();
