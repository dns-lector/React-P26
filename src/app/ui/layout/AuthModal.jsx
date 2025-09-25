import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../../features/context/AppContext";
import Base64 from "../../../shared/base64/Base64";

export default function AuthModal() {
    const {setToken} = useContext(AppContext);
    const closeModalRef = useRef();
    const [formState, setFormState] = useState({
        "login": "",
        "password": ""
    });
    const [isFormValid, setFormValid] = useState(false);

    const authenticate = () => {
        console.log(formState.login, formState.password);
        // RFC 7617 
        const credentials = Base64.encode(`${formState.login}:${formState.password}`);
        fetch("https://localhost:7229/user/login", {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + credentials
            }
        }).then(r => r.json()).then(j => {
            if(j.status == 200) {
                const jwt = j.data;
                setToken(jwt);
            }
            else {
                console.error(j.data);
            }
        });
    };

    useEffect(() => {
        // console.log("useEffect", formState.login, formState.password);
        setFormValid(formState.login.length > 2 && formState.password.length > 2);
    }, [formState]);

    return <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="authModalLabel">Вхід до сайту</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="user-login-addon"><i className="bi bi-key"></i></span>
                            <input 
                                onChange={e => {
                                    // formState.login = e.target.value;
                                    // setFormState(formState);  // !! посилання не змінюється - стан не оновлюється
                                    // console.log("event", formState.login);
                                    setFormState({...formState, login: e.target.value});
                                }}
                                value={formState.login}
                                name="user-login" type="text" className="form-control"
                                placeholder="Логін" aria-label="Логін" aria-describedby="user-login-addon"/>
                            <div className="invalid-feedback"></div>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="user-password-addon"><i className="bi bi-lock"></i></span>
                            <input 
                                onChange={e => {
                                    setFormState(state => { return {...state, password: e.target.value}; });
                                }}
                                value={formState.password}
                                name="user-password" type="password" className="form-control" placeholder="Пароль"
                                aria-label="Пароль" aria-describedby="user-password-addon"/>
                            <div className="invalid-feedback"></div>
                        </div>
                        
                </div>
                <div className="modal-footer">
                    <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
                    <button disabled={!isFormValid} onClick={authenticate} type="button" className="btn btn-primary" >Вхід</button>
                </div>
            </div>
        </div>
    </div>;

}