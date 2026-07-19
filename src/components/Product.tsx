import { type ProductType } from "../context/ProductsProvider";
import {
	type ReducerActionType,
	type ReducerAction,
} from "../context/CartProvider";
import { type ReactElement } from "react";
import { memo } from "react";

type PropsType = {
	// we need to memoize this one:
	product: ProductType;
	dispatch: React.ActionDispatch<[action: ReducerAction]>;
	REDUCER_ACTIONS: ReducerActionType;
	// we need to memoize this one:
	inCart: boolean;
};

const Product = ({
	product,
	dispatch,
	REDUCER_ACTIONS,
	inCart,
}: PropsType): ReactElement => {
	// old way of doing this - won't work with vite:
	// const img: string = require(`../images/${product.sku}.jpg`);

	const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url)
		.href;
	console.log(img);

	const onAddToCart = () =>
		dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, qty: 1 } });

	const itemInCart = inCart ? "→ item in cart: ✅" : null;

	const content = (
		<article className="product">
			<h3>{product.name}</h3>
			<img className="product__img" src={img} alt={product.name} />
			<p>
				{new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				}).format(product.price)}
				{itemInCart}
			</p>
			<button onClick={onAddToCart}>add to cart</button>
		</article>
	);

	return content;
};

function areProductsEqual(
	{ product: prevProduct, inCart: prevInCart }: PropsType,
	{ product: nextProduct, inCart: nextInCart }: PropsType,
) {
	return (
		Object.keys(prevProduct).every((key) => {
			return (
				prevProduct[key as keyof ProductType] ===
				nextProduct[key as keyof ProductType]
			);
		}) && prevInCart === nextInCart
	);
}

const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual);

export default MemoizedProduct;
