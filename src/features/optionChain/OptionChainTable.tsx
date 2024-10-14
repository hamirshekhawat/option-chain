import { useState } from "react";
import { Paper, Box } from "@mui/material";
import "./OptionChain.css";
import { useGetOptionChainQuery } from "../../services/api.slice";
import { OptionChainData } from "./optionChain.type";

export interface OptionChainProps {
  underlying: string;
  expiry: string;
}

export const OptionChain = (props: OptionChainProps) => {
  const { currentData, isLoading } = useGetOptionChainQuery(props.underlying);
  console.log(currentData);
  return (
    <div>
      {isLoading && <div>LOADING</div>}
      {currentData && currentData[props.expiry]&& (
        <OptionsChainTable optionChain={currentData[props.expiry]} />
      )}
    </div>
  );
};

export const OptionsChainTable = (data: OptionChainData) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => {
    setHoveredRow(id);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  return (
    <Paper elevation={3} className="custom-table-container">
      <Box sx={{ overflowX: "auto", maxHeight: "80vh" }}>
        <div className="custom-table">
          <div className="custom-table-row header-row">
            <div className="custom-table-cell">Call LTP</div>
            <div className="custom-table-cell">Strike</div>
            <div className="custom-table-cell">Put LTP</div>
            {/* <div className="custom-table-cell">Action</div> */}
          </div>

          <Box
            sx={{
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            {data.optionChain.map((row) => (
              <div
                key={row.id}
                className={`custom-table-row ${
                  hoveredRow === row.id ? "hovered" : ""
                }`}
                onMouseEnter={() => handleMouseEnter(row.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="custom-table-cell">{row.callPrice}</div>
                <div className="custom-table-cell">{row.strike}</div>
                <div className="custom-table-cell">{row.putPrice}</div>
                {/* <div className="custom-table-cell">
                  {hoveredRow === row.id && (
                    <Button variant="contained" size="small">
                      Action
                    </Button>
                  )}
                </div> */}
              </div>
            ))}
          </Box>
        </div>
      </Box>
    </Paper>
  );
};
