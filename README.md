# Financial Literacy Learning App

An interactive financial literacy web application built with **Next.js** and **TypeScript**.  
The app helps users understand money concepts through AI-generated quizzes, a life simulation shop, and a Docs tool that explains real-world financial and government letters in an age-appropriate way, including an AI chatbot for follow-up questions.

---

## Core Features
### Docs — Financial and Government Letter Explainer
Users can paste a government or financial document (such as tax notices, bank letters, or billing statements) and receive:

- An age-appropriate explanation of the document
- Key details extraction:
  - Important dates
  - Amounts owed or paid
  - Required actions
- A glossary with simple definitions of financial terms used in the document

This feature is designed to help young users understand real-world financial communication clearly and confidently.

---

### Docs Chatbot — Ask Questions About Your Document
The Docs section includes an AI-powered chatbot that allows users to ask follow-up questions about their document.

#### Chatbot Capabilities
- Answers questions only related to the current document
- Helps users:
  - Clarify confusing sections
  - Understand deadlines and consequences
  - Interpret financial terms in context
- Maintains an age-appropriate, educational tone

---

### Financial Literacy Quiz
- AI-generated questions using the Gemini API
- Topics focused on financial literacy
- Difficulty levels:
  - Easy
  - Medium
  - Hard
- Level progression system:
  - Users must score at least **5/10** to advance
- Coin reward system:
  - Base coins per correct answer
  - Bonus coins for answer streaks
- Tracks coins, streaks, levels, and score
- Fully interactive client-side page using `"use client"`

---

### Life Shop (Spending Simulation)
- A virtual shop where users spend earned coins
- Categories include:
  - Games
  - Toys
  - Clothes
  - Food
  - Bills
  - Rent
- Reinforces real-life budgeting and spending decisions
- Items are locked if the user cannot afford them
- Purchased items are tracked per session
- Coin balance is shared globally across the app
- Implemented as a client-side interactive experience (`"use client"`)

---

#### Privacy and Safety
- Raw document text is never stored
- The chatbot operates using:
  - The generated explanation
  - Extracted key details
  - Glossary terms
- Responses are grounded in document context to prevent unrelated or hallucinated answers

---

## Privacy and Data Handling

User privacy is a core design principle of this project.

- Raw document text is never saved
- Only non-sensitive metadata is stored:
  - Document type
  - Tags
  - Date
- No names, financial amounts, or full document contents are persisted
- Ensures responsible handling of sensitive financial information

---

## Tech Stack

### Frontend
- Language: TypeScript
- Framework: Next.js (App Router)
- Styling: TailwindCSS  
  - Optional UI components using shadcn/ui
- Fonts: Google Fonts (loaded via `<Head>`)

### Backend and API
- API style: Next.js Route Handlers
  - Located in `/app/api/.../route.ts`
  - All endpoints return JSON
- AI integration: Gemini API
  - Quiz question generation
  - Document explanations
  - Document chatbot responses

### Database
- MongoDB Atlas
- Mongoose for schema modeling and data access
- Used to store document metadata only

### Deployment
- Vercel (optional, used for demo purposes)

---

## Project Structure (Simplified)

