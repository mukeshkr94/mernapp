const express = require('express');
const multer = require('multer');
const router = express.Router();
const candidateController = require('../controllers/candidateController')
const authMiddleware = require('../middlewares/auth');


// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/login', candidateController.login);
router.get('/logout', candidateController.logout);
router.post('/create_candidate', authMiddleware(['admin']),candidateController.createCandidate);
router.get('/get_candidate', authMiddleware(['admin']), candidateController.getCandidateList);
router.delete('/delete_candidate/:id', authMiddleware(['admin']), candidateController.deleteCandidate);
router.get('/get_candidate_byid/:id', authMiddleware(['candidate']),candidateController.getCandidateById);
router.post('/upload_profileimg/:id',upload.single('image'), authMiddleware(['candidate']),candidateController.uploadFile);
router.post('/upload_resume/:id',upload.single('resume'), authMiddleware(['candidate']),candidateController.uploadFile);


module.exports = router;