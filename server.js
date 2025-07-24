require('dotenv').config()
require('module-alias/register')
const cors = require("cors");
const express = require('express')
const router = require("./src/routes")
const app = express()
const port = 3000

// const sequelize = require("./src/config/database")

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection DB successfully.');
//   })
//   .catch(err => {
//     console.error('Connection DB fail.', err);
//   });
app.use(cors())
app.use(express.json());
app.use("/api/v1", router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
