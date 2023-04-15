import express, {Request, Response} from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import uploadRoutes from './routes/uploadRoutes';
import routes from './controllers/router';


const app = express();

app.use(cors({
    credentials: true,
    origin: "http://13.233.184.159/", 
    // origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }));


app.use(express.json({limit:'25kb'}));
app.get('/', (req:Request,res:Response)=>{
    res.send('Jeevan Khata');
});
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/roles', roleRoutes);
// app.use('/api/v1/bioMarkers', bioMarkerRoutes);
// app.use('/api/v1/units', unitsRoutes);
app.use('/api/v1/data', routes);
app.use('/api/v1/uploads', uploadRoutes);
// app.use('/api/v1/ocrData', ocrDataRoutes);

if(process.env.NODE_ENV == 'production'){
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

app.use(errorHandler);

export default app;
