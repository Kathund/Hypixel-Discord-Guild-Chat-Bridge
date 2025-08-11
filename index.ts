import Application from './src/Application';
import dotenv from 'dotenv';
import './src/Private/Logger';

dotenv.config();
new Application().connect();
