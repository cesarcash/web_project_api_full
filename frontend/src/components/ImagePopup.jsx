import '../blocks/popup.css';
import icon__close from '../images/icon__close.svg';

function ImagePopup({card,onClose}){

    const isOpen = card ? 'popup_opened' : '';

    return (
        <div className={`popup popup_type_image ${isOpen}`} >
            <div className="popup__image">
                <img className="popup__view-image" src={card.link} alt={card.name} />
                <p className="popup__text" >{card.name}</p>
                <button className="button button_action_close" aria-label="Cerrar ventana" onClick={onClose} >
                    <img src={icon__close} className="button__close-image" alt="Cerrar ventana" />
                </button>
            </div>
        </div>
    );

}

export default ImagePopup;