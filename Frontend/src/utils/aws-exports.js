// src/aws-config.ts
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_GZA7lSirt",           // Your user pool ID
      userPoolClientId: "7tn1p3ru7ppdg7h1agejd638fj",        // Your user pool app client ID
      region: "us-east-1",                         // Your AWS region
    },
  },
};