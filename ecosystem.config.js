
module.exports = {
  apps : [{
    name   : "blog-api-dev", // Tên ứng dụng của bạn
    script : "./server.js",
    env_production: {
       NODE_ENV: "production"
    }
  }]
}
