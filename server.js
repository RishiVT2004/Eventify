import {express} from express
import {adminRoutes} from './routes/AdminRoute'
const app = express();

app.use(express.json())

app.use('/admin',adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`Server is Running on port ${PORT}`);
})