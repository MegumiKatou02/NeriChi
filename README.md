# NeriChi

**NeriChi** is a modern platform for searching, saving, and sharing song lyrics, supporting multiple languages. Built with Next.js, Firebase, Chakra UI, and Tailwind CSS.

## 🚀 Key Features

- **Lyrics Search**: Fast and accurate search by song title, artist, or lyrics snippet.
- **Save Favorites**: Log in to save your favorite songs for easy access anytime.
- **Multi-language Support**: Supports lyrics in Vietnamese, English, Korean, Japanese, Chinese, and more.
- **Contribute Lyrics**: Users can submit new song lyrics, pending admin approval.
- **Easy Sharing**: Share songs via Facebook, Twitter, or by copying the link.
- **Account Management**: Update personal information and manage saved songs.
- **Admin Panel**: Review, approve, or reject user-submitted songs.

## 🖼️ Interface

- Modern design with dark/light mode support.
- Responsive and optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

- **Next.js** 15 (App Router, TypeScript)
- **React** 19
- **Firebase** (Auth, Firestore)
- **Chakra UI** & **Tailwind CSS** (UI/UX)
- **Zustand** (State management)
- **Framer Motion** (Animation)
- **React Icons**
- **Next Themes** (Dark/Light mode)

## ⚡️ Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/MegumiKatou02/NeriChi.git
    cd lyrics-next
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    # or npm install
    ```

3.  **Configure environment variables:**

    - Create a `.env.local` file based on the `.env` template.
    - Fill in your Firebase project credentials.

4.  **Run the development server:**
    ```bash
    yarn dev
    # or npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Contributing Lyrics

- Log in with your Google account.
- Navigate to the **"Add Song"** section.
- Enter the required information: title, artist, lyrics, language, and translation (optional).
- The song will be submitted for admin review.

## 👤 Account & Management

- Log in using Google authentication.
- View and edit your profile information.
- Access your list of saved songs.

## 🛡️ Admin Features

- Access the admin panel to review newly submitted songs.
- Approve or reject submissions to maintain content quality.

## 📦 Available Scripts

- `yarn dev` - Starts the development server.
- `yarn build` - Builds the application for production.
- `yarn start` - Runs the production build.
- `yarn lint` - Lints the codebase.

## 📁 Folder Structure

- `src/app/` - Main application routes (App Router).
- `src/app/components/` - Reusable UI components.
- `src/app/hooks/` - Custom React hooks.
- `src/app/firebase/` - Firebase configuration and services.
- `src/app/store/` - State management setup (Zustand).
- `src/app/types/` - TypeScript type definitions.

## 📝 License

MIT License.
