const mongoose = require('mongoose');
const connectDB = require('../config/database'); // Adjust path to your database config
const User = require('../models/User'); // Note: Capital 'U' for User model

// Sample data
const userData = [
  {
    "firstName": "Ahmed",
    "lastName": "Benali",
    "password": "ahmed123",
    "emailId": "ahmed.benali@gmail.com",
    "age": 25,
    "gender": "male",
    "skills": ["JavaScript", "React", "Node.js"]
  },
  {
    "firstName": "Fatima",
    "lastName": "Zahra",
    "password": "fatima456",
    "emailId": "fatima.zahra@outlook.com",
    "age": 22,
    "gender": "female",
    "skills": ["Python", "Django", "Machine Learning"]
  },
  {
    "firstName": "Youssef",
    "lastName": "Idrissi",
    "password": "youssef789",
    "emailId": "youssef.idrissi@yahoo.com",
    "age": 28,
    "gender": "male",
    "skills": ["Java", "Spring Boot", "MySQL"]
  },
  {
    "firstName": "Amina",
    "lastName": "Cherkaoui",
    "password": "amina321",
    "emailId": "amina.cherkaoui@gmail.com",
    "age": 24,
    "gender": "female",
    "skills": ["HTML", "CSS", "JavaScript", "Vue.js"]
  },
  {
    "firstName": "Omar",
    "lastName": "Hassani",
    "password": "omar654",
    "emailId": "omar.hassani@hotmail.com",
    "age": 30,
    "gender": "male",
    "skills": ["C++", "Docker", "Kubernetes"]
  },
  {
    "firstName": "Khadija",
    "lastName": "Benkirane",
    "password": "khadija987",
    "emailId": "khadija.benkirane@gmail.com",
    "age": 26,
    "gender": "female",
    "skills": ["PHP", "Laravel", "PostgreSQL"]
  },
  {
    "firstName": "Abdelaziz",
    "lastName": "Tazi",
    "password": "abdelaziz123",
    "emailId": "abdelaziz.tazi@gmail.com",
    "age": 32,
    "gender": "male",
    "skills": ["C#", ".NET", "SQL Server"]
  },
  {
    "firstName": "Salma",
    "lastName": "Alami",
    "password": "salma456",
    "emailId": "salma.alami@yahoo.com",
    "age": 23,
    "gender": "female",
    "skills": ["React Native", "Flutter", "Firebase"]
  },
  {
    "firstName": "Karim",
    "lastName": "Benjelloun",
    "password": "karim789",
    "emailId": "karim.benjelloun@outlook.com",
    "age": 27,
    "gender": "male",
    "skills": ["Go", "MongoDB", "Redis"]
  },
  {
    "firstName": "Aicha",
    "lastName": "Ouali",
    "password": "aicha321",
    "emailId": "aicha.ouali@gmail.com",
    "age": 21,
    "gender": "female",
    "skills": ["TypeScript", "Angular", "Express.js"]
  }
];

async function importUsers() {
  try {
    // Connect to MongoDB using your database config
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing users (optional)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert users one by one to trigger pre-save hooks
    const insertedUsers = [];
    for (const userDataItem of userData) {
      const user = new User(userDataItem);
      const savedUser = await user.save();
      insertedUsers.push(savedUser);
      console.log(`Inserted user: ${savedUser.firstName} ${savedUser.lastName}`);
    }

    console.log(`Successfully imported ${insertedUsers.length} users`);
    console.log('Sample user with hashed password and photoUrl:', {
      firstName: insertedUsers[0].firstName,
      emailId: insertedUsers[0].emailId,
      password: insertedUsers[0].password, // This will be hashed
      photoUrl: insertedUsers[0].photoUrl, // This will be generated
    });

  } catch (error) {
    console.error('Error importing users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the import
importUsers();