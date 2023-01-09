const passwordGenerator = require('generate-password');

export const getDomainFromEmail = (email: string) => {
    let domain = email.split('@')[1];
    domain = domain.replace('.', '-');
    return domain;
}

export const getTokenFromHeader = (req: any) => {
    let authToken = null;
    if (
      req.headers['x-forwarded-authorization'] &&
      req.headers['x-forwarded-authorization'].split(' ')[0] === 'Bearer'
    ) {
      authToken = req.headers['x-forwarded-authorization'].split(' ')[1];
    }
    
    return authToken;
}

export const getUserCreationMailTemplate = (username: string, role: string, tenant: string, password: string, subscriptionId?: string) => {

  let credentials = `<p style="margin: 0;">Username: ${username}</p>`
  if(password) {
      credentials += `<p style="margin: 0;">Password: ${password}<p>`
  }

  const roleFirstChar = role.charAt(0);
  const isVowel = ['a', 'e', 'i', 'o', 'u'].includes(roleFirstChar);

  let message = `You have been added to OmniCore's "${subscriptionId}" subscription as ${isVowel ? 'an' : 'a'} ${role} role.`
  if(role === 'TenantAdmin') {
      message = `You have been added to OmniCore "${tenant}" tenant as a ${role} role.`
  }
  if(password) {
      message += `Please find your username and temporary password below.</br></br> ${credentials} </br>`
  }
  
  let body = `<!doctype html>
              <html>
                  <head><meta charset="utf-8"></head>
                  <body>
                      <p><b>Hello,</b></p>
                      <p>${message}</p><br/>
                      <div style="margin-bottom: 18px;">
                          <p style="margin: 0;">OmniCore URL:  <a href="${process.env.OMNICORE_URL}" target="_blank">${process.env.OMNICORE_URL}</a></p>
                          <p style="margin: 0;">OmniCore Docs URL:  <a href="${process.env.OMNICORE_DOCS_URL}" target="_blank">${process.env.OMNICORE_DOCS_URL}</a></p>
                          <p style="margin: 0;">Tenant: ${tenant}</p>
                      </div>
                      <h4 style="margin: 0;">Warms Regards</h4>
                      <h4 style="margin: 0;">OmniCore</h4>
                  </body>
              </html>`

  return body;
}

export const generateRandomPassword = () => {
    const password = passwordGenerator.generate({ length: 10, lowercase: true })
    return password;
}
