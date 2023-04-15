import mongoose from "mongoose";
import dotenv from 'dotenv';
import app from './app';
import path from "path";

dotenv.config({path: path.resolve(__dirname, '../config.env')});

console.log(process.env.DEV_DB);

const dB:string|undefined = process.env.DEV_DB?.replace('<password>',process.env.DEV_DB_PASSWORD!);

const PORT = process.env.PORT || 8080;


console.log(dB);
mongoose.connect(dB!).then(()=>{
    console.log('Database Connected!');
});

const server = app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`)
});