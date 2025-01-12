const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String },
  profilePicture: { type: String, default:null },
  resume: { type: String,default:null },
  role: {
    type: String,
    enum: ['admin', 'candidate'], 
    default: 'candidate',        
    required: true,
  },
},
{
    timestamps: true,
  }
);

candidateSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Candidate', candidateSchema);