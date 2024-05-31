import "./Auth.css";
const urlApi = import.meta.env.VITE_URL_API;
import { useState } from "react";
import {
    Loading,
    Kesalahan,
    Berhasil,
} from "../components/Alert";

const urlQuery = window.location.search;
const parameterUrl = new URLSearchParams(urlQuery);

const Register = () => {
    const [komponenAlert, setAlert] = useState();
    const onClose = () => setAlert();
    const submit = async () => {
        try {
            event.preventDefault();
            setAlert(<Loading />);
            const urlFetch = urlApi + "/auth/register";
            const input = {
                username: document.querySelector("input#username").value,
                email: document.querySelector("input#email").value,
                password: document.querySelector("input#password").value,
            };
            const dataFetch = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: input.username,
                    email: input.email,
                    password: input.password,
                }),
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            switch(hasilFetch.status) {
                default:
                    throw `STATUS ${hasilFetch.status}`;
                case 201:
                    setAlert(<Berhasil onClose={ onClose } text="Email aktivasi akun berhasil dikirim" />);
                    break;
                case 409:
                    setAlert(<Kesalahan onClose={ onClose } text="Akun sudah ada" />);
            };
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    return (
        <>
            <main id="auth-register">
                <form onSubmit={ submit }>
                    <h1>DAFTAR</h1>
                    <p>Silahkan mendaftar dengan memasukan nama pengguna, email, dan buat password yang sulit untuk ditebak</p>
                    <div className="bungkus-input">
                        <input id="username" className="input" type="text" placeholder="username" required />
                        <input id="email" className="input" type="email" placeholder="email" required />
                        <input id="password" className="input" type="password" placeholder="password" minLength="8" required />
                    </div>
                    <button className="submit" type="submit">buat akun</button>
                    <p>Sudah punya akun? <a className="link" href="/auth/login">Masuk di sini</a></p>
                </form>
            </main>
            { komponenAlert }
        </>
    );
};

const Activation = () => {
    const [komponenAlert, setAlert] = useState();
    const submit = async () => {
        try {
            setAlert(<Loading />);
            const tokenQuery = parameterUrl.get("token");
            const urlFetch = urlApi + "/auth/activation";
            const dataFetch = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": tokenQuery,
                },
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
            setAlert(<Berhasil onClose={ () => window.location.href = "/auth/login" } text="Akun berhasil diaktifkan" />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ () => setAlert() } />);
        };
    };
    return (
        <>
            <main id="auth-activation">
                <div id="bungkus">
                    <h1>AKTIVASI</h1>
                    <p>Klik tombol di bawah ini untuk mengaktifkan akun anda</p>
                    <button className="submit" type="button" onClick={ submit }>aktifkan</button>
                    <p>Setelah berhasil mengaktifkan akun berikutnya anda akan diarahkan untuk ke halaman login</p>
                </div>
            </main>
            { komponenAlert }
        </>
    );
};

const Login = () => {
    const [komponenAlert, setAlert] = useState();
    const onClose = () => setAlert(); 
    const submit = async () => {
        try {
            event.preventDefault();
            setAlert(<Loading />);
            const urlFetch = urlApi + "/auth/login";
            const input = {
                email: document.querySelector("input#email").value,
                password: document.querySelector("input#password").value,
            };
            const dataFetch = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: input.email,
                    password: input.password,
                }),
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            switch(hasilFetch.status) {
                default:
                    throw `STATUS ${hasilFetch.status}`;
                case 200:
                    const jsonHasilFetch = await hasilFetch.json();
                    const dataHasilFetch = JSON.stringify(jsonHasilFetch.data);
                    localStorage.setItem("authorization", dataHasilFetch);
                    window.location.href = "/user";
                    break;
                case 404:
                    setAlert(<Kesalahan onClose={ onClose } text="Akun tidak ditemukan" />);
            };
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    return (
        <>
            <main id="auth-login">
                <form onSubmit={ submit }>
                    <h1>LOGIN</h1>
                    <p>Silahkan masukan email dan password akun anda</p>
                    <div className="bungkus-input">
                        <input id="email" className="input" type="email" placeholder="email" required />
                        <input id="password" className="input" type="password" placeholder="password" required />
                    </div>
                    <a className="link" href="/auth/recovery">Lupa password?</a>
                    <button className="submit" type="submit">masuk</button>
                    <p>Belum punya akun? <a className="link" href="/auth/register">Buat di sini</a></p>
                </form>
            </main>
            { komponenAlert }
        </>
    );
};

const Recovery = () => {
    const [komponenAlert, setAlert] = useState();
    const onClose = () => setAlert(); 
    const submit = async () => {
        try {
            event.preventDefault();
            setAlert(<Loading />);
            const inputEmail = document.querySelector("input#email").value;
            const urlFetch = urlApi + "/auth/recovery?email=" + inputEmail;
            const dataFetch = {
                method: "POST",
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
            setAlert(<Berhasil onClose={ onClose } text="Email berhasil terkirim" />);
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    return (
        <>
            <main id="auth-recovery">
                <form onSubmit={ submit }>
                    <h1>PEMULIHAN</h1>
                    <p>Silahkan masukan email akun anda</p>
                    <input id="email" className="input" type="email" placeholder="email" required />
                    <button className="submit" type="submit">kirim</button>
                    <p>Sistem akan mengirimkan email untuk mereset password akun anda</p>
                </form>
            </main>
            { komponenAlert }
        </>
    );
};

const Reset = () => {
    const [komponenAlert, setAlert] = useState();
    const onClose = () => setAlert(); 
    const submit = async () => {
        try {
            event.preventDefault();
            setAlert(<Loading />);
            const input = {
                password: document.querySelector("input#password").value,
                konfirmasi: document.querySelector("input#konfirmasi").value,
            };
            if (input.konfirmasi !== input.password) setAlert(<Kesalahan onClose={ onClose } text="Konfirmasi password tidak sesuai" />);
            else {
                const tokenQuery = parameterUrl.get("token");
                const urlFetch = urlApi + "/auth/recovery/reset?password=" + input.password;
                const dataFetch = {
                    method: "PUT",
                    headers: {
                        "Authorization": tokenQuery,
                    },
                };
                const hasilFetch = await fetch(urlFetch, dataFetch);
                if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
                setAlert(<Berhasil onClose={ () => window.location.href = "/auth/login" } text="Password berhasil direset" />);
            };
        } catch(error) {
            setAlert(<Kesalahan onClose={ onClose } />);
        };
    };
    return (
        <>
            <main id="auth-reset">
                <form onSubmit={ submit }>
                    <h1>RESET PASSWORD</h1>
                    <p>Silahkan masukan email dan password akun anda</p>
                    <div className="bungkus-input">
                        <input id="password" className="input" type="password" placeholder="password" minLength="8" required />
                        <input id="konfirmasi" className="input" type="password" placeholder="password" minLength="8" required />
                    </div>
                    <button className="submit" type="submit">masuk</button>
                    <p>Setelah berhasil mereset password berikutnya anda akan diarahkan untuk ke halaman login</p>
                </form>
            </main>
            { komponenAlert }
        </>
    );
};

export {
    Register,
    Activation,
    Login,
    Recovery,
    Reset,
};