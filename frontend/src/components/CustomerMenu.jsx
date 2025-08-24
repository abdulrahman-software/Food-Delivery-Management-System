import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
export default function CustomerMenu({accountType, setAccountType}){
    const [data, setData] = useState([]);
    const [change, setChange] = useState({element:{}, card: false, button: false, cardClicked:false, addItem: false});
  const cardClick = (element)=> {
    setChange({...change, element: element, card:true});
  }
const buttonClick = (event, element) => {
  event.stopPropagation();
  setChange({...change, card: false, element: element, button: true});
};
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/restaurants/dishes");
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <Navbar data={data} label={"Add"} accountType={accountType} setAccountType={setAccountType} 
    change={change} setChange={setChange} cardClick={cardClick} buttonClick={buttonClick}/>
  );
}