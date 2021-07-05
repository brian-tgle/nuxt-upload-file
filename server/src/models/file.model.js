export default (mongoose, mongoosePaginate) => {
  const schema = mongoose.Schema(
    {
      originalName: String,
      url: String
    },
    { timestamps: true }
  )

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  schema.plugin(mongoosePaginate)

  const File = mongoose.model('file', schema)
  return File
}
