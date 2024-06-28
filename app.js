import express from 'express';
import mongoose from 'mongoose';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSMongoose from '@adminjs/mongoose';

const app = express();

// Set strictQuery option to avoid future deprecation warnings
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/adminjs-example', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Define Mongoose Schemas
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Mongoose Models
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
  resources: [
    { resource: Product, options: { parent: { name: 'Catalog' } } },
    { resource: Category, options: { parent: { name: 'Catalog' } } },
    { resource: User, options: { parent: { name: 'Administration' } } },
  ],
  rootPath: '/admin',
});

const adminRouter = AdminJSExpress.buildRouter(adminJs);

app.use(adminJs.options.rootPath, adminRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
