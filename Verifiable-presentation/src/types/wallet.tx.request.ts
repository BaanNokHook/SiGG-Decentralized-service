export interface WalletTxSignRequest {
  did: string;
  hash: string; // document hash
  redirectUrl: string;
  documentDescription: string;
}
