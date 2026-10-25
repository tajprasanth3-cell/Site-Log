import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || '*',
  jwtSecret: process.env.JWT_SECRET || 'sitelog_jwt_secret_development_2026',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sitelog',
};
