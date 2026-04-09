import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import AdminUser from './models/AdminUser.js';

await connectDB();

const email = 'monaimk07@gmail.com';
const pass = 'Knight07@sadia';

const passwordHash = await bcrypt.hash(pass, 10);
const doc = await AdminUser.findOneAndUpdate(
  { email },
  { email, passwordHash },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const ok = await bcrypt.compare(pass, doc.passwordHash);
console.log('RESET_OK', doc.email);
console.log('PASSWORD_MATCH', ok);

process.exit(0);
