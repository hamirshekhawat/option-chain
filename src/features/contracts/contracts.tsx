import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
} from "@mui/material";
import { ContractInfo } from "./contracts.type";

interface ContractDropdownProps {
  isLoading: boolean;
  contracts: ContractInfo[];
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const ContractList = (props: ContractDropdownProps) => {
  return (
    <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel>Contracts</InputLabel>
      {props.isLoading ? (
        <Skeleton variant="rectangular" width={120} height={56}  />
      ) : (
        <Select
          value={props.value}
          onChange={props.onChange}
          label={"Contracts"}
        >
          {props.contracts.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.id}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};
