import { Configuration } from "@azure/msal-browser";

// Define the MSAL configuration dynamically
export const msalConfig: Configuration = {
  auth: {
    clientId: "6cd1e233-be7f-4a37-97cb-08590c2b66d5",
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
