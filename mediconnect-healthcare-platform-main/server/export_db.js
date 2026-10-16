const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Models
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Consultation = require('./models/Consultation');
const Prescription = require('./models/Prescription');

const exportDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-patient-db');
    console.log('Connected to Database. Exporting data...');

    const backupDir = path.join(__dirname, '..', 'database_backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const collections = [
      { name: 'users', model: User },
      { name: 'doctors', model: Doctor },
      { name: 'patients', model: Patient },
      { name: 'appointments', model: Appointment },
      { name: 'consultations', model: Consultation },
      { name: 'prescriptions', model: Prescription }
    ];

    for (let col of collections) {
      const data = await col.model.find({}).lean();
      if (data.length > 0) {
        fs.writeFileSync(
          path.join(backupDir, `${col.name}.json`),
          JSON.stringify(data, null, 2)
        );
        console.log(`Exported ${data.length} records to ${col.name}.json`);
      }
    }

    console.log('\n✅ Database successfully exported to the "database_backup" folder!');
    process.exit(0);
  } catch (err) {
    console.error('Export failed:', err);
    process.exit(1);
  }
};

exportDatabase();
