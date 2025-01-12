const Candidate = require('../models/candidateModel');
const jwt = require('jsonwebtoken');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const bcrypt = require('bcrypt');
const s3Client = require('../utility/s3Config');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }
    // Validate password
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }
    // Generate JWT
    const token = jwt.sign({ id: candidate._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    // console.log('tok',token)
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000, sameSite:'lax' });
    res.status(200).send({ message: 'Login successful', auth: { role: candidate.role, token: token, id: candidate._id, } });
  } catch (error) {
    res.status(500).send({ message: error.message});
  }
};

// logout

exports.logout = (req, res) => {
  try {
    res.clearCookie('token');
    res.send({ message: 'Logout Successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }

}
// create candidate

exports.createCandidate = async (req, res, next) => {
  try {
    const { name, email, mobile, password, address } = req.body
    if (!name || !email || !mobile || !password || !address) {
      return res.status(400).send({ message: 'Required all field.' });
    }
    const candidate = new Candidate(req.body);
    await candidate.save();
    delete candidate.password;
    res.status(201).send({ message: 'Created Successfully.', candidate: candidate });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// get candidate list

exports.getCandidateList = async (req, res) => {
  try {
    const candidate = await Candidate.find({}, '-password');
    if (!candidate || candidate.length === 0) {
      return res.status(404).send({ message: 'Candidate Not Found' });
    }
    res.status(200).send({ candidate: candidate });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

// delete candidte

exports.deleteCandidate = async (req, res) => {
  try {
    const deletedDoc = await Candidate.findByIdAndDelete(req.params.id);
    if (deletedDoc) {
      return res.status(200).send({ message: 'Candidate Deleted' });
    } else {
      return res.status(200).send({messahe:'No document found with that ID.'});
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}


// find candidate by id

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ _id: req.params.id }, '-password');
    if (!candidate || candidate.length === 0) {
     return res.status(404).send({ message: 'Candidate Not Found' });
    }
    res.status(200).send({ candidate: candidate });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// upload image and resume(pdf)

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided.' });
  }

  // Generate a unique file name using Date.now
  const uniqueFileName = `${Date.now()}-${req.file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: uniqueFileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    // Upload file to S3 using the v3 client
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;


    //  Save file metadata to MongoDB
    const updateField =
    ['image/png', 'image/jpeg', 'image/jpg'].includes(req.file.mimetype) ? { profilePicture: s3Url } :
    req.file.mimetype === 'application/pdf' ? { resume: s3Url } : null;
    console.log(updateField)
  if (!updateField) {
    return res.status(400).json({ message: 'Unsupported file type.' });
  }

  // Update the Candidate document in MongoDB
  await Candidate.updateOne({ _id: req.params.id }, { $set: updateField });
  res.status(200).json({
    message: 'File uploaded successfully!',
    file: s3Url,
  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};