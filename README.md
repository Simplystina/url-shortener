# url-shortener

## URL Shortener Backend
This repository contains the backend code for a URL shortener application. The backend is built using Node.js and Express, and it provides RESTful APIs to create shortened URLs, redirect to the original URLs, generate QR codes, manage link history, and delete links.

## Table of Contents
* Installation
* Usage
* API Endpoints
* Technologies Used
* License
*Installation
* Clone the repository:


```git clone <repository_url>```

## Install the dependencies


```cd url-shortener-backend```
npm install

## Set up the environment variables:

Create a .env file in the root directory of the project.
Define the following environment variables in the .env file:
* DATABASE_URL: The MongoDB connection URI.
* JWT_SECRET: Secret key used for JSON Web Token (JWT) generation.
* Other configuration variables (e.g., email service credentials, base URL) depending on your implementation.
Start the server:

Run the server with
```npm start```
The server will start running at http://localhost:3000 by default.

## Usage
Make sure the backend server is running before using the frontend or making API requests.

## API Endpoints
The backend provides the following API endpoints:

* POST /urls/shorten: Creates a shortened URL for the original URL.
* GET /:shortId: Redirects the user to the original URL associated with the short ID.
* GET /qrcode/:shortId: Generates a QR code image for the original URL associated with the short ID.
* GET /urls/links/history: Retrieves the link history of the authenticated user.
* DELETE /urls/link/:id: Deletes a link by its ID.
For detailed information about each API endpoint, including request/response formats and authentication requirements, refer to the API documentation [https://documenter.getpostman.com/view/19697282/2s93zB62eg](https://documenter.getpostman.com/view/19697282/2s93zB62eg).

## Technologies Used
Node.js
Express
MongoDB
JSON Web Token (JWT)
Nodemailer (for sending verification emails)
QRCode-generator (for generating QR codes)

## License
This project is licensed under the MIT License.







## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [URL Shortener](#url-shortener)
- [Technologies Used](#technologies-used)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
Install the dependencies:

bash
Copy code
cd url-shortener-backend
npm install
Set up the environment variables:

Create a .env file in the root directory of the project.
Define the following environment variables in the .env file:
MONGODB_URI: The MongoDB connection URI.
JWT_SECRET: Secret key used for JSON Web Token (JWT) generation.
Other configuration variables (e.g., email service credentials, base URL) depending on your implementation.
Start the server:

bash
Copy code
npm start
The server will start running at http://localhost:3000 by default.

Usage
Make sure the backend server is running before using the frontend or making API requests.

API Endpoints
Authentication
POST /register: Registers a new user with the provided details.
POST /login: Authenticates a user and returns a JWT token for subsequent API requests.
GET /verify?token=<verification_token>: Verifies the user's email address using the verification token.
POST /resend-verification: Resends the verification email to the user.
URL Shortener
POST /shorten: Creates a shortened URL for the original URL.
GET /:shortId: Redirects the user to the original URL associated with the short ID.
GET /qrcode/:shortId: Generates a QR code image for the original URL associated with the short ID.
GET /link-history: Retrieves the link history of the authenticated user.
DELETE /delete-link/:id: Deletes a link by its ID.
For detailed information about each API endpoint, including request/response formats and authentication requirements, refer to the API documentation.

Technologies Used
Node.js
Express
MongoDB
JSON Web Token (JWT)
Nodemailer (for sending verification emails)
QRCode-generator (for generating QR codes)
License
This project is licensed under the MIT License.

Feel free to update the sections based on your specific implementation and add any additional information that you think is relevant for your users.

css
Copy code

Please note that the authentication endpoints provided in the README assume the presence of the corresponding routes and their associated controller methods in your backend code.





