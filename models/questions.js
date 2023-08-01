import { Schema, model, models } from 'mongoose';

const questionsSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  type: {
    type: String
  },
  questions: {
    type: Array,
    required: true
  },
  sheet: {
    type: Array
  }
}, {timestamps: true} )

const Questions = models.Questions || model('Questions', questionsSchema);

export default Questions