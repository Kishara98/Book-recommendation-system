
# Book Recommendation System

## Project Overview


The Book Recommendation System is a web application that allows users to track their reading progress, manage their book collections, and leave reviews. Additionally, the app integrates with a Discord bot, enabling users to interact with their book collections directly from a Discord server.

### Features:

- User Authentication (Sign-up, Login, Logout)
- Personal Book Library Management (Add, View, Edit, Delete books)
- Book Reviews and Ratings
- Responsive and mobile-friendly design
- Integration with a Discord bot (Future enhancement)

## Technologies Used
### Backend
- Framework: Node.js with Express.js
- Database: MongoDB (via Mongoose)
- Authentication: JSON Web Tokens (JWT)
- Other Dependencies: bcrypt.js, body-parser, dotenv, cors

### Frontend
- Framework: React.js
- Styling: Material-UI, Bootstrap, MDB React UI Kit
- Routing: React Router

### Server and Deployment

- Cloud Platform: DigitalOcean & Netlify
- Database Hosting: MongoDB Atlas


## Setup and Installation
### Backend Setup
Clone the backend repository:

```
git clone https://github.com/Kishara98/book-recommendation-system-backend.git
cd book-recommendation-system-backend
```

Install dependencies:

```
npm install
```


Create a .env file in the root directory and configure the following variables:
```
PORT=5000
MONGO_URI=<MongoDB URI>
JWT_SECRET=<JWT Secret>
ALLOWED_ORIGINS=<ORIGIN LIST>
```

Start the backend server:
```
npm run dev
```

### Frontend Setup

Clone the frontend repository:

```
git clone https://github.com/Kishara98/book-recommendation-system-frontend.git
cd book-recommendation-system-frontend
```

Install dependencies:

```
npm install
```

Start the development server:
```
npm start
```

## Deployment Details
(Deployment details will be added after the project is deployed.)

## Instructions for Linking Discord Accounts and Using the Discord Bot
(Details will be added after the Discord bot integration is implemented.)

