import "./HeaderAuth.css";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default () => {
    useEffect(() => {
        const header = document.querySelector("header");
        const main = document.querySelector("main");
        main.style.marginTop = header.getBoundingClientRect().height + "px";
    });
    return(
        <>
            <header id="auth">
                <div id="bungkus">
                    <a className="tombol-icon" href="/">
                        <div className="material-symbols-outlined" translate="no">arrow_back</div>
                    </a>
                </div>
            </header>
            <Outlet />
        </>
    );
};