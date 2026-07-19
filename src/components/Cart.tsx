import useCart from "../hooks/useCart";
import { useState } from "react";
import CartLineItem from "./CartLineItem";

const Cart = () => {
	const [confirm, setConfirm] = useState<boolean>(false);
	const { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart } = useCart();

	const onSubmitOrder = () => {
		dispatch({ type: REDUCER_ACTIONS.SUBMIT });
		setConfirm(true);
	};

	const pageContent = confirm ? (
		<h2>thank you for your order.</h2>
	) : (
		<>
			<h2 className="offscreen">cart</h2>

			<ul className="cart">
				{cart.map((item) => {
					return (
						<CartLineItem
							key={item.sku}
							item={item}
							dispatch={dispatch}
							REDUCER_ACTIONS={REDUCER_ACTIONS}
						/>
					);
				})}
			</ul>

			<div className="cart__totals">
				<p>total items: {totalItems}</p>
				<p>total price: {totalPrice}</p>
				{/* if there are no items disabled is true (you won't be able to click order button if there's no items in the cart): */}
				<button
					className="cart__submit"
					disabled={!totalItems}
					onClick={onSubmitOrder}
				>
					place order
				</button>
			</div>
		</>
	);

	const content = <main className="main main--cart">{pageContent}</main>;

	return content;
};

export default Cart;
