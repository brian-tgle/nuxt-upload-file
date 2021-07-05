export default (mongoose, mongoosePaginate) => {
  const schema = mongoose.Schema(
    {
      refreshToken: String,
      token: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      expiresIn: Date
    },
    { timestamps: true }
  )

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  schema.plugin(mongoosePaginate)

  const UserRefreshToken = mongoose.model('userRefreshToken', schema)
  return UserRefreshToken
}
