import { type ReactElement, type ChangeEvent, memo } from "react";
import {
	type CartItemType,
	type ReducerAction,
	type ReducerActionType,
} from "../context/CartProvider";

type PropsType = {
	item: CartItemType;
	// has referential equality:
	dispatch: React.ActionDispatch<[action: ReducerAction]>;
	// we already memoized:
	REDUCER_ACTIONS: ReducerActionType;
};

const CartLineItem = ({ item, dispatch, REDUCER_ACTIONS }: PropsType) => {
	const img: string = new URL(`../images/${item.sku}.jpg`, import.meta.url)
		.href;

	const lineTotal: number = item.qty * item.price;

	const highestQty: number = 20 > item.qty ? 20 : item.qty;

	const optionValues: number[] = [...Array(highestQty).keys()].map(
		(i) => i + 1,
	);

	const options: ReactElement[] = optionValues.map((val) => {
		return (
			<option key={`opt${val}`} value={val}>
				{val}
			</option>
		);
	});

	const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch({
			type: REDUCER_ACTIONS.QUANTITY,
			payload: { ...item, qty: Number(e.target.value) },
		});
	};

	const onRemoveFromCart = () =>
		dispatch({ type: REDUCER_ACTIONS.REMOVE, payload: item });

	const content = (
		<li className="cart__item">
			<img src={img} alt={item.name} className="cart__img" />

			<div aria-label="item name">{item.name}</div>

			<div aria-label="price per item">
				{new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				}).format(item.price)}
			</div>

			<label htmlFor="itemQty" className="offscreen">
				item quantity
			</label>
			<select
				name="itemQty"
				id="itemQty"
				className="cart__select"
				value={item.qty}
				aria-label="item quantity"
				onChange={onChangeQty}
			>
				{options}
			</select>

			<div className="cart__item-subtotal" aria-label="line item subtotal">
				{new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				}).format(lineTotal)}
			</div>

			<button
				className="cart__button"
				aria-label="remove item from cart"
				title="remove item from cart"
				onClick={onRemoveFromCart}
			>
				❌
			</button>
		</li>
	);

	return content;
};

// we need a function to see if the items are equal because we're passing in an item object - objects don't have referential equality, it will always be a new object:
function areItemsEqual(
	{ item: prevItem }: PropsType,
	{ item: nextItem }: PropsType,
) {
	return Object.keys(prevItem).every((key) => {
		return (
			prevItem[key as keyof CartItemType] ===
			nextItem[key as keyof CartItemType]
		);
	});
}

const MemoizedCartLineItem = memo<typeof CartLineItem>(
	CartLineItem,
	areItemsEqual,
);

export default MemoizedCartLineItem;
