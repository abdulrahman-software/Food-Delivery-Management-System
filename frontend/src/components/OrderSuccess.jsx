import { Container, Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import MenuManager from "./MenuManager";
import { useEffect } from "react";
export default function OrderSuccess() {
  const [continueShopping, setContinueShopping] = useState(false);
  const items = JSON.parse(localStorage.getItem("cart"));
  items.total = 0;
  useEffect(()=>{
    if (continueShopping) window.location.replace("/");
  }, [continueShopping]);
  return (
    <>
    {!continueShopping && <Container sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" color="primary" gutterBottom>
        Order Successful!
      </Typography>
      
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order Summary
        </Typography>
        
        {items.map((item, index) => {
            items.total += item[4] * item[6];
          return <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">
              {item[1]} × {item[6]}
            </Typography>
            <Typography variant="body1">
              ${(item[4]*item[6]).toFixed(2)}
            </Typography>
          </Box>
        })}
        <Box sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total:</span>
            <span>${items.total.toFixed(2)}</span>
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 4 }}
          onClick={() => setContinueShopping(true)}
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>}
    </>
  );
}