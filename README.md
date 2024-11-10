# Running the Next.js App Locally

## Prerequisites
Make sure you have the following installed on your device:
- **Node.js**: Version 12 or later. Download it from [Node.js official website](https://nodejs.org/).
- **npm** or **yarn**: Comes with Node.js, but you can install Yarn separately from [Yarn's website](https://yarnpkg.com/) if preferred.

## Setup Instructions

### 1. Clone the Repository
Clone the repository to your local machine by running:

```sh
git clone https://github.com/ssaarthakk/Money-Tracker.git
```

### 2. Navigate to the Project Directory
Change to the project directory:

```sh
cd Money-Tracker
```

### 3. Configure Environment Variables
Create a `.env` file in the root of your project to store environment-specific variables. Add the following variables:

```plaintext
AUTH_GOOGLE_ID=your-google-auth-client-id
AUTH_GOOGLE_SECRET=your-google-auth-client-secret
DATABASE_URL=your-database-url
AUTH_SECRET=your-authentication-secret
```

- **AUTH_GOOGLE_ID**: The client ID for Google authentication (obtained from Google Developer Console).
- **AUTH_GOOGLE_SECRET**: The client secret for Google authentication (obtained from Google Developer Console).
- **DATABASE_URL**: The connection URL for your MongoDB database.
- **AUTH_SECRET**: A secret key used for session encryption (use a secure, random string).

**Note**: Make sure not to commit this file to version control to keep your credentials secure.

### 4. Install Dependencies
Install all required dependencies by running:

```sh
npm install
```

or if you use Yarn:

```sh
yarn install
```

### 5. Start the Development Server
Run the Next.js development server with:

```sh
npm run dev
```

or if you use Yarn:

```sh
yarn dev
```

The server will start at [http://localhost:3000](http://localhost:3000) by default.

### 6. Access the Application
Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the app running locally.

## Troubleshooting

- If you encounter any errors related to environment variables, double-check that your `.env` file contains all required variables.
- Check that your database is running and accessible with the provided `DATABASE_URL`.

---

## Contributing
Contributions are welcome! Submit a pull request or open an issue for any improvements or bug fixes.

## Open Source Project
Author : Sarthak Kumar<br>
IDE Used : VS Code
