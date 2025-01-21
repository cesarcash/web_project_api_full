import { useState, useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({isOpen,onClose,onUpdateUser}){

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const currentUser = useContext(CurrentUserContext);

    function handleChangeName(e){
        setName(e.target.value);
    }

    function handleChangeDescription(e){
        setDescription(e.target.value);
    }

    function handleSubmit(e){

        e.preventDefault();

        onUpdateUser({
            name,
            about: description,
        });

    }

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    },[currentUser])

    return (
        <PopupWithForm name="profile" title="Editar perfil" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
            <input onChange={handleChangeName} value={name} type="text" className="form__input" name="nameProfile" id="name-input" required placeholder="Nombre" minLength="2" maxLength="40" />
            <span className="form__input-error name-input-error"></span>
            <input onChange={handleChangeDescription} value={description} type="text" className="form__input" name="aboutMe" id="about-input" required placeholder="Acerca de mi" minLength="2" maxLength="200" />
            <span className="form__input-error about-input-error"></span>
        </PopupWithForm>
    );
}

export default EditProfilePopup;