import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './Models/user.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        await User.deleteMany(); // Clear existing users

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt); // Default password for all seeded users

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword,
            },
        ];

        await User.insertMany(users);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
