# AUTH
## REGISTER
    POST /api/auth/register
    - headers
        - Content-Type: application/json
    - body
        - username
        - email
        - password

## AKTIVASI
    PUT /api/auth/activation
    - headers
        - Authorization

## LOGIN
    POST /api/auth/login
    - headers
        - Content-Type: application/json
    - body
        - email
        - password

## KIRIM EMAIL RESET PASSWORD
    POST /api/auth/recovery?email=email@example.com

## RESET PASSWORD
    PUT /api/auth/recovery/reset?password=example1234

## KIRIM ULANG EMAIL AKTIVASI
    POST /api/auth/activation/resending
    - headers
        - Authorization

## LOGOUT
    DELETE /api/auth/logout
    - headers
        - Authorization

## CEK SESI
    POST /api/auth/session
    - headers
        - Authorization

# USER
## DATA AKUN
    GET /api/user/account
    - headers
        - Authorization

## UPDATE USERNAME
    PUT /api/user/account/username?value=example
    - headers
        - Authorization

## UPDATE EMAIL
    PUT /api/user/account/email?value=example@example.com
    - headers
        - Authorization

## KONFIRMASI UPDATE EMAIL
    POST /api/user/account/email/confirmation?code=3XAMP
    - headers
        - Authorization

## SIMPAN PERUBAHAN EMAIL
    PUT /api/user/account/email/confirmation/save
    - headers
        - Authorization

## DATA ALL USER
    GET /api/user
    - headers
        - Authorization(admin)