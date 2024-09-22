import express from 'express';  
import dotenv from 'dotenv';
import adminRoutes from './routes/AdminRoute.js'; // Ensure the file extension is included

dotenv.config();

const app = express();  

app.use(express.json());
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});
