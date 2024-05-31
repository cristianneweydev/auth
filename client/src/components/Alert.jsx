import "./Alert.css";

const Loading = () => (
    <div id="alert-loading">
        <div id="bungkus">
            <div id="circle"></div>
            <p>Loading</p>
        </div>
    </div>
);

const KesalahanNoClose = (props) => {
    return (
        <div id="alert-kesalahan-no-close">
            <div id="bungkus">
                <div id="icon" className="material-symbols-outlined" translate="no">error</div>
                <p>{ props.text || "Kesalahan server" }</p>
            </div>
        </div>
    );
};

const Kesalahan = (props) => {
    document.body.style.overflow = "hidden";
    const onClose = () => {
        props.onClose();
        document.body.style.overflow = "";
    };
    return (
        <div id="alert-kesalahan">
            <div id="bungkus">
                <button id="tombol-close" className="tombol-icon" type="button" onClick={ onClose }>
                    <div className="material-symbols-outlined" translate="no">close</div>
                </button>
                <div id="content">
                    <div id="icon" className="material-symbols-outlined" translate="no">error</div>
                    <p>{ props.text || "Kesalahan server" }</p>
                </div>
            </div>
        </div>
    );
};

const Berhasil = (props) => {
    document.body.style.overflow = "hidden";
    const onClose = () => {
        props.onClose();
        document.body.style.overflow = "";
    };
    return (
        <div id="alert-berhasil">
            <div id="bungkus">
                <button id="tombol-close" className="tombol-icon" type="button" onClick={ onClose }>
                    <div className="material-symbols-outlined" translate="no">close</div>
                </button>
                <div id="content">
                    <div id="icon" className="material-symbols-outlined" translate="no">check_circle</div>
                    <p>{ props.text || "Berhasil" }</p>
                </div>
            </div>
        </div>
    );
};

const Pilihan = (props) => {
    document.body.style.overflow = "hidden";
    const onClose = () => {
        props.onClose();
        document.body.style.overflow = "";
    };
    const onNext = () => {
        props.onNext();
        document.body.style.overflow = "";
    };
    const onCancel = () => {
        props.onCancel();
        document.body.style.overflow = "";
    };
    return (
        <div id="alert-pilihan">
            <div id="bungkus">
                <button id="tombol-close" className="tombol-icon" type="button" onClick={ onClose }>
                    <div className="material-symbols-outlined" translate="no">close</div>
                </button>
                <div id="content">
                    <div id="icon" className="material-symbols-outlined" translate="no">warning</div>
                    <p>{ props.text || "Yakin ingin melanjutkan?" }</p>
                </div>
                <div id="bungkus-tombol">
                    <button type="button" onClick={ onNext }>{ props.textNext || "lanjutkan" }</button>
                    <button type="button" onClick={ onCancel }>{ props.textCancel || "batal" }</button>
                </div>
            </div>
        </div>
    );
};

export {
    KesalahanNoClose,
    Kesalahan,
    Loading,
    Berhasil,
    Pilihan,
};