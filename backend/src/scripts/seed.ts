import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Transaction from '../models/Transaction';
import User from '../models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loopr_finance';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Load transactions.json from project root
    const jsonPath = path.join(__dirname, '../../../transactions.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ transactions.json not found at:', jsonPath);
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const transactions = JSON.parse(rawData);

    // Clear existing transactions
    await Transaction.deleteMany({});
    console.log('🗑️  Cleared existing transactions');

    // Insert transactions
    await Transaction.insertMany(transactions);
    console.log(`✅ Inserted ${transactions.length} transactions`);

    // Seed demo user
    const existingUser = await User.findOne({ email: 'demo@loopr.com' });
    if (!existingUser) {
      await User.create({
        email: 'demo@loopr.com',
        password: 'demo1234',
        name: 'Demo Analyst',
        role: 'analyst',
      });
      console.log('✅ Created demo user: demo@loopr.com / demo1234');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    // Seed admin user
    const existingAdmin = await User.findOne({ email: 'admin@loopr.com' });
    if (!existingAdmin) {
      await User.create({
        email: 'admin@loopr.com',
        password: 'admin1234',
        name: 'Admin User',
        role: 'admin',
      });
      console.log('✅ Created admin user: admin@loopr.com / admin1234');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
