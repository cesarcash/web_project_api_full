import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate} from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import ProtectedRoute from './ProtectedRoute';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import auth from '../utils/auth';
import { getToken, setToken, removeToken } from '../utils/token';

function App() {

    const [isEditProfilePopupOpen, setEditProfile] = useState(false);
    const [isAddPlacePopupOpen, setAddPlace] = useState(false);
    const [isEditAvatarPopupOpen, setEditAvatar] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [cards, setCards] = useState([]);
    const [userData, setUserData] = useState({email: '', password: ''});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isInfoTooltipOpen, setInfoTooltip] = useState(false); 
    const [messageModal, setMessageModal] = useState({isOk: '', message: ''});
    const [apiToken, setApiToken] = useState(getToken() || '');

    const navigate = useNavigate();
    
    useEffect( ()=> {

        const fetchInitialCards = async () => {
            
            try {
        
                const cardsData = await api.getInitialCards();
                setCards(cardsData)
        
            }catch(error){
                console.error('Error:',error)
            }
    
        }
    
        const fetchUserInfo = async () => {
            
            try {
                const userInfo = await api.getUserInfo();
                setCurrentUser(userInfo);
            } catch(error) {
                console.error(`Error ${error}`);
            }
    
        }

        const fetchLoginUser = async () => {

            try {

                const user = await auth.getUserInfo();
                setIsLoggedIn(true)
                // setUserData({email: user.data.email})
                setUserData({email: user.email})
                navigate('/');

            }catch(err) {
                const errorMessage = err.statusCode === 400 ? 'Token no proporcionado o proporcionado en el formato incorrecto' : err.statusCode === 401 ? 'El token provisto es inválido' : `Unexpected Error: ${err.message}`;
                setMessageModal({isOk: false, message: errorMessage});
            }

        }
        
        const token = getToken();
        
        if(token){
            fetchUserInfo()
            fetchInitialCards()
            setApiToken(token);
            fetchLoginUser()
        }
        
    },[])

    function handleCardLike(card){

        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
        .then((newCard) => {
            // setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            setCards((state) => state.map((c) => c.data._id === card._id ? newCard : c));
        });

    }

    async function handleCardDelete(card){

        try {
            await api.deleteCard(card._id)
        }catch(error){
            console.error('Error: ',error)
        }

        setCards(cards.filter(itemCard => itemCard._id !== card._id ))

    }

    function handleCardClick(card){
        setSelectedCard(card)
    }
    
    function handleEditAvatarClick(){
        setEditAvatar(true)
    }
    
    function handleEditProfileClick(){
        setEditProfile(true)
    }

    function handleAddPlaceClick(){
        setAddPlace(true)
    }
    
    function closeAllPopups(){
        
        setEditAvatar(false)
        setEditProfile(false)
        setAddPlace(false)
        setSelectedCard(null)
        setInfoTooltip(false)
        setMessageModal({isOk: '', message: ''})

    }

    const handleUpdateUser = async (data) => {
        
        try{

            const user = await api.setUserInfo(data) 
            // setCurrentUser(user)
            setCurrentUser(user.data)
            closeAllPopups();

        }catch(error){
            console.error(`Error: ${error}`);
        }

    }

    const handleUpdateAvatar = async (data) => {
        
        try{

            const avatar = await api.editImgUser(data)
            // setCurrentUser(avatar);
            setCurrentUser(avatar.data);
            closeAllPopups();

        }catch(error){
            console.error(`Error: ${error}`);
        }

    }

    const handleAddPlaceSubmit = async (data) => {

        try{

            const newCard = await api.setNewCard(data)
            // setCards([newCard, ...cards])
            setCards([newCard.data, ...cards])
            closeAllPopups();

        }catch(error){
            console.error(`Error: ${error}`);
        }        

    }

    const handleRegistration = async ({email, password}) => { //registro
        
        setInfoTooltip(true)

        try {
            await auth.signup({email, password})
            setMessageModal({isOk: true, message: 'Te has registrado'})
        } catch (err){
            
            const errorMessage = err.statusCode === 400 ? 'Uno de los campos se rellenó de forma incorrecta' : `Unexpected Error: ${err.message}`;
            setMessageModal({isOk: false, message: errorMessage})

        }

    }

    const handleLogin = async ({email, password}) => {

        if(!email || !password) return false;

        try {

            const data = await auth.signin({email,password});
            if(data.token){
                setApiToken(data.token);
                setToken(data.token);
                setUserData({email});
                setIsLoggedIn(true);
                navigate('/');
            }

        } catch (err) {
            setInfoTooltip(true)
            const errorMessage = err.statusCode === 400 ? 'No se ha proporcionado uno o más campos' : err.statusCode === 401 ? 'no se ha encontrado al usuario con el correo electrónico especificado' : `Unexpected Error: ${err.message}`;
            setMessageModal({isOk: false, message: errorMessage})
        }

    }

    const signOut = () => {

        removeToken();
        setIsLoggedIn(false);
        navigate('/signin');

    }

    return (        

        <CurrentUserContext.Provider value={currentUser}>

            <Routes>

                <Route path="/signin" element={<Login handleLogin={handleLogin} />} />

                <Route path="/signup" element={
                    <Register handleRegistration={handleRegistration} >
                        <InfoTooltip name="tooltip" isOpen={isInfoTooltipOpen} message={messageModal} onClose={closeAllPopups} />
                    </Register>
                } />

                <Route path="/" element={
                    
                    // currentUser ? (

                        <ProtectedRoute isLoggedIn={isLoggedIn}>

                            <div className="page">
                                <div className="page__container">
                                    <Header>
                                        <ul className='header__nav'>
                                            <li className='header__item'>{userData.email ? userData.email : ''}</li>
                                            <li className='header__item'>
                                                <button onClick={signOut} className="header__item-button header__item-button--secondary">
                                                    Cerrar sesión
                                                </button>
                                            </li>
                                        </ul>
                                    </Header>

                                    <Main
                                        onEditProfileClick={handleEditProfileClick} 
                                        onAddPlaceClick={handleAddPlaceClick} 
                                        onEditAvatarClick={handleEditAvatarClick} 
                                        onCardClick={handleCardClick} 
                                        cards={cards}
                                        onCardLike={handleCardLike}
                                        onCardDelete={handleCardDelete}
                                    />
                                    <Footer />
                                </div>
                            </div>

                            {isEditAvatarPopupOpen && (<EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}></EditAvatarPopup>)}

                            {isEditProfilePopupOpen && (<EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}></EditProfilePopup>)}

                            {isAddPlacePopupOpen && (<AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlaceSubmit={handleAddPlaceSubmit}></AddPlacePopup>)}

                            {selectedCard && (<ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>)}

                        </ProtectedRoute>

                    // ) : ''

                } />

            </Routes>

        </CurrentUserContext.Provider>

    );

}

export default App;