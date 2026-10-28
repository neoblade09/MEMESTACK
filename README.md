# MEMESTACK 🚀

### Your Daily Dose of Memes

MEMESTACK is a responsive meme discovery application designed to make browsing, finding, saving, and sharing memes simple and enjoyable.

Built with React and Vite, MEMESTACK combines a clean user interface with an Express backend to deliver a smooth meme-browsing experience across desktop and mobile devices.

## ✨ Features

* **Browse Memes:** Explore a collection of memes in one place.
* **Search:** Find memes using the search feature.
* **Categories:** Explore memes by category, including Funny, Relatable, Reaction, and Trending.
* **Favorites:** Save your favorite memes for quick access.
* **Sorting:** Organize the memes using the available sorting options.
* **Surprise Me:** Discover a random meme.
* **Share:** Share memes or copy their links.
* **Download:** Download meme images.
* **Detailed View:** Open a meme for a closer look.
* **Responsive Design:** Enjoy the application on desktop and mobile screens.
* **REST API:** Retrieve meme data through the Express backend.

## 🛠️ Tech Stack

**Frontend**

* React
* Vite
* JavaScript
* CSS

**Backend**

* Node.js
* Express.js
* CORS

**Development Tools**

* npm
* Git
* GitHub

## 📁 Project Structure

```text
MEMESTACK/
├── public/
│   ├── data/
│   │   └── memes.json
│   ├── favicon.svg
│   └── icons.svg
├── server/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Install a recent version of Node.js and npm before running the project.

### 1. Clone the repository

```bash
git clone https://github.com/neoblade09/MEMESTACK.git
cd MEMESTACK
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the frontend

From the project root, run:

```bash
npm run dev
```

Open the local URL printed in your terminal, usually:

```text
http://localhost:5173/
```

### 4. Start the backend

Open a second terminal in the project directory and run:

```bash
cd server
npm install
node server.js
```

The API starts on port `5000` by default.

### 5. Verify the API

Open these endpoints in your browser while the backend is running:

**API health check**

```text
http://localhost:5000/
```

**API status**

```text
http://localhost:5000/api/status
```

**Meme collection**

```text
http://localhost:5000/api/memes
```

The meme endpoint returns the meme collection as JSON.

## 🏗️ Production Build

To generate a production build of the frontend, run these commands from the project root:

```bash
npm run build
```

The generated files will be placed in the `dist/` directory.

To run the available code-quality checks, use:

```bash
npm run lint
```

## 🔌 API

| Method | Endpoint      | Description                  |
| ------ | ------------- | ---------------------------- |
| GET    | `/`           | API health check             |
| GET    | `/api/status` | API status information       |
| GET    | `/api/memes`  | Retrieve the meme collection |

## 🔒 Security Notes

* Do not commit `.env` files, passwords, or secret credentials.
* Keep dependencies and lockfiles updated.
* Do not place private information or secret keys in public frontend files or the public meme dataset.

## 🗺️ Future Improvements

Potential improvements include:

* User-submitted memes
* Additional categories and discovery options
* Improved sharing features
* Further performance and accessibility enhancements

## 👨‍💻 Author

**Nachiket**

GitHub: [@neoblade09](https://github.com/neoblade09)

## 📄 License

No license has been specified yet. All rights and permissions remain with the copyright holder unless a license is added to this repository.
