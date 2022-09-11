export interface TimestampResponse {
  hash: string; // keccak-256 hash of the file

  txHash: string; // Valid Ethereum transaction hash

  timestamp: Date; // Timestamp converted to ISO 8601 format

  registeredBy: string; // Valid Ethereum Address
  blockNumber: number; // Number of the block containing the transaction
}
