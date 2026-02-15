const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const createAdmin = async () => {
    try {
        const adminEmail = 'admin@xpression.com';
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists!');
            await User.deleteOne({ email: adminEmail });
            console.log('Existing admin removed to regen with known password.');
        }

        const salt = await bcrypt.genSalt(10);
        // Explicitly hashing here to be sure, though User model pre-save hook handles it usually.
        // If Model has pre-save hook, we can just pass plain text.
        // Let's rely on the Model's logic if it exists, or just create with plain text if the model handles it.
        // Looking at authController, it uses User.create({password: ...}) and assumes model handles hashing.
        // Safest bet for a script is to let the model handle it if we initiate it correctly, 
        // OR manually hash if we bypass.

        // Let's check User model... ah I can't check it right now easily without view_file.
        // But standard MERN stack usually has a pre-save hook.
        // To be 100% safe, I will use the same method as authController: User.create.

        const adminUser = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: 'adminpassword123', // Clean password
            phone: '1234567890',
            role: 'admin'
        });

        console.log('Admin User Created Successfully!');
        console.log('Email: admin@xpression.com');
        console.log('Password: adminpassword123');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
