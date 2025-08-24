import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { CardMedia, TextField } from '@mui/material';
import axios from 'axios';

export default function AddItem({change, setChange, refreshData}) {
  const restaurant_id = parseInt(localStorage.getItem("restaurant")) || 22;
  const [formData, setFormData] = useState({
    name: '',
    description: 'Enter a description of the product',
    photo_url: '',
    price: '',
    quantity: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        restaurant_id,
        name: formData.name,
        description: formData.description,
        photo_url: formData.photo_url,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };
      const response = await axios.post("http://localhost:3000/restaurants/dishes", data);
      console.log("Item added successfully:", response.data);
      if (refreshData) await refreshData();
      setChange({ ...change, addItem: false });
      setFormData({
        name: '',
        description: 'Enter a description of the product',
        photo_url: '',
        price: '',
        quantity: ''
      });
      
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <Card onClick={(event)=>{event.stopPropagation();}} sx={{ minWidth: 275, maxWidth: 700 }}>
      <CardContent>
        {formData.photo_url && (
          <CardMedia sx={{ height: 140 }} image={formData.photo_url} title="dish" />
        )}
        <div className="form-fields" style={{
          display: "flex", 
          flexDirection: "column", 
          gap: "16px"
        }}>
          <TextField 
            name="name"
            label="Name" 
            value={formData.name}
            onChange={handleChange}
            variant="outlined" 
            fullWidth 
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            name="photo_url"
            label="Photo URL"
            value={formData.photo_url}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField 
            name="price"
            label="Price" 
            value={formData.price}
            onChange={handleChange}
            type="number"
            variant="outlined" 
            fullWidth 
          />
          <TextField 
            name="quantity"
            label="Quantity" 
            value={formData.quantity}
            onChange={handleChange}
            type="number" 
            fullWidth 
          />
        </div>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={handleSubmit}>Add</Button>
      </CardActions>
    </Card>
  );
}