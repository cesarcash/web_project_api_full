import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import '../blocks/card.css';

function Card({card,onCardClick,onCardLike,onCardDelete}){

    const currentUser = useContext(CurrentUserContext);

    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick(){
        onCardLike(card);
    }

    function handleDeleteClick(){
        onCardDelete(card);
    }

    const isOwn = card.owner._id === currentUser._id;
    const cardDeleteButtonClassName = (`card__delete-button ${isOwn ? 'card__delete-button_visible' : 'card__delete-button_hidden'}`);
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = isLiked ? 'card__like-button-visible' : '';

    return (
        <section className="post__item">
            <div className="post__image-container" >
                <button className={`button button_action_delete ${cardDeleteButtonClassName}`} onClick={handleDeleteClick} aria-label="Eliminar post"></button>
                <img className="post__image" src={card.link} onClick={handleClick} alt={card.name} />
            </div>
            <div className="post__description">
                <h2 className="post__name">{card.name}</h2>
                <div className="post__details">
                    <button className={`button button_action_like ${cardLikeButtonClassName}`} onClick={handleLikeClick} aria-label="Me gusta"></button>
                    <span className="post__likes">{card.likes.length}</span>
                </div>
            </div>
        </section>
    );

}

export default Card;