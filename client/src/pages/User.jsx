import "./User.css";
const urlApi = import.meta.env.VITE_URL_API;
const authorization = JSON.parse(localStorage.getItem("authorization"));
const authorizationToken = authorization ? authorization.token : null;
import {
    useEffect,
    useState,
} from "react";
import {
    Loading,
    Kesalahan,
    KesalahanNoClose,
    Pilihan,
    Berhasil,
} from "../components/Alert";

const User = () => {
    const [komponenAlert, setAlert] = useState(<Loading />);
    const [dataUser, setDataUser] = useState();
    useEffect(() => {
        const getDataUser = async () => {
            try {
                const urlFetch = urlApi + "/user/account";
                const dataFetch = {
                    headers: {
                        "Authorization": authorizationToken,
                    },
                };
                const hasilFetch = await fetch(urlFetch, dataFetch);
                if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
                const jsonHasilFetch = await hasilFetch.json();
                const dataHasilFetch = jsonHasilFetch.data;
                dataHasilFetch.created = dataHasilFetch.created.substring(0, 11) + new Date(dataHasilFetch.created).toLocaleTimeString("id-ID").substring(0, 5).replace(".", ":");
                dataHasilFetch.updated = dataHasilFetch.updated ? dataHasilFetch.updated.substring(0, 11) + new Date(dataHasilFetch.updated).toLocaleTimeString("id-ID").substring(0, 5).replace(".", ":") : null;
                setDataUser(dataHasilFetch);
                setAlert();
            } catch(error) {
                setAlert(<KesalahanNoClose />);
            };
        };
        getDataUser();
    }, []);
    const onClose = () => setAlert();
    const logout = async () => {
        try {
            setAlert(<Loading />);
            const logoutBiasa = () => {
                localStorage.removeItem("authorization");
                window.location.href = "/";
            };
            const logoutSemuaPerangkat = async () => {
                try {
                    setAlert(<Loading />);
                    const urlFetch = urlApi + "/auth/logout";
                    const dataFetch = {
                        method: "DELETE",
                        headers: {
                            "Authorization": authorizationToken,
                        },
                    };
                    const hasilFetch = await fetch(urlFetch, dataFetch);
                    if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
                    localStorage.removeItem("authorization");
                    window.location.href = "/";
                } catch(error) {
                    setAlert(<Kesalahan onClose={ onClose } />);
                };
            };
            setAlert(<Pilihan onClose={ onClose } onCancel={ logoutBiasa } text="Keluar dari semua perangkat?" textNext="ya" textCancel="tidak" onNext={ logoutSemuaPerangkat } />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const editDataUser = (inputId) => {
        const elementInput = document.querySelector(`input#${inputId}`);
        elementInput.removeAttribute("disabled");
        elementInput.focus();
    };
    const onInputEditDataUser = () => {
        const inputDataUser = {
            username: document.querySelector("input#username").value,
            email: document.querySelector("input#email").value,
        };
        const elementTombolSubmit = document.querySelector("button.submit");
        if (
            inputDataUser.username === dataUser.username
            && inputDataUser.email === dataUser.email
        ) elementTombolSubmit.style.display = "none";
        else elementTombolSubmit.style.display = "block";
    };
    const submit = () => {
        try {
            event.preventDefault();
            const onNext = async () => {
                try {
                    setAlert(<Loading />);
                    const input = {
                        username: document.querySelector("input#username").value,
                    };
                    const urlFetch = urlApi + "/user/account";
                    const dataFetch = {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authorizationToken,
                        },
                        body: JSON.stringify({
                            username: input.username,
                        }),
                    };
                    const hasilFetch = await fetch(urlFetch, dataFetch);
                    switch(hasilFetch.status) {
                        default:
                            throw `STATUS ${hasilFetch.status}`;
                        case 200:
                            setAlert(<Berhasil
                                onClose={ () => {
                                    onClose();
                                    window.location.reload();
                                } }
                                text="Berhasil diperbarui"
                            />);
                            break;
                        case 403:
                            const kirimEmaikAktivasi = async () => {
                                try {
                                    setAlert(<Loading />);
                                    const urlFetch = urlApi + "/auth/activation/resending";
                                    const dataFetch = {
                                        method: "POST",
                                        headers: {
                                            "Authorization": authorizationToken,
                                        },
                                    };
                                    const hasilFetch = await fetch(urlFetch, dataFetch);
                                    if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
                                    setAlert(<Berhasil onClose={ onClose } text="Email aktivasi berhasil dikirim" />);
                                } catch(error) {
                                    setAlert(<Kesalahan onClose={ onClose } />)
                                };
                            };
                            setAlert(<Pilihan onClose={ onClose } onCancel={ onClose } onNext={ kirimEmaikAktivasi } text="Akun belum diaktifkan ingin mengaktifkan akun?" />);
                    };
                } catch(error) {
                    setAlert(<Kesalahan onClose={ onClose } />);
                };
            };
            setAlert(<Pilihan onClose={ onClose } onCancel={ onClose } onNext={ onNext } text="Yakin ingin melanjutkan perubahan?" />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    return (
        <>
            <main id="user">
                <div id="bungkus">
                    {
                        dataUser ?
                        <form onSubmit={ submit }>
                            <h2>AKUN</h2>
                            <p>Berikut adalah data akun anda</p>
                            <div className="bungkus-input">
                                <div className="dekorasi-edit">
                                    <div className="dekorasi-input">
                                        <label htmlFor="username">Username</label>
                                        <input id="username" className="input2" type="text" placeholder="Ubah username" defaultValue={dataUser.username} onInput={ onInputEditDataUser } required disabled />
                                    </div>
                                    <button className="tombol-icon" type="button" onClick={ () => editDataUser("username") }>
                                        <div className="material-symbols-outlined" translate="no">edit</div>
                                    </button>
                                </div>
                                <div className="dekorasi-input">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" className="input2" type="email" placeholder="Ubah email" defaultValue={dataUser.email}  disabled />
                                </div>
                                <div className="dekorasi-input">
                                    <label>Dibuat</label>
                                    <input className="input2" type="datetime-local" defaultValue={dataUser.created} disabled />
                                </div>
                                {
                                    dataUser.updated ?
                                    <div className="dekorasi-input">
                                        <label>Diperbarui</label>
                                        <input className="input2" type="datetime-local" defaultValue={dataUser.updated} disabled />
                                    </div>
                                    : null
                                }
                            </div>
                            <button className="submit" type="submit">ubah</button>
                        </form>
                        : null
                    }
                    <div id="bungkus-menu">
                        <h2>MENU</h2>
                        <button className="tombol-icon" onClick={ logout }>
                            <div className="material-symbols-outlined" translate="no">logout</div>
                            <p>logout</p>
                        </button>
                    </div>
                </div>
            </main>
            { komponenAlert }
        </>
    );
};

export {
    User,
};