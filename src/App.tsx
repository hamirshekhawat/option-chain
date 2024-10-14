import "./App.css";
import { useGetContractsQuery } from "./services/api.slice";
import { ContractList } from "./features/contracts/contracts";
import { SelectChangeEvent } from "@mui/material";
import { OptionChain } from "./features/optionChain/OptionChainTable";
import { RootState, useAppDispatch, useTypedSelector } from "./store";
import {
  setSelectedContract,
  setSelectedExpiry,
} from "./features/contracts/contract.slice";
import { ExpiryList } from "./features/expiry/ExpirySelect";
import { useEffect } from "react";

function App() {
  const dispatch = useAppDispatch();
  const contractQuery = useGetContractsQuery();
  const selectedContract = useTypedSelector(
    (state: RootState) => state.contract.selectedContract
  );
  const selectedExpiry = useTypedSelector(
    (state: RootState) => state.contract.selectedExpiry
  );

  useEffect(() => {
    if (
      contractQuery.data &&
      contractQuery.data.length > 0 &&
      !selectedContract
    ) {
      const firstContract = contractQuery.data[0];
      dispatch(setSelectedContract(firstContract.id));
      if (firstContract.expiries && firstContract.expiries.length > 0) {
        dispatch(setSelectedExpiry(firstContract.expiries[0]));
      }
    }
  }, [contractQuery.data, selectedContract, dispatch]);

  if (contractQuery.isLoading) {
    return <div>Loading contracts...</div>;
  }

  if (contractQuery.error) {
    return <div>Error loading contracts</div>;
  }

  const handleContractChange = (event: SelectChangeEvent) => {
    const newContract = event.target.value;
    const contractData = contractQuery.data?.find(
      (contract) => contract.id === newContract
    );
    dispatch(setSelectedContract(newContract));
    if (contractData && contractData.expiries.length > 0) {
      dispatch(setSelectedExpiry(contractData.expiries[0])); 
    }
  };

  const handleExpiryChange = (newExpiry: string) => {
    dispatch(setSelectedExpiry(newExpiry));
  };

  return (
    <div className="App">
      <ContractList
        isLoading={contractQuery.isLoading}
        contracts={contractQuery.data || []}
        value={selectedContract || ""}
        onChange={handleContractChange}
      />
      {selectedContract && (
        <ExpiryList
          expiryList={
            contractQuery.data?.find(
              (contract) => contract.id === selectedContract
            )?.expiries || []
          }
          selectedExpiry={selectedExpiry || ""}
          onChange={handleExpiryChange}
        />
      )}
      {selectedContract && selectedExpiry && (
        <div style={{ padding: "20px" }}>
          <OptionChain underlying={selectedContract} expiry={selectedExpiry} />
        </div>
      )}
    </div>
  );
}

export default App;
