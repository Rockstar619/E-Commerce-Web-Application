import React, { useState, useEffect } from "react";
import { isAutheticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout"
import { API } from "../backend";
import createOrder from"./helper/orderHelper"

const StripeCheckout = ({
  products=[],
  setReload = f => f,
  reload = undefined
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: ""
  });

  const token = isAutheticated() && isAutheticated().token;
  const userId = isAutheticated() && isAutheticated().user._id;
 

  const getFinalAmount = () => {
    let amount = 0;
    products.map(p => {
      amount = amount + p.price;
    });
    return amount;
  };

  const makePayment =(token) =>{
    const body={
          token,products
    }
    const headers ={
      "Content-Type":"application/json"
    }
    return fetch(`${API}/stripepayment`,{
      method:"POST",
      headers,
      body:JSON.stringify(body)
    }).then(response =>{
        console.log(response)
        const {status} =response;
        console.log("STATUS",status);
      
    }).catch(err => console.log(err));
    
  };
 

  const showStripeButton = () => {
    return isAutheticated() ? (
      <StripeCheckoutButton
      stripeKey="pk_test_51IuwZFSBF4qdW5n6KiBVPPKYvW8X7S6WIG53GqgHnjSmskqKdvQ0PEVtQVxg3MTqY2JLgHxPaIA1GaQxK7iiM5g500e0PgWSL9"
      token={makePayment}
      amount={getFinalAmount() *100}
      name="Buy Tshirts"
      shipping_Address
      billingAddress>
      <button className="btn btn-success">Pay with stripe</button></StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };
 



  return (
    <div>
      <h3 className="text-white">Stripe Checkout $ {getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};

cartEmpty(() => {
  console.log("Did we got a crash?");
});

export default StripeCheckout;
