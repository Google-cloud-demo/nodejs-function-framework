import { Response, NextFunction } from 'express';
import { auth } from './firebaseConfig';
import { Roles } from './identity-api/constants';

const getAuthToken = (req: any) => {
    let authToken = null
    if (
      req.headers['authorization'] &&
      req.headers['authorization'].split(' ')[0] === 'Bearer'
    ) {
      authToken = req.headers['authorization'].split(' ')[1];
    }

    return authToken
};

export const checkIfAuthenticated = async (req: any, res: Response, next: NextFunction) => {

  // const tokenInfo = JSON.parse(Buffer.from(req.headers['x-apigateway-api-userinfo'], 'base64').toString());
  // console.log('token info', tokenInfo);
  // req.tenant = tokenInfo?.firebase?.tenant;
  // req.uid = tokenInfo.user_id;
  // next();

  // Deprecated - Token will validation will happen in api gateway and send user-info to x-apigateway-api-userinfo header
    const authToken = getAuthToken(req);
    try {
      const userInfo = await auth.verifyIdToken(authToken || '');
      type roleType = 'Admin' | 'Editor' | 'Viewer' | 'Provisioner' | 'DeviceController' | 'TenantAdmin';
      const role: roleType = userInfo?.role
      req.uid = userInfo.uid;
      req.tenant = userInfo?.firebase?.tenant;
      req.authToken = authToken;
      req.userPermissions = Roles[role]
      return next();
    } catch (e) {
      console.log(e);
      
      return res
        .status(401)
        .send({ error: 'You are not authorized to make this request' });
    }
};