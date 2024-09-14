const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Paasuj:Paasuj%402004@kioskcluster0.ho8nv.mongodb.net/?retryWrites=true&w=majority&appName=KioskCluster0');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;

