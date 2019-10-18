module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://ejgonzalez@localhost/lost-puppers',
    JWT_SECRET: process.env.JWT_SECRET || 'Raiders1'
  }