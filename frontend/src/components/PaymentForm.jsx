import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';

export default function PaymentForm({ element, quantity, setQuantity, price, onAddToCart }) {
  const handleAddClick = () => {
    const itemToAdd = [
      ...element,
      quantity
    ];
    if (typeof onAddToCart === 'function') {
      onAddToCart(itemToAdd);
    }
  };

  return (
    <CardActions sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        id="filled-number"
        label="Quantity"
        type="number"
        variant="filled"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 120 }}
        inputProps={{ min: 1 }}
      />
      <Typography gutterBottom variant="h5" component="div">
        {"Price: $" + (price * quantity).toFixed(2)}
      </Typography>
      <Button 
        variant="contained" 
        onClick={handleAddClick}
      >
        Add To Cart
      </Button>
    </CardActions>
  );
}