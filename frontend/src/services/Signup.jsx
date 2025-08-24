import { useForm } from 'react-hook-form';
import { useState, useEffect } from "react";
import Form from '../components/Form';
import axios from 'axios';
export default function Signup({ toggleAuthMode, signedIn, setSignedIn, setAccountType }) {
  const [data, setData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (formData) => {
    setData(formData);
    console.log(data);
  };
  useEffect(()=>{
    if (Object.keys(data).length > 0) {
      setIsSubmitted(true);
    }
  }, [data]);
  const finalSubmit = async (formData) => {
    try {
      if (data.accountType==="customer") {
      const response1 = await axios.post("http://localhost:3000/customers", data);
      console.log(response1);
      if (response1.data) localStorage.setItem("cart", JSON.stringify([]));
      else throw new Error("Invalid credentials");
      const response2 = await axios.post("http://localhost:3000/customers/addresses", { ...formData });
      if (!response2.data.address_id) console.log("failed to add address");
      setSignedIn(true);
      } else {
        const response = await axios.post("http://localhost:3000/restaurants", {...data, ...formData});
        if (response.data) setAccountType("restaurant");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
    {!isSubmitted && <Form
        showLink={true}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        isSubmitted={false}
        label={"Sign Up"}
        inputs={["name", "email", "password"]}
        passwordIndex={2}
        linkText={"Already have an account? Sign in"}
        toggleAuthMode={toggleAuthMode}
        nameInput={true}
        signedIn={signedIn}
    />
    }
    {isSubmitted && <Form
        showLink={false}
        handleSubmit={handleSubmit}
        isSubmitted={true}
        finalSubmit={finalSubmit}
        register={ register}
        label={"Sign Up"}
        inputs={data.accountType === "customer"?  ["address1", "address2", "postal_code", "city", "phone_number"] : ["city"]}
        linkText={ "Already have an account? Sign in"}
        toggleAuthMode={toggleAuthMode}
        nameInput={true}
        signedIn={signedIn}
      /> }
    </>
  );
}
