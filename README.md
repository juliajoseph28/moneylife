# moneylife
Financial literacy game for young children from underserved communities for ElleHacks 2026.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd moneylife/client
   npm install
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the client directory
   - Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your API key to the `.env` file: `VITE_GEMINI_API_KEY=your_actual_api_key`

4. Start the development server:
   ```bash
   cd client
   npm run dev
   ```

## Features

- Interactive financial literacy game
- AI-powered chat mentor (Penny) using Google Gemini
- Age-appropriate content for kids and teens
- Progress tracking and goal setting
