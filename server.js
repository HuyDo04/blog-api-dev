require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' })
require('module-alias/register')
const cors = require("cors");
const express = require('express')
const router = require("./src/routes")
const handleSession = require("@/middleware/handleSession");
const cookieParser = require('cookie-parser');

const app = express()
app.set('etag', false);
const port = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://titokhd.online",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser())

// Serve static files from the "public" directory
app.use(express.static("public"));

app.use("/api/v1",router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
