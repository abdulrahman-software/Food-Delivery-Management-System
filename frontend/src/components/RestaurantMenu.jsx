import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
export default function RestaurantMenu({accountType, setAccountType}){
  const [data, setData] = useState([]);
  const [change, setChange] = useState({element:{}, card: false, button: false, cardClicked:false, addItem: false});
  const cardClick = (element)=> {
    setChange({...change, element: element, card:true});
  }
  const buttonClick = (event, element)=> {
    if(element[1]===null) {
      setChange({...change, element: element, addItem: true})
    } else {
      event.stopPropagation();
      deleteItem(element);
    }
    }
  const deleteItem = async (element)=> {
    try {
        const dish_id = element[0];
        const response = await axios.delete(`http://localhost:3000/restaurants/dishes/${dish_id}`);
        await refreshData();
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
  }
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/restaurants/current/dishes`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const refreshData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/restaurants/current/dishes`);
    setData(response.data);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <>
    <Navbar data={data} addItem={[[18, "Add Item", 
      "Click here to add a new item to your restaurant: " + 
      "Easily create and configure a new menu entry for your listing.", "/addItem.jpeg", 0, 0], ...data]} 
      label="Remove" addItemIndex={[0, "Add"]} accountType={accountType} setAccountType={setAccountType} 
      change={change} setChange={setChange} cardClick={cardClick} buttonClick={buttonClick}
      refreshData={refreshData} />
    </>
  );
}