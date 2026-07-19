import useCart from "../hooks/useCart";

type PropsType = {
	viewCart: boolean;
};

const Footer = ({ viewCart }: PropsType) => {
	const { totalItems, totalPrice } = useCart();

	const year: number = new Date().getFullYear();

	const pageContent = viewCart ? (
		<p>shopping cart &copy; {year}</p>
	) : (
		<>
			<p>total items: {totalItems}</p>
			<p>total price: {totalPrice}</p>
			<p>shopping cart &copy; {year}</p>
		</>
	);

	const content = <footer className="footer">{pageContent}</footer>;

	return content;
};

export default Footer;
