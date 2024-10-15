export interface OptionChainRow {
  id: string; // "$underlying-$strike-$expiry"
  callPrice: number;
  strike: number;
  putPrice: number;
}

export interface OptionChainRowData {
  id: string; // "$underlying-$strike-$expiry"
  callPrice: number;
  strike: number;
  putPrice: number;
}

export interface OptionChainTable {
  [id: string]: OptionChainRowData;
}

export interface OptionChainData {
  [expiry: string]: OptionChainTable;
}


/**
 * token: strike, option_type
 *
 */
