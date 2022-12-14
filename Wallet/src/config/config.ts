const COMPONENT_WALLET_ID = "sigg-wallet";

const NotificationType = [
  "Store My Diploma",
  "Store Verifiable eID",
  "Request your eID Presentation",
  "Request to Sign your eID Presentation",
  "Sign ledger transaction",
];

const grantType = "urn:ietf:params:oauth:grant-type:jwt-bearer";
const scope = "sigg profile user";

export { COMPONENT_WALLET_ID, NotificationType, grantType, scope };
