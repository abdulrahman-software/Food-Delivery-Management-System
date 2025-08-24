import { useEffect, useState } from "react";
import { Container, Button, Typography, Box, Grid } from "@mui/material";
import SelectItem from "./SelectItem";
import axios from "axios";
import OrderSuccess from "./OrderSuccess";

export default function Cart() {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [storedItems, setStoredItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedItems, setSelectedItems] = useState({
    address: {}, paymentType: "COD"
  });
  const handleClick = (itemToRemove) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => 
      item[0] !== itemToRemove[0] || // Compare dish ID
      item[6] !== itemToRemove[6] // Compare quantity
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setStoredItems(updatedCart);
  };
  const handleSubmit = async () => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    console.log(selectedItems);
    const address_id = selectedItems.address || 1;
    const paymentType = selectedItems.paymentType || "COD";
    let response1 = null;
    for (const item of cart) {
        const dish_id = item[0];
        response1 = await axios.post("http://localhost:3000/orders", {
        dish_id,
        address_id, 
        paymentType,
    });
      const quantity = item[6];
      const price = item[4] * quantity;
      const response2 = await axios.post("http://localhost:3000/orders/items", {
        dish_id, quantity, price
    });
      console.log(response2);
  }
    setOrderSuccess(true);
  }

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setStoredItems(items);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customers/addresses`);
        setAddresses(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const calculateTotal = () => {
    return storedItems.reduce((total, item) => {
      return total + (item[4] * item[6]);
    }, 0).toFixed(2);
  };

  return (
    <>
    {!orderSuccess &&
    <Container>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      
      {storedItems.length === 0 ? (
        <Typography variant="body1">Your cart is empty</Typography>
      ) : (
        <>
          {storedItems.map((item, index) => {
            const dishName = item[1];
            const pricePerItem = item[4];
            const quantity = item[6];
            const totalPrice = (pricePerItem * quantity).toFixed(2);
            
            return (
              <Box 
                key={`${item[0]}-${index}`}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '16px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <Typography variant="h6">{dishName}</Typography>
                  <Typography variant="body1">
                    Quantity: {quantity}
                  </Typography>
                  <Typography variant="body1">
                    Price: ${pricePerItem} × {quantity} = ${totalPrice}
                  </Typography>
                </div>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => handleClick(item)}
                >
                  Remove
                </Button>
              </Box>
            );
          })}
          
          <Box sx={{ marginTop: '20px', padding: '16px', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">
              Total: ${calculateTotal()}
            </Typography>
          </Box>
          
          <Grid container spacing={2} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <SelectItem 
                label={"Payment Type"} 
                items={["COD"]} 
                titleKey={0} 
                onchange={(value) => setSelectedItems({...selectedItems, paymentType: value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectItem 
                label={"Select Address"} 
                items={addresses} 
                titleKey={1} valueKey={0}
                onchange={(value) => setSelectedItems({...selectedItems, address: value})}
              />
            </Grid>
          </Grid>
          
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ marginTop: '20px' }}
            onClick={handleSubmit}
          >
            Place Order (${calculateTotal()})
          </Button>
        </>
      )}
    </Container>
  }
  {orderSuccess && <OrderSuccess/>}
  </>);
}