import React, { useState } from "react";
import { useCart } from "./CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { loadScript } from "@paypal/paypal-js";
import { useEffect, useRef } from "react";

const stripePromise = loadStripe("pk_test_51Rk9ROPJ09uJWQrogvMOnRRMyS0Ik5hExuppDaefhwCdoVCxvzRIi6byXTWtoI3K8v7Vdh3NZkvQAkMsRHF45DsV00r3VlEbif"); 

const CartPage = () => {
  const { cart, dispatch } = useCart();
  const [orderSummary, setOrderSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe"); 
const paypalRef = useRef();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
   const itemsToSend = cart.map((item) => ({
  plantId: item.id,
  quantity: item.quantity,
  unite_price: item.price,
}));
 setErrorMessage("");

   

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Vous devez être connecté pour passer une commande.");
      localStorage.setItem("redirectAfterLogin", "/cart");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      let response;

      if (paymentMethod === "cod") {
        // Paiement à la livraison
        response = await fetch(`${apiUrl}/api/orders/from-cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemsToSend),
        });

        const text = await response.text();
        if (!response.ok) throw new Error(text || "Erreur lors de la commande.");

        const data = JSON.parse(text);
        setOrderSummary(data);
        dispatch({ type: "CLEAR_CART" });

      } else {
        // Paiement Stripe
        response = await fetch(`${apiUrl}/api/payment/create-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemsToSend),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Erreur lors de la commande.");

        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: result.id });
      }
    } catch (err) {
      setErrorMessage(err.message || "Erreur lors de la commande.");
    }
  };
 // Paiement PayPal

  useEffect(() => {
  let paypalButtonsInstance;

  if (paymentMethod === "paypal") {
    const token = localStorage.getItem("token");

    loadScript({
      "client-id": "Ad258XOddU7CJfdsUkMjDrN_4SmYgToUkMM7ni7BZpiQobyJzZtnu4ct2R_0njUQe9P1a0EPOtf8VjkK",
      currency: "EUR",
    }).then((paypal) => {
      if (paypal && paypal.Buttons && paypalRef.current) {
        paypalButtonsInstance = paypal.Buttons({
      createOrder: function (data, actions) {
  return fetch("/api/paypal/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ Ajouté ici
    },
    body: JSON.stringify({ amount: total.toFixed(2) }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        console.error("Erreur PayPal:", res.status, text);
        throw new Error("Erreur lors de la création de la commande PayPal");
      }
      return res.json();
    })
    .then((order) => order.id);
},


          onApprove: (data) => {
            return fetch(`/api/paypal/capture/${data.orderID}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
             
            })
              .then((res) => res.json())
              .then((details) => {
                if (details.error) throw new Error(details.error);
                alert(`Paiement complété par ${details.payer?.name?.given_name || "le client"}`);
                dispatch({ type: "CLEAR_CART" });
                setOrderSummary(details);
              })
              .catch((err) => {
                console.error("Erreur PayPal:", err);
                setErrorMessage("Erreur lors de la validation PayPal.");
              });
          },
        });

        paypalButtonsInstance.render(paypalRef.current);
      }
    });
  }

  return () => {
    if (paypalButtonsInstance) {
      paypalButtonsInstance.close(); 
    }
  };
}, [paymentMethod, total, dispatch]);

  const updateQuantity = (id, delta) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, delta } });
  const removeItem = (id) => dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <>
      <div className="bg-[#f5f5f0] min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-[#2E3B2B]">Récapitulatif de la commande</h2>

          {orderSummary ? (
            <div className="bg-white p-6 rounded shadow mt-8">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Commande validée 🎉</h3>
              <p className="mb-2">Commande n° <strong>{orderSummary.orderId}</strong></p>
              <p className="mb-4">Statut : <strong>{orderSummary.status}</strong></p>
              <p className="mb-2 font-semibold">Articles :</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {(orderSummary.items || []).map((item, index) => (
                  <li key={index}>
                    {item.quantity} × {item.plantName} — {item.unite_price.toFixed(2)} € l’unité
                  </li>
                ))}
              </ul>
            </div>
          ) : cart.length === 0 ? (
            <p className="text-gray-500">Votre panier est vide.</p>
          ) : (
            <>
              {errorMessage && <div className="mb-4 text-red-600 text-sm">{errorMessage}</div>}

              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-4">
                  <img src={item.image || "/default.jpg"} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 ml-4">
                    <p className="font-semibold text-[#2E3B2B]">{item.name}</p>
                    {item.stock === 0 && (
                      <p className="text-red-600 text-xs font-medium mt-1">Article épuisé</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-2 bg-gray-200 hover:bg-gray-300 rounded" disabled={item.quantity === 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-2 bg-gray-200 hover:bg-gray-300 rounded">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#2E3B2B]">€{(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-600 text-sm hover:underline">Supprimer</button>
                  </div>
                </div>
              ))}

              <button onClick={clearCart} className="text-red-600 text-sm mb-4 hover:underline">Vider le panier</button>

              <hr className="my-4" />

              <div className="space-y-2 text-sm text-[#2E3B2B]">
                <div className="flex justify-between"><span>Sous-total</span><span>€{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Frais de livraison</span><span>€{shipping.toFixed(2)}</span></div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between items-center text-lg font-bold text-[#2E3B2B]">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Dont {tax.toFixed(2)} € de taxes</p>

             {/* Choix du mode de paiement */}
<div className="mt-4 mb-6">
  <label className="block mb-1 text-sm font-medium text-[#2E3B2B]">
    Méthode de paiement :
  </label>
  <select
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
    className="w-full border border-gray-300 rounded px-3 py-2"
  >
    <option value="stripe">Carte bancaire (Stripe)</option>
    <option value="cod">Paiement à la livraison</option>
    <option value="paypal">PayPal</option>
  </select>
</div>

{/* Bouton Stripe ou COD */}
{paymentMethod !== "paypal" && (
  <button
    onClick={handleCheckout}
    disabled={cart.length === 0}
    className={`w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition ${
      cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {paymentMethod === "cod"
      ? "Confirmer ma commande"
      : "Payer avec Stripe 💳"}
  </button>
)}

{/* Bouton PayPal */}
{paymentMethod === "paypal" && (
  <div ref={paypalRef} className="mt-4" />
)}

<button
  onClick={() => (window.location.href = "/products")}
  className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-[#2E3B2B] py-2 rounded"
>
  Continuer mes achats 🛍️
</button>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
