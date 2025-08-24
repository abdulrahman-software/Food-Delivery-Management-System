import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Form from '../components/Form';
export default function Signin({ toggleAuthMode, signedIn, setSignedIn, setAccountType }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [wrongLog, setWrongLog] = useState(false);
  const onSubmit = async (formData) => {
  try {
    if (formData.accountType === "customer") {
      const response = await axios.post("http://localhost:3000/auth/customers", formData);
      console.log(response);
      if (response.data) {
        localStorage.setItem("cart", JSON.stringify([]));
        setAccountType("customer");
        setSignedIn(true);
      } else setWrongLog(true);
    } else {
      const response = await axios.post("http://localhost:3000/auth/restaurants", formData);
      console.log(response.data);
      if (response.data) {
        setAccountType("restaurant"); 
        setSignedIn(true);
      }
      else setWrongLog(true);
    }
  } catch (error) {
    console.error("Request failed:", error);
    setWrongLog(true);
  }
};


  return (
    <Form
        showLink
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        label={"Sign in"}
        inputs={["email", "password"]}
        passwordIndex={1}
        linkText={"Don't have an account? Sign up"}
        toggleAuthMode={toggleAuthMode}
        isSubmitted={false}
        signedIn={signedIn}
        wrongLog={wrongLog}
    />
  );
}