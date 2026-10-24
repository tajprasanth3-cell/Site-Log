import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'sitelog_jwt_secret_development_2026',
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://tajprasanth3_db_user:sitelog@cluster0.aevi79z.mongodb.net/sitelog?retryWrites=true&w=majority',
};
