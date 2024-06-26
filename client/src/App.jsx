const urlApi = import.meta.env.VITE_URL_API;
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import HeaderAuth from "./components/HeaderAuth";
import {
    Register,
    Activation,
    Login,
    Recovery,
    Reset,
} from "./pages/Auth";
import PageNotFound from "./pages/PageNotFound";
import { useEffect } from "react";
import HeaderAdmin from "./components/HeaderAdmin";
import {
    User,
    KonfirmasiEmailUpdate,
    AdminUser,
} from "./pages/User";

export default () => {
    const authorization = JSON.parse(localStorage.getItem("authorization"));
    useEffect(() => {
        const element = {
            auth: document.querySelector(".auth"),
            nonAuth: document.querySelector(".non-auth"),
            admin: document.querySelector(".admin"),
        };
        if (!authorization && element.auth) element.auth.style.display = "none";
        if (authorization && element.nonAuth) element.nonAuth.style.display = "none";
        if (!authorization && element.admin) element.admin.style.display = "none";
        if (authorization && authorization.admin !== true && element.admin) element.admin.style.display = "none";
    });
    const cekSesi = async () => {
        try {
            const urlFetch = urlApi + "/auth/session";
            const dataFetch = {
                method: "POST",
                headers: {
                    "Authorization": authorization.token,
                },
            };
            const hasilFetch = await fetch(urlFetch, dataFetch);
            if (hasilFetch.status !== 200) throw `STATUS ${hasilFetch.status}`;
        } catch(error) {
            localStorage.removeItem("authorization");
            window.location.href = "/";
        };
    };
    if (authorization) cekSesi();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Header /> } >
                    <Route index element={ <Home /> } />
                    {
                        authorization ? <Route path="user" element={ <User /> } /> : null
                    }
                    <Route path="user/account/email/confirmation/save" element={ <KonfirmasiEmailUpdate /> } />
                </Route>
                {
                    authorization ? null :
                    <>
                        <Route path="/auth" element={ <HeaderAuth /> }>
                            <Route index element={ <PageNotFound /> } />
                            <Route path="register" element={ <Register /> } />
                            <Route path="login" element={ <Login /> } />
                        </Route>
                    </>
                }
                <Route path="/auth" element={ <HeaderAuth /> }>
                    <Route index element={ <PageNotFound /> } />
                    <Route path="activation" element={ <Activation /> } />
                    <Route path="recovery" element={ <Recovery /> } />
                    <Route path="recovery/reset" element={ <Reset /> } />
                </Route>
                {
                    authorization ?
                        authorization.admin ?
                        <Route path="/admin" element={ <HeaderAdmin /> }>
                            <Route path="user" element={ <AdminUser /> } />
                        </Route>
                        : null
                    : null
                }
                <Route path="*" element={ <PageNotFound /> } />
            </Routes>
        </BrowserRouter>
    );
};