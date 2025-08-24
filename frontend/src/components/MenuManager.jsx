import { useState, useEffect } from "react";
import RestaurantMenu from "./RestaurantMenu.jsx";
import CustomerMenu from "./CustomerMenu.jsx";
export default function MenuManager() {
    const [accountType, setAccountType] = useState(() => (localStorage.getItem('accountType') || "customer"));
    useEffect(() => {
  localStorage.setItem('accountType', accountType);
  
}, [accountType]);
  return (
    <>
        {accountType==="customer" && <CustomerMenu accountType={accountType} setAccountType={setAccountType}/>}
        {accountType === "restaurant" && <RestaurantMenu accountType={accountType} setAccountType={setAccountType}/>}
    </>
  );
}