require('dotenv').config()
require('module-alias/register')
const cors = require("cors");
const express = require('express')
const router = require("./src/routes")
const handleSession = require("@/middleware/handleSession");
const cookieParser = require('cookie-parser');

const app = express()
const port = 3000

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser())
app.use("/api/v1",router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
