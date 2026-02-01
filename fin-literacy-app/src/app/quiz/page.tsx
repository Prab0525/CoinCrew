"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useCoins } from '../../context/CoinsContext';

export default function QuizPage() {
  const [hydrated, setHydrated] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { coins, setCoins, addCoins } = useCoins();
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Fetch questions on component mount and level change
  useEffect(() => {
    fetchQuestions(level);
  }, [level]);

  const fetchQuestions = async (selectedLevel: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: 'Financial Literacy',
          difficulty: selectedLevel === 1 ? 'easy' : selectedLevel === 2 ? 'medium' : 'hard'
        }),
      });
      const data = await res.json();
      // Map API response format to component format
      const qs = Array.isArray(data.questions) ? data.questions : [];
      const formattedQuestions = qs.map((q: any) => ({
        question: q.question || "",
        options: q.choices || [],
        answerIndex: q.correctIndex,
      }));
      setQuestions(formattedQuestions);
      setCurrentIndex(0);
      setAnswered(false);
      setSelectedAnswer(null);
      setResult('');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setLoading(false);
    }
  };

  const selectAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);

    const q = questions[currentIndex];
    if (index === q.answerIndex) {
      const bonus = streak;
      const earnedCoins = 10 + bonus;
      setCoins(prev => prev + earnedCoins);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      setResult(`Correct! +${earnedCoins} coins`);
    } else {
      setStreak(0);
      setResult(`Wrong! Correct answer: ${q.options[q.answerIndex]}`);
    }
  };

  const nextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setResult('');
    } else {
      // End of level: require 5/10 to advance
      if (correctCount >= 5) {
        setLevel(prev => prev + 1);
        alert(`Level up! Now at Level ${level + 1}`);
        // reset per-level counters and fetch next level questions
        setCorrectCount(0);
        setStreak(0);
        setCurrentIndex(0);
        await fetchQuestions(level + 1);
      } else {
        // failed to reach threshold — show message and offer retry
        const retry = confirm(`You scored ${correctCount}/10. Need 5/10 to advance. Retry this level?`);
        if (retry) {
          // reset the current level questions
          setCorrectCount(0);
          setStreak(0);
          await fetchQuestions(level);
        } else {
          // leave user on same page; reset counters
          setCorrectCount(0);
          setStreak(0);
          setCurrentIndex(0);
        }
      }
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading questions...</p>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No questions available. Please try again.</p>
      </main>
    );
  }

  const q = questions[currentIndex];

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main
        style={{
          backgroundImage: "url('image1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 16,
          }}
        >
          {/* NAVBAR */}
          <nav
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'right',
              gap: 20,
              padding: 12,
              marginBottom: 16,
            }}
          >
            {['Dashboard', 'Doc', 'Quiz', 'Shop'].map(page => (
              <a
                key={page}
                href={`/${page.toLowerCase()}`}
                style={{
                color: page === "Quiz" ? "#000000" : "#5c5858",
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: 8,
                  transition: 'all 0.2s',
                }}
              >
                {page}
              </a>
            ))}
          </nav>

          {/* HEADER */}
          <header
            style={{
              width: '100%',
              textAlign: 'center',
              borderRadius: 16,
              fontSize: 50,
              fontWeight: 700,
              color: '#000000',
              marginBottom: 16,
            }}
          >
            Financial Literacy Quiz
          </header>

          {/* Coin Progress Bar */}
          {hydrated && (
          <div style={{ width: '100%', maxWidth: 600, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#000000' }}>💰 Coins Progress</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#000000' }}>{coins} / 1000</span>
            </div>
            <div
              style={{
                width: '100%',
                height: 24,
                backgroundColor: 'hsla(195, 34%, 74%, 0.30)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '2px solid #acc1db',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min((coins / 1000) * 100, 100)}%`,
                  backgroundColor: '#acc1db',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
          )}

          {/* Stats Display */}
          {hydrated && (
          <div style={{ display: 'flex', gap: 20, marginBottom: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 600, fontSize: 18, color: '#000000', margin: 0 }}>
              💰 Coins: {coins}
            </p>
            <p style={{ fontWeight: 600, fontSize: 18, color: '#000000', margin: 0 }}>
              🔥 Streak: {streak}
            </p>
            <p style={{ fontWeight: 600, fontSize: 18, color: '#000000', margin: 0 }}>
              📊 Level: {level}
            </p>
            <p style={{ fontWeight: 600, fontSize: 18, color: '#000000', margin: 0 }}>
              ✅ Score: {correctCount}/10
            </p>
          </div>
          )}

          {/* Question Display */}
          <section
            style={{
              width: '100%',
              maxWidth: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#000000' }}>
              Level {level} | Question {currentIndex + 1} of {questions.length}
            </h2>

            <p
              style={{
                fontSize: 18,
                fontWeight: 500,
                marginBottom: 24,
                color: '#333',
              }}
            >
              {q.question}
            </p>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {q.options.map((option: string, idx: number) => (
                <label
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: 8,
                    cursor: answered ? 'default' : 'pointer',
                    backgroundColor:
                      selectedAnswer === idx
                        ? idx === q.answerIndex
                          ? '#d4edda'
                          : '#f8d7da'
                        : 'rgba(163, 204, 218, 0.2)',
                    border: selectedAnswer === idx ? '2px solid #28a745' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!answered) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(163, 204, 218, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!answered) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(163, 204, 218, 0.2)';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="option"
                    value={idx}
                    checked={selectedAnswer === idx}
                    onChange={() => selectAnswer(idx)}
                    disabled={answered}
                    style={{ marginRight: 12, cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 500, color: '#333' }}>{option}</span>
                </label>
              ))}
            </div>

            {/* Result Message */}
            {result && (
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  marginBottom: 16,
                  color: selectedAnswer === q.answerIndex ? '#28a745' : '#dc3545',
                }}
              >
                {result}
              </p>
            )}

            {/* Next Button */}
            {answered && (
              <button
                onClick={nextQuestion}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: '#8bacd5',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 16,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6d92b8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8bacd5')}
              >
                {currentIndex + 1 < questions.length ? 'Next Question' : 'Level Up'}
              </button>
            )}
          </section>
        </div>
      </main>
    </>
  );
}