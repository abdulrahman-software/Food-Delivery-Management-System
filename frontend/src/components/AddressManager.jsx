import { useState, useEffect } from 'react'; 
import { useForm } from 'react-hook-form';
import axios from 'axios'; 
import {List, ListItem, Button } from '@mui/material';
import ListItems from './ListItems';
import Form from './Form';
export default function AddressManager() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customers/addresses`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const [selectedValue, setSelectedValue] = useState(null);
  const handleSelect = (address_id) => () => {
    setSelectedValue(address_id);
  };
  const finalSubmit = async (formData)=> {
    const response = await axios.post("http://localhost:3000/customers/addresses", { ...formData });
      console.log(response);
      setShowForm(false);
  };
  const deleteAddress = async (address_id)=> {
      try {
        await axios.delete(`http://localhost:3000/customers/addresses/${address_id}`);
        setData((prev)=> {
          return prev.filter((item) => item[0] != address_id);
        })
      } catch (error) {
        console.error(error);
    }
  }
  return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {data?.map((address) => {
              console.log(address);
                return <ListItems 
                    key={address[0]} 
                    data={address} 
                    titleKey={1} 
                    detailKey={2} 
                    handleClick={() => deleteAddress(address[0])}
                />
          })}
          <ListItem>
                <Button size="small" onClick={()=>{setShowForm(true)}}> Add Address </Button>
            </ListItem>
          {showForm && <Form
                showLink={false}
                handleSubmit={handleSubmit}
                isSubmitted={true}
                finalSubmit={finalSubmit}
                register={ register}
                label={ "Add Address"}
                inputs={ ["address1", "address2", "postal_code", "city", "phone_number"]}
                nameInput={true}
                signedIn={true}
              />}
        </List>
    );
}
