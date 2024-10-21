export default (principalId: string | (() => string) | undefined, methodArn: string) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: methodArn.split('/', 2).join('/') + '/*',
      },
    ],
  },
});
