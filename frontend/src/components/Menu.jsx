import {
  Container,
  Grid,
} from "@mui/material";
import CardComponent from "./CardComponent";
import BuyItem from "./BuyItem";
import AddItem from "./AddItem";
export default function Menu({ data, label, change, setChange, buttonClick, cardClick, refreshData }) {
   const handleAddToCart = (item) => {
    console.log("item to be added to cart: ");
    console.log(item);
    let sameItem = false;
    let arr = JSON.parse(localStorage.getItem("cart")) || [];
    arr.map((arrItem)=> {
      if (arrItem[0] == item[0]) {
        sameItem = true;
        arrItem[6] += item[6];
      }
    })
    if (!sameItem) arr.push(item);
    localStorage.setItem("cart", JSON.stringify(arr));
    setChange({ ...change, button: false }); 
  };
  const getLabel = (index) => (typeof label === 'function' ? label(index) : label);
return (
  <Container maxWidth={false} sx={{ mt: 4 }}>
    <Grid container spacing={4}>
      {data?.map((element, index) => (
        <CardComponent element={element} buttonClick={buttonClick} label={getLabel(index)} key={index} cardClick={cardClick}/>
      ))}
    </Grid>
    {change.card && (
      <Container maxWidth={false}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setChange({...change, card:false})}
      >
        <CardComponent element={change.element} buttonClick={buttonClick} cardClicked={false} label={label}/>
      </Container>
    )}
    {change.button && (
      <Container maxWidth={false}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1599,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setChange({ ...change, button: false });
          }
        }}
      >
          <BuyItem 
    element={change.element} 
    onAddToCart={handleAddToCart}
  />
      </Container>
    )}
    {change.addItem && (
      <Container maxWidth={false}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1599,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(event) => {
            setChange({ ...change, addItem: false });
        }}
      >
        <AddItem change={change} setChange={setChange} refreshData={refreshData}/>
        </Container>
    )}
  </Container>
  );
}