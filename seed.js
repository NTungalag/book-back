const fs = require('fs');

module.exports = {
  user: {
    title: 'database_dev',
    author: 'database_dev',
    description: 'database_dev',
    latitude: '127.0.0.1',
    longitude: 3306,
    image: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  category: {
    name: process.env.CI_DB_USERNAME,
    
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
      }
    }
  }
};