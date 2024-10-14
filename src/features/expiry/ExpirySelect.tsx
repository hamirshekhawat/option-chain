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
            }}
        >
            {expiryList.map((expiry) => (
                <Button
                    key={expiry}
                    variant={expiry === selectedExpiry ? "contained" : "outlined"}
                    sx={{ flex: '0 0 auto', margin: '8px' }}
                    onClick={() => onChange(expiry)}
                >
                    {expiry}
                </Button>
            ))}
        </Box>
    );
};
