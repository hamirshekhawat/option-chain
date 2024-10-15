import { Box, Button } from "@mui/material";

interface Expiries {
  expiryList: string[];
  selectedExpiry: string;
  onChange: (expiry: string) => void;
}

export const ExpiryList = ({ expiryList, selectedExpiry, onChange }: Expiries) => {
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        padding: '8px 0',
        gap: '8px',
      }}
    >
      {expiryList.map((expiry) => (
        <Button
          key={expiry}
          variant={expiry === selectedExpiry ? "contained" : "outlined"}
          sx={{
            flex: '0 0 auto',
            padding: '8px 16px',
            minWidth: 100,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: expiry === selectedExpiry ? "#3f51b5" : "#f0f0f0",
            },
          }}
          onClick={() => onChange(expiry)}
        >
          {expiry}
        </Button>
      ))}
    </Box>
  );
};
