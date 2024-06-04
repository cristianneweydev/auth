module.exports = (inputPanjangKarakter) => {
    let karakter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    karakter += "1234567890";
    let hasilPerandoman = "";
    const panjangKarakter = inputPanjangKarakter || 5;
    for (let awalan = 0; awalan < panjangKarakter; awalan++) hasilPerandoman += karakter.charAt(Math.floor(Math.random() * karakter.length));
    return hasilPerandoman;
};