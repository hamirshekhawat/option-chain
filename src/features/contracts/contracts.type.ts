export interface ContractInfo {
  id: string;
  expiries: string[];
}

export interface ContractState {
  selectedContract: string | null;
  selectedExpiry: string | null;
}
