import express, { Express } from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';

import tenantRoutes from './tenants';
import subscriptionRoutes from './subscription';
import providerRoutes from './provider';
import roleRoutes from './roles';
import userRoutes from './users';
import partnerRoutes from './partners';
import supportRoutes from './support';

const app: Express = express();

// app.use(cors({ origin: true }))
app.use(bodyParser.json());

app.use('/tenants', tenantRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/provider', providerRoutes);
app.use('/roles', roleRoutes);
app.use('/user', userRoutes);
app.use('/partners', partnerRoutes);
app.use('/support', supportRoutes);

export default app;

