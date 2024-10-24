import express from 'express';  
import dotenv from 'dotenv';
import adminRoutes from './routes/AdminRoute.js'; // Ensure the file extension is included
import userRoutes from './routes/UserRoutes.js';
import mongoose from 'mongoose';
dotenv.config();

const app = express();  

app.use(express.json());
app.use('/admin', adminRoutes);
app.use('/user',userRoutes);

const PORT = process.env.PORT || 3000; 

await mongoose.connect(process.env.URL)
    .then(() => {
        console.log('DataBase Connected')
    })
    .catch(err => console.log({
        message : 'error while connexting to database',
        error : err.message
    })
)

app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});