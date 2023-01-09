import * as functions from '@google-cloud/functions-framework';
import app from './identity-api';

functions.http('identityApi', app);