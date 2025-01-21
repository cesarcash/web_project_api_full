import '../blocks/header.css';
import logo from '../images/logo__white.png';

function Header(props){

    return (
        <header className="header">
            <img src={logo} alt="Alrededor del mundo" className="header__logo" />
            {props.children}
        </header>
    );

}

export default Header;