import '../blocks/popup.css';
import icon__close from '../images/icon__close.svg';
import icon__success from '../images/icon__success.svg';
import icon__error from '../images/icon__error.svg';

const InfoTooltip = (props) => {

    const isOpen = props.isOpen ? 'popup_opened' : '';
    const imageConfirm = props.message.isOk ? <img src={icon__success} alt="Exito" className="popup__image-status" /> : <img src={icon__error} alt="Exito" className="popup__image-status" />;

    return (
        <div className={`popup popup_type_${props.name} ${isOpen}`}>
            <div className="popup__form">
                <button className="button button_action_close" aria-label="Cerrar ventana" onClick={props.onClose}>
                    <img src={icon__close} className="button__close-image" alt="Cerrar ventana" />
                </button>
                <div className="popup__content" >
                    <div className="popup__tooltip" >
                        {imageConfirm}
                        <p className="popup__text-status">{props.message.message}</p>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default InfoTooltip;