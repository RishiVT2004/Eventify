# Eventify: Event Management Backend API

Eventify is a powerful, scalable, and modular backend API designed to streamline the complex processes involved in event management, bookings, and payments. It offers robust user authentication, real-time seat availability checks, automated email notifications, and secure payment capabilities, making it an ideal choice for modern event-driven applications. With a focus on flexibility and extensibility, Eventify caters to the dynamic needs of users and admins alike.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Set Up Environment Variables](#3-set-up-environment-variables)
  - [Database Setup](#4-database-setup)
  - [Run the Server](#5-run-the-server)
- [Usage](#usage)
- [Future Improvements](#future-improvements)

---

## Project Overview

Eventify is a comprehensive backend API tailored for efficient management of events, bookings, and payments. This project combines user-friendly authentication, advanced admin management tools, and payment gateway integration to deliver a seamless experience. Built with scalability and future growth in mind, Eventify employs a modular structure, making it easy to adapt and expand over time.

---

## Features

- **Secure User Authentication:** Implemented using JWT for secure and stateless session management, ensuring user data is protected.
- **Event Management:** Admins can efficiently create, update, and delete events, while users can explore and book available events.
- **Real-Time Seat Availability:** Maintain accurate booking records with dynamic seat availability checks to prevent overbooking issues.
- **Role-Based Access Control:** Clear separation between user and admin functionalities ensures secure and efficient operations.
- **Payment Gateway Integration:** Razorpay (to be implemented) will offer secure and reliable payment processing for bookings.
- **Email Notifications:** Nodemailer is integrated to send transactional emails for confirmations and updates.
- **Data Validation:** Zod ensures all inputs adhere to predefined schemas, preventing invalid data from entering the system.
- **Password Security:** Sensitive user information is securely stored with bcrypt hashing.
- **Scalable Design:** Modular architecture supports seamless feature additions and system scalability.

---

## Technologies Used

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB (with Mongoose ORM for schema management)
- **Authentication:** JWT (JSON Web Tokens) for session handling
- **Validation:** Zod for robust input schema validation
- **Hashing:** Bcrypt for securely storing sensitive data like passwords
- **Email Service:** Nodemailer for sending confirmation and notification emails
- **Payment Gateway:** Razorpay (to be implemented) for secure payment transactions
- **Deployment:** Cloud service integration (to be implemented for production-ready environments)

---

## Installation

### 1. Clone the Repository

Begin by cloning the project repository to your local machine:
```bash
git clone https://github.com/yourusername/eventify.git
cd eventify
```

### 2. Install Dependencies

Install all required dependencies using:
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root and define the following variables:
```env
PORT=<your-port-number>
URL=<your-mongodb-uri>
JWT_KEY=<your-jwt-secret-key>
EMAIL_ID=<your-email-id>
EMAIL_PASSWORD=<your-email-password> # App password, not Gmail password
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

### 4. Database Setup

- Ensure MongoDB is installed and running locally, or opt for a cloud service like MongoDB Atlas.
- Set the database URL in the `.env` file (`URL` key).
- Collections such as `Users`, `Events`, `Bookings`, and `Payments` will be automatically created when the server starts.

### 5. Run the Server

To start the development server, use:
```bash
node server.js
```
For automatic restarts during development, use:
```bash
nodemon server.js
```

---

## Usage

1. **User Registration and Login:** Users can register or log in to browse and book events conveniently.
2. **Admin Management:** Admins have exclusive access to create, update, and delete events using dedicated API endpoints.
3. **Event Booking:** Users can book events with real-time seat availability checks, ensuring accuracy.
4. **Payment Processing:** Razorpay integration (to be implemented) will handle payments securely and efficiently.
5. **Email Notifications:** After a successful booking, users receive confirmation emails containing all relevant details.

---

## Future Improvements

1. **Razorpay Payment Gateway Integration:** Complete integration for secure and seamless payment transactions.
2. **Cloud Deployment:** Deploy the API on platforms like AWS, Heroku, or Vercel for broader accessibility.
3. **Advanced Reporting Tools:** Provide admins with insightful analytics and detailed event reports to enhance decision-making.

---

Make event management seamless, efficient, and scalable with Eventify! For contributions or issues, please open a pull request or raise an issue in the repository. Let’s collaborate to make Eventify the go-to solution for all event management needs.

