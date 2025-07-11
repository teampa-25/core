import express from 'express';
import "tsconfig-paths/register"            // required for paath aliases like @/*
import router from '@/routes/routes'

const app = express();
const API_PORT = process.env.API_PORT || 3000;

app.use("/", router)

app.listen(API_PORT, () => {
  console.log(`Server running at http://localhost:${API_PORT}`);
});
