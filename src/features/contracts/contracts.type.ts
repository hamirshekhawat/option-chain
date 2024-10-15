export interface TokenInfo {
  strike: number;
  optionType: "PE" | "CE";
}

export interface TokenMap {
  [token: string]: TokenInfo;
}

export interface ContractInfo {
  id: string;
  expiries: string[];
  tokenMap: TokenMap;
}

export interface Contracts {
  [id:string]: ContractInfo
}

export interface ContractState {
  selectedContract: string | null;
  selectedExpiry: string | null;
}
