
import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import User from './user.model.js'
import UserRefreshToken from './user.refresh.token.model.js'
import File from './file.model.js'

mongoose.Promise = global.Promise
const db = {}
db.mongoose = mongoose
db.users = User(mongoose, mongoosePaginate)
db.userRefreshTokens = UserRefreshToken(mongoose, mongoosePaginate)
db.files = File(mongoose, mongoosePaginate)

export default db
