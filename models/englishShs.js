import { Schema, model, models } from 'mongoose';

const EnglishShsSchema = new Schema({
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
  }
}, {timestamps: true} )

const EnglishShs = models.EnglishShs || model('EnglishShs', EnglishShsSchema);

export default EnglishShs