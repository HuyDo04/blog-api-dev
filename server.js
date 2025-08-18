require('dotenv').config();
require('module-alias/register');

const cors = require("cors");
const express = require('express');
const router = require("./src/routes");
const cookieParser = require('cookie-parser');



const app = express();

const port = process.env.PORT || 3000;
const clientOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

console.log(`CORS Origin configured for: ${clientOrigin}`); // FOR DEBUGGING

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
