# 🎉 Eventify: Event Management Backend API 🚀

Eventify is a scalable and modular backend API designed to simplify event management, bookings, and payments. It provides features like secure user authentication, real-time seat availability, automated email notifications, and payment integration (Razorpay coming soon).

---

## 📑 Table of Contents

- [⚙️ Installation](#%EF%B8%8F-installation)
- [🎯 Usage](#-usage)
- [🚀 Features](#-features)
- [💻 Technologies Used](#-technologies-used)
- [🚀 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)
---

## ⚙️ Installation

### 1. Clone the Repository
```
git clone https://github.com/yourusername/eventify.git  
cd eventify
```
### 2. Install Dependencies
```
npm install
```
### 3.Set Up Environment Variables
Create a .env file in the root directory and add the following:
```
PORT=<your-port-number>
URL=<your-mongodb-uri>
JWT_KEY=<your-jwt-secret-key>
EMAIL_ID=<your-email-id>
EMAIL_PASSWORD=<your-email-password>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

### 4. Database Setup
Ensure MongoDB is running locally or use MongoDB Atlas.<br>
Collections (Users, Events, Bookings, Payments) are auto-created on server start.

### 5. Run the Application 
```
node server.js
nodemon server.js(if nodemon is installed)
```


## 🎯 Usage

### 1. Register or Login:
Users can register and log in to explore events via /register and /login endpoints.

### 2. Admin Actions:
Admins can create, update, and delete events using /admin/events. They can also manage bookings and payments.

### 3. Book Events:
Users can browse events and book tickets using /events and /book. Real-time seat availability ensures accurate booking.

### 4. Email Notifications:
Automated confirmation emails are sent upon successful booking.

### 5. Payments (Coming Soon):
Razorpay integration is planned for secure event booking payments.

## 🚀 Features

### 1. 🔒 Secure Authentication
JWT-based authentication ensures secure and stateless sessions.

### 2. 🎟️ Event Management
Admins can manage events, while users can browse and book events.

### 3. ⚡ Real-Time Seat Availability
Prevents overbooking by dynamically updating seat availability.

### 4. 🛡️ Role-Based Access Control
Separate roles for users and admins ensure secure operations.

### 5. 💳 Payment Gateway Integration (Coming Soon)
Razorpay will handle secure and seamless payments.

### 6. 📧 Email Notifications
Nodemailer integration for booking confirmations and updates.

### 7. ✅ Data Validation
Input data validation using Zod.

### 8. 🔐 Password Security
Bcrypt securely hashes user passwords.

### 9. 🌟 User Feedback System
Modular design ensures seamless integration and easy expansion of feedback features.

## 💻 Technologies Used

| **Category**            | **Technology**         |
|--------------------------|------------------------|
| Backend Framework        | Node.js + Express.js  |
| Database                 | MongoDB + Mongoose    |
| Authentication           | JWT                   |
| Validation               | Zod                   |
| Password Hashing         | Bcrypt                |
| Email                    | Nodemailer            |
| Payment Gateway          | Razorpay (WIP)        |
| Deployment               | Cloud Service (WIP)   |

## 🚀 Future Improvements

### 1. Razorpay Integration:
Complete payment gateway integration for secure bookings.

### 2. Cloud Deployment:
Deploy the API to platforms like AWS, Heroku, or Vercel for production use.

### 3. Advanced Admin Tools:
Add analytics and event insights for better decision-making.

### 4. Event Recommendations:
Implement personalized event recommendations based on user preferences.

## 🤝 Contributing
We welcome contributions! Here's how you can help:

### 1. Fork the Repository:
Click the "Fork" button to create a copy under your GitHub account.

### 2. Create a Branch:

```
git checkout -b feature-name
```

### 3. Make Changes:
Implement your feature or fix a bug. Write clear, concise commit messages.

### 4. Commit Your Changes:

```
git commit -m "Add feature-name"
```

### 5. Push Your Changes:

```
git push origin feature-name
```

### 6. Open a Pull Request:
Go to the original repository and submit a pull request for review.
<br><hr>
We appreciate all contributions, including bug fixes, feature suggestions, and documentation improvements. If you encounter issues or have feature ideas, feel free to open an issue or pull request.
