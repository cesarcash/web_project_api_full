import { useContext } from 'react';
import '../blocks/user.css';
import '../blocks/post.css';
import icon__edit from '../images/icon__edit.svg';
import icon__add from '../images/add.png';
import Card from './Card';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Main(props){
    console.log("🚀 ~ Main ~ props:", props.cards)

    const currentUser = useContext(CurrentUserContext);

    return (
        
        <main>
            <section className="user">
                <div className="user__picture" style={{backgroundImage: `url(${currentUser?.avatar})`}} onClick={props.onEditAvatarClick}>
                    <div className="user__picture-edit"></div>
                </div>
                <div className="user__data">
                    <div className="user__data-row">
                        <h1 className="user__name-profile" id="userName">{currentUser?.name}</h1>
                        <button id="button__edit" className="button button_action_edit" aria-label="Editar perfil" onClick={props.onEditProfileClick}>
                            <img src={icon__edit} alt="Editar perfil" className="button__edit-image" />
                        </button>
                    </div>
                    <p className="user__name-description" id="userDescription">{currentUser?.about}</p>
                </div>
                <div className="user__action">
                    <button id="button__add" className="button button_action_add" aria-label="Añadir post" onClick={props.onAddPlaceClick}>
                        <img src={icon__add} alt="Añadir post" className="button__add-image" />
                    </button>
                </div>
            </section>
            <section className="post" id="post">
                {
                    props.cards.map(card => (
                        <Card key={card._id} card={card} onCardDelete={props.onCardDelete} onCardLike={props.onCardLike} onCardClick={props.onCardClick}></Card>
                    ))
                }
            </section>
        </main>
        
    )

}

export default Main;