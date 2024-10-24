
# Eventify: Event Management Backend API

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Future Improvements](#future-improvements)
- [Usage](#usage)

## Project Overview
Eventify is a backend API designed to handle the management of events, bookings, and payments. This project provides secure user authentication, event browsing, booking, and payment functionality using modern backend technologies. It's scalable and built with a modular structure to allow for easy future expansion.

## Features
- User authentication using JWT
- Event creation, browsing, and management
- Secure payment gateway integration with Razorpay(to be implemented)
- User and admin role separation
- Email notifications for successful bookings
- Zod input validation and bcrypt hashing for sensitive data storage
- Book events with real-time seat availability checks.

## Technologies Used
- Backend Framework: Node.js with Express.js
- Database: MongoDB (with Mongoose ORM)
- Authentication: JWT (JSON Web Tokens)
- Validation: Zod for schema validation
- Hashing : Bcrypt hashing for sensitive information 
- Email Service: Nodemailer for email notifications
- Payment Gateway: Razorpay integration for handling payments (to be implemented)
- Deployment: (to be implemented)

## Installation
### 1. Clone the repository:
```
git clone https://github.com/yourusername/eventify.git
cd eventify
```
### 2. Install dependencies:
```
npm install
```

### 3. Environment Variables<br>
  - Create a .env file in the root of your project and add the following environment variables:
```
PORT=<your-port-number>
URL=<your-mongodb-uri>
JWT_KEY=<your-jwt-secret-key>
EMAIL_ID=<your-email-id>
EMAIL_PASSWORD=<your-email-password>(app passowrd , not gmail password)
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

### 4. Database Setup<br>
  - Make sure you have MongoDB installed and running locally or use a cloud service like MongoDB Atlas.<br>
  - Set up the database URL in the .env file (MONGODB_URI).<br>
  - The required collections (Users, Events, Bookings, Payments) will be automatically created when you start the server.

### 5. Running the Server<br>
  - Start the development server:
```
node server.js
```
or
```
nodemon server.js
```

## Future Improvements<br>
1. Event Reviews and Ratings: Allow users to leave feedback and rate events.
2. Razorpay Payment Getaway Integration
3. Deploying on a cloud service 


## Usage 
1. Register or login as a user to browse events.
2. Admins can create, update, or delete events using the respective API endpoints.
3. Users can book events by sending a booking request.
4. Payments can be processed through the Razorpay integration.
5. After a successful booking, users will receive a confirmation email.
