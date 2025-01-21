import { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

const EditAvatarPopup = ({isOpen,onClose,onUpdateAvatar}) => {

    const avatar = useRef(null);

    function handleSubmit(e){

        e.preventDefault()

        onUpdateAvatar({
            avatar: avatar.current.value
        })

    }

    return (
        <PopupWithForm name="avatar" title="Cambiar foto de perfil" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
            <input ref={avatar} type="url" className="form__input" name="avatar" id="url-photo" required placeholder="Enlace a la imagen" />
            <span className="form__input-error url-photo-error"></span>
        </PopupWithForm>
    );

}

export default EditAvatarPopup;