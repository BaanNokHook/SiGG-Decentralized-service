export enum FileMetadataStatus {
  Pending,
  Completed,
}

export interface StorageMetadata {
  name: string; // The original name of the uploaded file.
  description: string; // The description entered by a user. The current Document Description and limit the size to ~100 chars.
  notarizedAt: Date; // date (year, month, day) and time (hour, min, sec)
  hash: string; // Hex encoded Keccak-256 hash of the file. Without the 0x prefix.
  registeredBy: string; // DID of the person that notarized the document.
  txHash?: string; // ETH Transaction Hash.
  blockNumber?: number; // Optional. The number of the block in which we can find the transaction.
  status: FileMetadataStatus; // State of the registration
}
