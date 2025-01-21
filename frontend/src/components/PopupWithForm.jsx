import '../blocks/popup.css';
import '../blocks/form.css';
import icon__close from '../images/icon__close.svg';

function PopupWithForm(props){

    const isOpen = props.isOpen ? 'popup_opened' : '';

    return (
        <div className={`popup popup_type_${props.name} ${isOpen}`}>
            <div className="popup__form">
                <button className="button button_action_close" aria-label="Cerrar ventana" onClick={props.onClose}>
                    <img src={icon__close} className="button__close-image" alt="Cerrar ventana" />
                </button>
                <div className="popup__content" >
                    <form className="form" name={`${props.name}`} onSubmit={props.onSubmit}>
                        <h3 className="form__title">{props.title}</h3>
                        {props.children}
                        <button type="submit" className="form__button" aria-label="Guardar">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default PopupWithForm;