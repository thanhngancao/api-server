const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//config mongo
const config = require('config');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
});
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//connect into mongo
// mongo config
const DB_URI = config.get('mongoURI');

// mongo connection
mongoose
    .connect(DB_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB has connected ... '))
    .catch(err => console.log(err));
require('./models/user');
require('./models/post');

// middleware
app.use(express.json()); 

//blablabla
app.use('/',require('./routes/auth'));
app.use('/',require('./routes/post'));
app.use('/',require('./routes/user'));

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server has started ... `));

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition : {
    swagger: "2.0",
    info : {
      title: 'Switzerland Review',
      description: "API Document for Switzerland Review by Cao Thanh Ngân and Hoàng Minh Phát",
      version :"1.0.0",
      contact: {
        name: "Hoàng Minh Phát - 17520876",
        name: "Cao Thanh Ngân - 17521308"
      },
      servers: ["localhost:8888"]
    },
    "securityDefinitions": {
      "Authorization": {
        "type": "apiKey",
        "name": "Authorization",
        "in": "header"
      }
    }
  },
  apis:["server.js"]
};

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /register:
 *  post:
 *    description: Register
 *    parameters:
 *    - name: name
 *      description: user name
 *      in: formData
 *      required: true
 *      type: string
 *    - name: email
 *      description: email of user
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: password of user
 *      in: formData
 *      required: true
 *      type: string
 *    responses: 
 *      '200':
 *        description: Successfull
 * /login:
 *  post:
 *    description: Login
 *    parameters:
 *    - name: email
 *      description: user email
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: user password
 *      in: formData
 *      required: true
 *      type: string
 *    responses: 
 *      '200':
 *        description: Successfull
 * /home:
 *  get: 
 *    description: To show all post of user
 *    responses: 
 *       '200':
 *          description: Successfull
 * /createreview:
 *  post:
 *    description: Create new
 *    parameters:
 *    - name: title
 *      description: Title
 *      in: formData
 *      required: true
 *      type: string
 *    - name: body
 *      description: Body
 *      in: formData
 *      required: true
 *      type: string
 *    - name: pic
 *      description: URL of picture 
 *      in: formData
 *      required: true
 *      type: string
 *    responses: 
 *      '200':
 *        description: Successfull
 *    security: 
 *        "api_key": []
 * /deletepost/{_id}:
 *  delete:
 *    description: Delete the post
 *    parameters:
 *    - name: _id
 *      description: delete post base on postid
 *      in: path
 *      required: true
 *      type: string
 *    responses: 
 *       '200':
 *          description: Successfull
 *    security: 
 *        "api_key": []
 * /comment:
 *  put:
 *    description: Create new post
 *    parameters:
 *    - name: text
 *      description: Comment of user
 *      in: formData
 *      required: true
 *      type: string
 *    - name: postedBy
 *      description: Who's comment
 *      in: formData
 *      required: true
 *      type: string
 *    - name: postId
 *      description: Id
 *      in: formData
 *      required: true
 *      type: string
 *    responses: 
 *      '200':
 *        description: Successfull
 * /userhome:
 *  get:
 *    description: List review of user
 *    responses: 
 *      '200':
 *         description: Successfull
 */


