import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import AuthContainer from './AuthContainer';
import { Drawer, List, ListItem, ListItemText} from "@mui/material";
import { useState, useEffect } from 'react';
import Menu from './Menu';
import Cart from './Cart';
import AddressManager from './AddressManager';

export default function Navbar({data, addItem = null, label, accountType, 
  setAccountType, change, setChange, buttonClick, cardClick, refreshData, addItemIndex = null}) {
  const [isToggled, setToggle] = useState({
    open: false,
    isSignIn: false,
    showAuth: false,
    showExplore: true,
    showCart: false,
    showAddress: false
  });
  const [signedIn, setSignedIn] = useState(
    () => !!localStorage.getItem('customer') || !!localStorage.getItem('restaurant')
  );
  const { open, isSignIn, showAuth, showExplore, showCart, showAddress} = isToggled;
  
  const toggleDrawer = (openState) => () => {
    setToggle(prev => ({ ...prev, open: openState }));
  };

  const setAuthMode = (signIn) => {
    setToggle(prev => ({
      ...prev,
      showAuth: true,
      isSignIn: signIn,
      showExplore: false,
      showCart: false,
      showAddress: false
    }));
  };

  const toggleExplore = () => {
    setToggle(prev => ({
      ...prev,
      showExplore: !prev.showExplore,
      showAuth: false,
      showCart: false,
      showAddress: false
    }));
  };
  
  const toggleCart = () => {
    setToggle(prev => ({
      ...prev,
      showCart: !prev.showCart,
      showAuth: false,
      showExplore: false,
      showAddress: false
    }));
  };
    useEffect(() => {
  setToggle(prev => ({
    ...prev,
    showExplore: signedIn,
    showAuth: !signedIn 
  }));
}, [signedIn]);
  
  const toggleAddress = ()=> {
    setToggle((prev)=>({
      ...prev, 
      showAddress: true,
      showCart: false,
      showAuth: false,
      showExplore: false
    }));
  }
  const handleLogout = async () => {
  try {
    await axios.get("http://localhost:3000/auth/logout");
    localStorage.removeItem('cart');
    localStorage.removeItem('accountType');
    setSignedIn(false);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  return (
    <>
      <Container maxWidth={false} disableGutters sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={toggleDrawer(true)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {!showAuth && !showCart? "Explore": !showAuth && showCart? "Cart" : isSignIn? "Sign in": "Sign up"}
            </Typography>
            {signedIn? (
              <Button color="inherit" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <Button color="inherit" onClick={() => setAuthMode(true)}>
                Log in
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <List sx={{ width: 250 }}>
            {(
              !signedIn
                ? [
                    { label: 'Sign in', onClick: () => setAuthMode(true) },
                    { label: 'Sign up', onClick: () => setAuthMode(false) },
                    { label: 'Explore', onClick: () => { if (!showExplore) toggleExplore(); } },
                  ]
                : accountType === "customer"
                ? [
                    { label: 'Log out', onClick: handleLogout },
                    { label: 'Explore', onClick: () => { if (!showExplore) toggleExplore(); } },
                    { label: 'Add Address', onClick: toggleAddress },
                    { label: 'Cart', onClick: toggleCart },
                  ]
                : [
                    { label: 'Log out', onClick: handleLogout },
                    { label: 'Explore', onClick: () => { if (!showExplore) toggleExplore(); } },
                  ]
            ).map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={item.onClick}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  color: 'inherit',
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Container>

      {showAuth && <AuthContainer defaultAuth={isSignIn} signedIn={signedIn} 
      setSignedIn={setSignedIn} accountType={accountType} setAccountType={setAccountType}/>}
      {showExplore && (
        <Menu 
          data={addItem || data}
          label={addItemIndex ? (index)=>(index === addItemIndex[0]? addItemIndex[1] : label): label} 
          change={change} 
          setChange={setChange} 
          buttonClick={buttonClick} 
          cardClick={cardClick} 
          refreshData={refreshData}
        />
      )}
      {showCart && <Cart/>}
      {showAddress && <AddressManager/>}
    </>
  );
}