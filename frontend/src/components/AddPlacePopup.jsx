import { useRef,useState } from "react";
import PopupWithForm from "./PopupWithForm";

const AddPlacePopup = ({isOpen,onClose,onAddPlaceSubmit}) => {

    const title = useRef(null);
    const [url,setUrl] = useState('');

    function handleChangeURL(e){
        setUrl(e.target.value)
    }

    function handleSubmit(e){
        
        e.preventDefault();

        onAddPlaceSubmit({
            name: title.current.value,
            link: url
        })

    }

    return (
        <PopupWithForm name="place" title="Nuevo lugar" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
            <input ref={title} type="text" className="form__input" name="title" id="title-input" required placeholder="Título" minLength="2" maxLength="30" />
            <span className="form__input-error title-input-error"></span>
            <input type="url" onChange={handleChangeURL} className="form__input" name="url" id="url-input" required placeholder="Enlace a la imagen" />
            <span className="form__input-error url-input-error"></span>
        </PopupWithForm>
    );
}

export default AddPlacePopup;