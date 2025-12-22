# Mystic Insights - AI-Powered Tarot & Spiritual Guidance

Mystic Insights is a modern, interactive web application designed to provide users with spiritual guidance through Tarot readings. Built with **Next.js** and **Firebase**, it leverages AI to deliver personalized and meaningful interpretations, making the ancient wisdom of Tarot accessible to everyone.

## ✨ Features Present

### 🔮 Interactive Tarot Reading
-   **AI-Driven Insights**: Users can select cards and receive personalized interpretations based on their specific questions using Genkit and Gemini.
-   **Interactive Deck**: A visually engaging digital deck that allows users to pick their own cards, simulating a real-life reading experience.
-   **Custom Spreads**: (Currently supports 3-card spreads for past, present, future).

### 📅 Daily Inspiration
-   **Card of the Day**: A daily feature that presents a random card with its meaning to offer guidance and reflection for the day ahead.

### 📚 Learning Hub
-   **Major Arcana Explorer**: A dedicated section for users to learn about the 22 Major Arcana cards, complete with high-quality imagery and detailed meanings.

### 👤 User Features
-   **Google Authentication**: Secure and easy sign-in using Google accounts via Firebase Auth.
-   **Reading History**: Users can save their readings to their profile (persisted in Firestore) to revisit past insights.
-   **History Management**: Options to delete individual readings or clear the entire history.

### 🗓️ Booking System
-   **Service Tiers**: Clear display of different reading packages (Quick Insight, Standard Spread, Deep Dive).
-   **Booking Request Form**: A streamlined form for users to request personal one-on-one sessions, integrated with form validation.

### 🎨 UI/UX
-   **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
-   **Animations**: Smooth transitions and interactive elements powered by Framer Motion.
-   **Modern Aesthetics**: Glassmorphism effects, rich gradients, and a cohesive mystical theme.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, CSS Modules
-   **UI Components**: Radix UI, Lucide React
-   **Animations**: Framer Motion
-   **Backend / BaaS**: Firebase (Authentication, Firestore)
-   **AI Integration**: Genkit, Google Gemini

## 🚀 Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd suntarot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Firebase and Genkit credentials.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to `http://localhost:3000` to see the application.

## 🗺️ Future Roadmap

Here are potential features that could be added to enhance the application further:

-   **💳 Payment Gateway Integration**: Integrate Stripe or PayPal to allow direct payments for booking sessions.
-   **🧠 Advanced AI Models**: Fine-tune the AI personas to offer different "reading styles" (e.g., empathetic, direct, mystical).
-   **🎴 Minor Arcana Support**: Expand the learning hub and reading deck to include the 56 Minor Arcana cards for more detailed readings.
-   **🔔 Real-time Notifications**: Implement email or push notifications for booking confirmations and "Card of the Day" reminders.
-   **📱 PWA Support**: Turn the website into a Progressive Web App for a native app-like experience on mobile.
-   **🗣️ Social Sharing**: Allow users to share their reading results on social media platforms with generated images.
-   **⚡ Admin Dashboard**: A secure admin panel to manage bookings, view user stats, and update content dynamically.

---
Built with ❤️ by Parul for the spiritual community.
