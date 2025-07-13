import express from 'express';
import "tsconfig-paths/register"            // required for path aliases like @/*
import router from '@/routes/routes'
import enviroment from './config/enviroment';
const app = express();
const API_PORT = enviroment.apiPort;

app.use(express.json()) // used for parsing incoming requests with JSON payload
app.use("/", router)

app.listen(API_PORT, () => {
  console.log(`Server running at http://localhost:${API_PORT}`);
});
