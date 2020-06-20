const express = require('express');
const app = express();
const mongoose = require('mongoose');
//config mongo
const config = require('config');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
});

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
    info : {
      title: 'Switzerland Review',
      description: "Switzerland Review",
      version :"1.0.0",
      contact: {

      },
      servers: ["localhos:8888"]
    }
  },
  apis:["server.js"]
};

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *  get: 
 *    description: To show all post of user
 *    responses: 
 *       '200':
 *          description: Successfull
 *  delete:
 *    description: Delete the post
 *  update:
 *    description: Update the post
 * /login:
 *  post:
 *   description: Login
 *   parameters:
 *   - name: email
 *     description: user email
 *     in: formData
 *     required: true
 *     type: string
 *   - name: password
 *     description: user password
 *     in: formData
 *     required: true
 *     type: string
 *   reponses: 
 *     '200':
 *        description: Successfull
 * /register:
 *  post:
 *  description: Register
 *  parameters:
 *  - name: name
 *    description: user name
 *    in: formData
 *    required: true
 *    type: string
 *  - name: email
 *    description: email of user
 *    in: formData
 *    required: true
 *    type: string
 *  - name: password
 *    description: password of user
 *    in: formData
 *    required: true
 *    type: string
 *  reponses: 
 *    '200':
 *       description: Successfull
 * /create:
 *  post:
 *  description: Create new
 *  parameters:
 *  - name: Title
 *    description: Title
 *    in: formData
 *    required: true
 *    type: string
 *  - name: Body
 *    description: Body
 *    in: formData
 *    required: true
 *    type: string
 *  - name: Picture
 *    description: URL of picture 
 *    in: formData
 *    required: true
 *    type: string
 *  reponses: 
 *    '200':
 *       description: Successfull
 * /home:
 *  post:
 *  descriptiom: Create new post
 *  parameters:
 *  - name: Comment 
 *    description: Comment of user
 *    in: formData
 *    required: true
 *    type: string
 *  reponses: 
 *     '200':
 *        description: Successfull
 * /profile:
 *  get:
 *  descriptiom: List review of user
 *  parameters:
 *  - name: Name
 *    description: Name of user
 *    in: formData
 *    required: true
 *    type: string
 *  - name: Body
 *    description: Body of Post
 *    in: formData
 *    required: true
 *    type: string
 *  - name: Picture
 *    description: URL of picture 
 *    in: formData
 *    required: true
 *    type: string
 *  reponses: 
 *    '200':
 *       description: Successfull
 */


