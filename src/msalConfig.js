export const msalConfig = {
  auth: {
    clientId: "dc5ab166-4380-4f7b-97eb-fbe6cf7a8402",
    authority: "https://deepslide.ciamlogin.com/c00d71ae-b6e5-4976-849e-9436e2ffce20/v2.0",
    knownAuthorities: ["deepslide.ciamlogin.com"],
    redirectUri: "http://localhost:3001/auth/callback",
    postLogoutRedirectUri: "http://localhost:3001/logout",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};
