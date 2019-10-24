const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const config = require('./config')

aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: 'us-west-1'
  });

const s3 = new aws.S3()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null, true)
    } else {
      cb(new Error('Please upload a jpeg or png image'), false)
    }
};
 
const upload = multer({
  fileFilter: fileFilter,
  limits: {fileSize: 1024 * 1024 * 5},
  storage: multerS3({
    s3: s3,
    bucket: 'lost-puppers',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;