
# Event Manager Website

## About This Project

The Event Manager project is a comprehensive backend API designed for event booking and management. It allows users to browse, book, and manage events seamlessly, with the integration of the Razorpay payment gateway for secure and hassle-free transactions. The system is built with scalability in mind, following a modular structure to handle different functionalities such as user authentication, event management, and booking workflows. The project is currently a work in progress.

The application is launched from the <b> server.js </b> file, and it includes the following features:

## Features
**User Authentication:** Secure signup and login functionalities with JWT-based authentication.
**Event Browsing and Management:** Users can browse and book events, while admins can manage events.
**Payment Integration:** Secure payment system using Razorpay.
**Modular Design:** Routes and controllers are structured to ensure clean and scalable code organization.

## Technologies Used

1.JavaScript: Core language for backend development.
2.Node.js & Express.js: Frameworks for building the backend and handling routes, middleware, and APIs.
3.MongoDB: NoSQL database for storing users, events, bookings, and payment information.
4.Mongoose: ODM (Object Data Modeling) library for MongoDB integration.
5.JWT (JsonWebTokens): For handling secure user authentication.
6.Razorpay Payment Gateway: For processing payments during event booking.

## Prerequisites
To run this project locally, ensure you have the following installed:

Node.js
MongoDB
Razorpay API Keys (for payment integration)

## Project Structure
The project follows a modular architecture for maintainability and scalability. Here is a brief overview of the folder structure:
```
/models               # Mongoose schemas for Users, Events, Bookings, Payments
/routes               # API routes for Users, Events, Bookings, Payments
/controllers          # Logic for handling API requests
/middlewares          # JWT authentication and error-handling middleware
server.js             # Entry point of the application
```
