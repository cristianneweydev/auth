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