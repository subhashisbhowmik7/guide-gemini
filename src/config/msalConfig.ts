import { Configuration } from "@azure/msal-browser";

// Define the MSAL configuration dynamically
export const msalConfig: Configuration = {
  auth: {
    clientId: "2689fe12-043c-4471-8891-0acb85e442c6",
    authority: "https://login.microsoftonline.com/1357b1b7-349f-4b78-a7b9-ed814005863d",  //hardcoded
    // Use the dynamic origin of the current running application
    redirectUri: window.location.origin, 
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
