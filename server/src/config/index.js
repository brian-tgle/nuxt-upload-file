export const config = {
  passport: {
    secret: process.env.SECRET_KEY,
    refreshTokenSecret: process.env.REFRESH_TOEKN_SECRET_KEY,
    expiresIn: process.env.TOKEN_LIFE_TIME,
    refreshTokenLife: process.env.REFRESH_TOKEN_LIFE_TIME
  },
  env: {
    port: process.env.PORT
  },
  db: {
    url: process.env.MONGODB_URL
  },
  corsOptions: {
    origin: process.env.ALLOW_CORS
  }
}
export const underscoreId = '_id'
