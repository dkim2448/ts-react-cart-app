import Nav from "./Nav";
import useCart from "../hooks/useCart";

// you can define it and import, but we're just gonna write it out:
type PropsType = {
	viewCart: boolean;
	setViewCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ viewCart, setViewCart }: PropsType) => {
	const { totalItems, totalPrice } = useCart();

	const content = (
		<header className="header">
			<div className="header__title-bar">
				<h1>acme co.</h1>

				<div className="header__price-box">
					<p>total items: {totalItems}</p>
					<p>total price: {totalPrice}</p>
				</div>
			</div>
			<Nav viewCart={viewCart} setViewCart={setViewCart} />
		</header>
	);

	return content;
};

export default Header;
