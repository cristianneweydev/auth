import "./Header.css";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default () => {
    useEffect(() => {
        const header = document.querySelector("header");
        const main = document.querySelector("main");
        main.style.marginTop = header.getBoundingClientRect().height + "px";
    });
    return (
        <>
            <header id="index">
                <div id="bungkus">
                    <div style={ {
                        height: "48px",
                        width: "48px",
                        backgroundColor: "var(--hitam)",
                        borderRadius: "100px",
                    } }></div>
                    <nav>
                        <a href="/">HOME</a>
                        <a className="non-auth" href="/auth/login">LOGIN</a>
                        <a className="tombol-icon auth" href="/user">
                            <div className="material-symbols-outlined" translate="no">account_circle</div>
                        </a>
                    </nav>
                </div>
            </header>
            <Outlet />
        </>
    );
};