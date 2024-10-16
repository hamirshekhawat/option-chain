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
import { CircularProgress, Alert, Box, Button } from "@mui/material";

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
    if (contractQuery.data && !selectedContract) {
      const firstContractKey = Object.keys(contractQuery.data)[0];
      const firstContract = contractQuery.data[firstContractKey];
      dispatch(setSelectedContract(firstContract.id));
      if (firstContract.expiries && firstContract.expiries.length > 0) {
        dispatch(setSelectedExpiry(firstContract.expiries[0]));
      }
    }
  }, [contractQuery.data, selectedContract, dispatch]);

  if (contractQuery.isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <div>Loading contracts...</div>
      </Box>
    );
  }

  if (contractQuery.error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          Error loading contracts.
          {"status" in contractQuery.error && contractQuery.error.status
            ? ` Status: ${contractQuery.error.status}`
            : ""}
        </Alert>
        <Button variant="contained" onClick={() => contractQuery.refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  const handleContractChange = (event: SelectChangeEvent) => {
    if (!contractQuery.data) return;

    const newContract = event.target.value;
    const contractData = contractQuery.data[newContract];
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
        contracts={contractQuery.data || {}}
        value={selectedContract || ""}
        onChange={handleContractChange}
      />
      {contractQuery.data && selectedContract && (
        <ExpiryList
          expiryList={contractQuery.data[selectedContract]?.expiries || []}
          selectedExpiry={selectedExpiry || ""}
          onChange={handleExpiryChange}
        />
      )}
      {selectedContract && selectedExpiry && (
        <div style={{ padding: "20px" }}>
          <OptionChain
            underlying={selectedContract}
            expiry={selectedExpiry}
          />
        </div>
      )}
    </div>
  );
}

export default App;
