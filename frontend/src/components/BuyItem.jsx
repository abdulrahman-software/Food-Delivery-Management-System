import { useState } from 'react';
import CardComponent from './CardComponent';

export default function BuyItem({ element, onAddToCart }) {
  const [paymentType, setPaymentType] = useState("");
  const [quantity, setQuantity] = useState(1);   

  const handleChange = (event) => {
    setPaymentType(event.target.value);
  };

  return (
    <CardComponent 
      element={element} 
      buyItem={true} 
      handleChange={handleChange} 
      setQuantity={setQuantity} 
      paymentType={paymentType} 
      quantity={quantity}
      cardClicked
      label={"Add To Cart"}
      onAddToCart={onAddToCart} 
    />
  );
}