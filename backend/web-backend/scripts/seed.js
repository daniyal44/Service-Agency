const mongoose = require('mongoose');
const User = require('../src/models/User');
const Order = require('../src/models/Order');
const Service = require('../src/models/Service');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Order.deleteMany({});
    await Service.deleteMany({});

    // Seed Users
    const users = await User.insertMany([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '+1 (555) 123-4567',
        bio: 'Software Developer',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        phone: '+1 (555) 987-6543',
        bio: 'Graphic Designer',
      },
    ]);

    // Seed Orders
    const orders = await Order.insertMany([
      {
        userId: users[0]._id,
        serviceId: 'serviceId1',
        status: 'Pending',
        totalAmount: 100,
      },
      {
        userId: users[1]._id,
        serviceId: 'serviceId2',
        status: 'Completed',
        totalAmount: 200,
      },
    ]);

    // Seed Services
    const services = await Service.insertMany([
      {
        name: 'Web Development',
        description: 'Building responsive and functional websites.',
        price: 100,
      },
      {
        name: 'Graphic Design',
        description: 'Creating visually appealing graphics and designs.',
        price: 200,
      },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();