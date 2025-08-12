require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});
require('module-alias/register');

console.log('PORT:', process.env.PORT);
console.log('CLIENT_ORIGIN:', process.env.CLIENT_ORIGIN);
console.log('NODE_ENV:', process.env.NODE_ENV);
const cors = require("cors");
const express = require('express');
const router = require("./src/routes");
const cookieParser = require('cookie-parser');

const app = express();

const port = process.env.PORT || 3000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: clientOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static("public"));

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
