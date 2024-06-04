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
    const [elementEdit, setElementEdit] = useState();
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
    const onClose = () => {
        setAlert();
        setElementEdit();
    };
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
    const logout = async () => {
        try {
            setAlert(<Loading />);
            setAlert(<Pilihan onClose={ onClose } onCancel={ logoutBiasa } text="Keluar dari semua perangkat?" textNext="ya" textCancel="tidak" onNext={ logoutSemuaPerangkat } />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const kirimUlangAktivasiAkun = async () => {
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
            setAlert(<Berhasil onClose={ onClose } text="Email aktivasi akun berhasil dikirim" />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const onNextUsername = async () => {
        try {
            setAlert(<Loading />);
            const inputUsername = document.querySelector("div#element-input-edit input#username").value;
            const urlFetch = urlApi + "/user/account/username?value=" + inputUsername;
            const dataFetch = {
                method: "PUT",
                headers: {
                    "Authorization": authorizationToken,
                },
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            switch(hasilFetch.status) {
                default:
                    throw `STATUS ${hasilFetch.status}`;
                case 200:
                    setAlert(<Berhasil onClose={ () => window.location.reload()  } />);
                    break;
                case 403:
                    setAlert(<Pilihan onClose={ onClose } onCancel={ onClose } onNext={ kirimUlangAktivasiAkun } text="Akun belum aktif, ingin mengaktifkan akun?" />);
            };
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const submitUsername = () => {
        try {
            event.preventDefault();
            setAlert(<Pilihan onClose={ onClose } onCancel={ onClose } onNext={ onNextUsername } />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const ElementUbahUsername = () => (
        <div id="element-input-edit">
            <form onSubmit={ submitUsername }>
                <button id="tombol-close" className="tombol-icon" type="button" onClick={ onClose }>
                    <div className="material-symbols-outlined" translate="no">close</div>
                </button>
                <h1>UBAH USERNAME</h1>
                <input id="username" className="input" type="text" placeholder="masukan username baru" required />
                <button className="submit" type="submit">ubah</button>
            </form>
        </div>
    );
    const submitVerifikasi = async () => {
        try {
            event.preventDefault();
            setAlert(<Loading />);
            const inputKodeVerifikasi = document.querySelector("div#element-input-edit input#kode-verifikasi").value;
            const urlFetch = urlApi + "/user/account/email/confirmation?code=" + inputKodeVerifikasi;
            const dataFetch = {
                method: "POST",
                headers: {
                    "Authorization": authorizationToken,
                },
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            switch(hasilFetch.status) {
                default:
                    throw `STATUS ${hasilFetch.status}`;
                case 200:
                    setAlert(<Berhasil onClose={ onClose } text="Email konfirmasi perubahan berhasil terkirim" />);
                    break;
                case 403:
                    setAlert(<Kesalahan onClose={ () => setAlert() } text="Kode tidak valid" />);
            };
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const ElementKodeVerifikasiEmail = () => (
        <div id="element-input-edit">
            <form onSubmit={ submitVerifikasi }>
                <button id="tombol-close" className="tombol-icon" type="button" onClick={ onClose }>
                    <div className="material-symbols-outlined" translate="no">close</div>
                </button>
                <h1>VERIFIKASI</h1>
                <p>Silahkan cek kode verifikasi yang sudah terkirim ke email yang ingin ditambahkan</p>
                <input id="kode-verifikasi" className="input2" type="text" placeholder="masukan kode verifikasi" minLength="5" maxLength="5" required />
                <button className="submit" type="submit">verifikasi</button>
            </form>
        </div>
    );
    const onNextEmail = async (inputEmail) => {
        try {
            setAlert(<Loading />);
            const urlFetch = urlApi + "/user/account/email?value=" + inputEmail;
            const dataFetch = {
                method: "PUT",
                headers: {
                    "Authorization": authorizationToken,
                },
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            switch(hasilFetch.status) {
                default:
                    throw `STATUS ${hasilFetch.status}`;
                case 200:
                    setElementEdit(<ElementKodeVerifikasiEmail />);
                    setAlert();
                    break;
                case 403:
                    setAlert(<Pilihan onClose={ onClose } onCancel={ onClose } onNext={ kirimUlangAktivasiAkun } text="Akun belum aktif, ingin mengaktifkan akun?" />);
                    break;
                case 409:
                    setAlert(<Kesalahan onClose={ () => setAlert() } text="Email sudah terkait" />);
            };
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const submitEmail = () => {
        try {
            event.preventDefault();
            const inputEmail = document.querySelector("div#element-input-edit input#email").value;
            setAlert(<Pilihan onClose={ onClose } onCancel={ onClose } onNext={ () => onNextEmail(inputEmail) } />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const ElementUbahEmail = () => (
        <div id="element-input-edit">
            <form onSubmit={ submitEmail }>
                <button id="tombol-close" className="tombol-icon" type="button" onClick={ onClose }>
                    <div className="material-symbols-outlined" translate="no">close</div>
                </button>
                <h1>UBAH EMAIL</h1>
                <input id="email" className="input" type="email" placeholder="masukan email baru" required />
                <button className="submit" type="submit">ubah</button>
            </form>
        </div>
    );
    const onNextResetPassword = async (inputEmail) => {
        try {
            setAlert(<Loading />);
            const urlFetch = urlApi + "/auth/recovery?email=" + inputEmail;
            const dataFetch = {
                method: "POST",
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
            setAlert(<Berhasil onClose={ onClose } text="Email reset password berhasil terkirim" />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    const resetPassword = (inputEmail) => setAlert(<Pilihan onClose={ onClose } onCancel={ onClose } onNext={ () => onNextResetPassword(inputEmail) } />);
    return (
        <>
            <main id="user">
                <div id="bungkus">
                    {
                        dataUser ?
                        <div id="bungkus-data-user">
                            <h2>AKUN</h2>
                            <p>Berikut adalah data akun anda</p>
                            <div className="bungkus-input">
                                <div className="dekorasi-edit">
                                    <div className="dekorasi-input">
                                        <label htmlFor="username">Username</label>
                                        <input id="username" className="input2" type="text" defaultValue={dataUser.username} disabled />
                                    </div>
                                    <button className="tombol-icon" type="button" onClick={ () => setElementEdit(<ElementUbahUsername />) }>
                                        <div className="material-symbols-outlined" translate="no">edit</div>
                                    </button>
                                </div>
                                <div className="dekorasi-edit">
                                    <div className="dekorasi-input">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" className="input2" type="email" defaultValue={dataUser.email} disabled />
                                    </div>
                                    <button className="tombol-icon" type="button" onClick={ () => setAlert(<ElementUbahEmail />) }>
                                        <div className="material-symbols-outlined" translate="no">edit</div>
                                    </button>
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
                        </div>
                        : null
                    }
                    <div id="bungkus-menu">
                        <h2>MENU</h2>
                        <button className="tombol-icon" onClick={ logout }>
                            <div className="material-symbols-outlined" translate="no">logout</div>
                            <p>logout</p>
                        </button>
                        {
                            dataUser ?
                            <button className="tombol-icon" onClick={ () => resetPassword(dataUser.email) }>
                                <div className="material-symbols-outlined" translate="no">lock_reset</div>
                                <p>reset password</p>
                            </button>
                            : null
                        }
                        <a className="tombol-icon admin" href="/admin/user">
                            <div className="material-symbols-outlined" translate="no">shield_person</div>
                            <p>admin</p>
                        </a>
                    </div>
                </div>
            </main>
            { elementEdit }
            { komponenAlert }
        </>
    );
};

const KonfirmasiEmailUpdate = () => {
    const [komponenAlert, setAlert] = useState();
    const submit = async () => {
        try {
            setAlert(<Loading />);
            const urlQuery = window.location.search;
            const parameterUrl = new URLSearchParams(urlQuery);
            const tokenQuery = parameterUrl.get("token");
            const urlFetch = urlApi + "/user/account/email/confirmation/save";
            const dataFetch = {
                method: "PUT",
                headers: {
                    "Authorization": tokenQuery,
                },
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
            setAlert(<Berhasil onClose={ () => window.location.href = "/auth/login" } text="Email berhasil diubah" />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ () => setAlert() } />);
        };
    };
    return (
        <>
            <main id="user-konfirmasi-perubahan">
                <div id="bungkus">
                    <h1>KONFIRMASI</h1>
                    <p>Klik tombol di bawah ini untuk mengkonfirmasi perubahan email akun anda</p>
                    <button className="submit" type="button" onClick={ submit }>konfirmasi</button>
                    <p>Setelah konfirmasi perubahan email pada akun berikutnya anda akan diarahkan untuk ke halaman login</p>
                </div>
            </main>
            { komponenAlert }
        </>
    );
};

const AdminUser = () => {
    const [dataAllUser, setDataAllUser] = useState();
    const [viewDataAllUser, setViewDataAllUser] = useState();
    const [komponenAlert, setAlert] = useState();
    useEffect(() => {
        const getDataAllUser = async () => {
            try {
                setAlert(<Loading />);
                const urlFetch = urlApi + "/user";
                const dataFetch = {
                    headers: {
                        "Authorization": authorizationToken,
                    },
                };
                const hasilFetch = await fetch(urlFetch, dataFetch);
                if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
                const jsonHasilFetch = await hasilFetch.json();
                const dataHasilFetch = jsonHasilFetch.data;
                const parsingDataHasilFetch = [];
                dataHasilFetch.map((resultDataHasilFetch) => parsingDataHasilFetch.push({
                    id: resultDataHasilFetch.id,
                    username: resultDataHasilFetch.username,
                    email: resultDataHasilFetch.email,
                    created: resultDataHasilFetch.created.substring(0, 11) + new Date(resultDataHasilFetch.created).toLocaleTimeString("id-ID").substring(0, 5).replace(".", ":"),
                    updated: resultDataHasilFetch.updated ? resultDataHasilFetch.updated.substring(0, 11) + new Date(resultDataHasilFetch.updated).toLocaleTimeString("id-ID").substring(0, 5).replace(".", ":") : null,
                }));
                setDataAllUser(parsingDataHasilFetch);
                setViewDataAllUser(parsingDataHasilFetch);
                setAlert();
            } catch(error) {
                setAlert(<KesalahanNoClose />);
            };
        };
        getDataAllUser();
    }, []);
    const cariUsername = () => {
        const inputPencarian = document.querySelector("main#admin-user input#pencarian-user").value;
        const pencarianDataUser = dataAllUser.filter((resultDataUser) => {
            const kecilkanHurufData = resultDataUser.username.toLowerCase();
            const kecilkanHurufInput = inputPencarian.toLowerCase();
            if (kecilkanHurufData === kecilkanHurufInput) return resultDataUser;
        });
        if (!inputPencarian) setViewDataAllUser(dataAllUser);
        else setViewDataAllUser(pencarianDataUser);;
    };
    return (
        <>
            <main id="admin-user">
                <div id="bungkus">
                    <h2>USER</h2>
                    <p>Berikut adalah data akun yang terdaftar</p>
                    <div className="bungkus-input-pencarian">
                        <input id="pencarian-user" className="input2" type="search" placeholder="cari berdasarkan username" onInput={ cariUsername } />
                        <button className="tombol-icon" onClick={ cariUsername }>
                            <div className="material-symbols-outlined" translate="no">search</div>
                        </button>
                    </div>
                    {
                        viewDataAllUser ?
                        <div id="tabel-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Dibuat</th>
                                        <th>Diperbarui</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        viewDataAllUser.map((resultDataUser, index) => {
                                            return(
                                                <tr key={ index + 1 }>
                                                    <td>{ index + 1 }</td>
                                                    <td>{ resultDataUser.id }</td>
                                                    <td>{ resultDataUser.username }</td>
                                                    <td>{ resultDataUser.email }</td>
                                                    <td>
                                                        <input type="datetime-local" defaultValue={ resultDataUser.created } disabled />
                                                    </td>
                                                    <td>
                                                        {
                                                            resultDataUser.updated ?
                                                            <input type="datetime-local" defaultValue={ resultDataUser.updated } disabled />
                                                            : "Tidak"
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        : null
                    }
                </div>
            </main>
            { komponenAlert }
        </>
    );
};

export {
    User,
    KonfirmasiEmailUpdate,
    AdminUser,
};