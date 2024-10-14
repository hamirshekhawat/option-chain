export interface OptionChainRow {
  id: string; // "$underlying-$strike-$expiry"
  callPrice: number;
  strike: number;
  putPrice: number;
}

export interface OptionChainData {
  [expiry: string]: OptionChainRow[];
}
