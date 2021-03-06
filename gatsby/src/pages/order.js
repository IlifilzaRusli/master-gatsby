import React from "react";
import SEO from "../components/SEO";
import useForm from "../utils/useForm";
import Img from "gatsby-image";
import calculatePizzaPrice from "../utils/calculatePizzaPrice";
import formatMoney from "../utils/formatMoney";
import OrderStyles from "../styles/OrderStyles";
import MenuItemStyles from "../styles/MenuItemStyles";
import usePizza from "../utils/usePizza";
import PizzaOrder from "../components/PizzaOrder";
import calculateOrderTotal from "../utils/calculateOrderTotal";
import { graphql } from "gatsby";

export default function OrderPage({ data }) {
  const pizzas = data.pizzas.nodes;
  const { values, updateValue } = useForm({
    name: "",
    email: "",
    nasiLemak: "",
  });

  const {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  } = usePizza({
    pizzas,
    values: values,
  });

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <>
      <SEO title={"Order a pizza"} />
      <OrderStyles onSubmit={submitOrder}>
        <fieldset disabled={loading}>
          <legend>Your Info</legend>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={updateValue}
          ></input>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={updateValue}
          ></input>
          <input
            type="nasiLemak"
            name="nasiLemak"
            value={values.nasiLemak}
            onChange={updateValue}
            className="nasiLemak"
          ></input>
        </fieldset>
        <fieldset className="menu" disabled={loading}>
          <legend>Menu</legend>
          {pizzas.map((pizza) => (
            <MenuItemStyles key={pizza.id}>
              <Img
                width="50"
                height="50"
                fluid={pizza.image.asset.fluid}
                alt={pizza.name}
              />
              <div>
                <h2>{pizza.name}</h2>
              </div>
              <div>
                {["S", "M", "L"].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() =>
                      addToOrder({
                        id: pizza.id,
                        size,
                      })
                    }
                  >
                    {size} {formatMoney(calculatePizzaPrice(pizza.price, size))}
                  </button>
                ))}
              </div>
            </MenuItemStyles>
          ))}
        </fieldset>
        <fieldset className="order">
          <legend>Order</legend>
          <PizzaOrder
            order={order}
            pizzas={pizzas}
            removeFromOrder={removeFromOrder}
          />
        </fieldset>
        <fieldset>
          <h3>
            Your total is {formatMoney(calculateOrderTotal(order, pizzas))}
          </h3>
          <div>{error ? <p>Error: {error}</p> : ""}</div>
          <button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Order Ahead"}
          </button>
        </fieldset>
      </OrderStyles>
    </>
  );
}

export const query = graphql`
  query {
    pizzas: allSanityPizza {
      nodes {
        name
        id
        price
        slug {
          current
        }
        toppings {
          id
          name
        }
        image {
          asset {
            fixed(width: 200, height: 200) {
              ...GatsbySanityImageFixed
            }
            fluid(maxWidth: 100) {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;
