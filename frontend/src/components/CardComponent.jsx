import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PaymentForm from './PaymentForm';
import { Grid } from '@mui/material';
import { CardActionArea } from '@mui/material';

export default function CardComponent({ element, cardClick, key,  buttonClick, label, buyItem=false, cardClicked=false, handleChange, 
  setQuantity, 
  quantity, 
  paymentType, onAddToCart }){
    return(
        <>
        {element.length>0  && <Grid item xs={12} sm={6} md={4} key={key}>
          <Card
            onClick={(event)=>{event.stopPropagation();}}
            sx={{
              maxWidth: cardClicked? 1000: 345 ,
              height: "100%",
              mx: "auto",
              bgcolor: "background.paper",
              color: "text.primary",
              borderRadius: 2,
              boxShadow: 3,
              transition: "transform 0.2s ease",
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
           
            <CardActionArea onClick={() => cardClick && cardClick(element)}>
              <CardMedia
                component="img"
                height={cardClicked? "300" : "140"}
                image={element[3]}
                alt="Dish image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {element[1]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {element[2]}
                </Typography>
              </CardContent>
            </CardActionArea>
            {buyItem ? (
              <PaymentForm 
                key={element[0]} 
                element={element} 
                paymentType={paymentType} 
                handleChange={handleChange} 
                quantity={quantity} 
                setQuantity={setQuantity} 
                price={element[4]}
                onAddToCart={onAddToCart} 
              />
            ) : (
              <CardActions>
                <Button size="small" onClick={(event) => buttonClick(event, element)}>
                  {label}
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>}
        </>
    );
  }
