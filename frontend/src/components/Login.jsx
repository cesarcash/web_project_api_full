import { NavLink } from 'react-router-dom';
import '../blocks/login.css'
import Header from './Header';
import Footer from './Footer';
import { useState } from 'react';

function Login({handleLogin}) {

    const [data, setData] = useState({email: '', password: ''});

    const handleChange = (e) => {
        const {name,value} = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(data);
    }

    return(
        <>
            <div className="page">
                <div className="page__container">
                    <Header>
                        <ul className='header__nav'>
                            <li className='header__item'>
                                <NavLink to="/signup" className="header__item-button">
                                    Registrate
                                </NavLink>
                            </li>
                        </ul>
                    </Header>
                    <main className="login">
                        <section className="login__container">
                            <h2 className="login__title">Inicia sesión</h2>
                            <form className="login__form" onSubmit={handleSubmit}>
                                <input type="text" className="login__input" name="email" id="name-email" required placeholder="Correo electrónico" minLength="2" maxLength="40" value={data.email} onChange={handleChange} />
                                <input type="password" className="login__input" name="password" id="name-password" required placeholder="Contraseña" minLength="2" maxLength="40" value={data.password} onChange={handleChange} />
                                <button type="submit" className="login__button" aria-label="Inicia sesión">Inicia sesión</button>
                            </form>
                            <p className="login__paragraph">¿Aún no eres miembro? Regístrate <NavLink to="/signup" className="login__paragraph_link">aquí</NavLink></p>
                        </section>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default Login;