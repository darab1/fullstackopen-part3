const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to: ', url)

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB: ', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: [true, 'User phone number is required'],
    validate: {
      // Number must contain 8 numbers minimum, if it contains a dash numbers before dash must be 2 or 3 and after 5
      validator: function (v) {
        if (v.includes('-')) {
          const firstPart = v.split('-')[0]
          const secondPart = v.split('-')[1]
          console.log('secondPart: ', secondPart.length)
          if (/^\d+$/.test(firstPart) && /^\d+$/.test(secondPart) && (firstPart.length === 2 && secondPart.length >= 5) || (firstPart.length === 3 && secondPart.length >= 4)) return true
          return false
        }
        if (/^\d+$/.test(v) && v.length > 7) return true
        return false
      },
      message: props => `${props.number} is not a valid number`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)