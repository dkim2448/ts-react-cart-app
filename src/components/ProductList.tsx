import useCart from "../hooks/useCart";
import useProducts from "../hooks/useProducts";
import type { ReactElement } from "react";
import Product from "./Product";

const ProductList = () => {
	const { dispatch, REDUCER_ACTIONS, cart } = useCart();
	const { products } = useProducts();

	let pageContent: ReactElement | ReactElement[] = <p>loading...</p>;

	if (products?.length) {
		pageContent = products.map((product) => {
			// is this product in the cart?
			const inCart: boolean = cart.some((item) => item.sku === product.sku);

			return (
				// dispatch doesn't need to be memoized, it's already referentially equal
				// REDUCER_ACTIONS is already memoized
				<Product
					key={product.sku}
					product={product}
					dispatch={dispatch}
					REDUCER_ACTIONS={REDUCER_ACTIONS}
					inCart={inCart}
				/>
			);
		});
	}

	const content = <main className="main main--products">{pageContent}</main>;

	return content;
};

export default ProductList;
