import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

const QuizAttempt = ({ courseId, onQuizComplete }) => {
    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([])
    const [currentAnswers, setCurrentAnswers] = useState({})
    const [quizCompleted, setQuizCompleted] = useState(false)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/quiz/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                if (data.success) {
                    setQuestions(data.quiz.questions)
                    // Initialize answers object
                    const initialAnswers = {}
                    data.quiz.questions.forEach((_, index) => {
                        initialAnswers[index] = null
                    })
                    setCurrentAnswers(initialAnswers)
                }
            } catch (error) {
                console.error('Error fetching quiz:', error)
                toast.error('Failed to load quiz')
            }
        }

        if (courseId) {
            fetchQuiz()
        }
    }, [courseId, token])

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setCurrentAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }))
    }

    const handleSubmit = async () => {
        // Check if all questions are answered
        const unansweredQuestions = Object.values(currentAnswers).some(answer => answer === null)
        if (unansweredQuestions) {
            toast.error('Please answer all questions')
            return
        }

        setLoading(true)
        try {
            // Submit answers to backend
            const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/quiz/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    courseId,
                    answers: Object.values(currentAnswers)
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            if (data.success) {
                if (data.quizAttempt.passed) {
                    setQuizCompleted(true)
                    toast.success(data.message)
                    onQuizComplete && onQuizComplete(true)
                } else {
                    toast.error(data.message)
                    // Reset answers
                    const resetAnswers = {}
                    questions.forEach((_, index) => {
                        resetAnswers[index] = null
                    })
                    setCurrentAnswers(resetAnswers)
                }
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error('Error submitting quiz:', error)
            toast.error('Failed to submit quiz')
        }
        setLoading(false)
    }

    if (quizCompleted) {
        return (
            <div className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
                <h2 className="text-2xl font-bold text-richblack-5">Quiz Completed!</h2>
                <p className="mt-2 text-richblack-200">
                    Congratulations! You've passed the quiz and can now access your certificate.
                </p>
            </div>
        )
    }

    return (
        <div className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
            <h2 className="text-2xl font-bold text-richblack-5">Course Quiz</h2>
            <p className="mt-2 text-richblack-200">
                Complete this quiz with all correct answers to receive your certificate.
                You can retry as many times as needed.
            </p>

            <div className="mt-6 space-y-6">
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="space-y-4">
                        <p className="text-lg font-medium text-richblack-5">
                            {qIndex + 1}. {question.questionText}
                        </p>
                        <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                                <label
                                    key={oIndex}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${qIndex}`}
                                        checked={currentAnswers[qIndex] === oIndex}
                                        onChange={() => handleAnswerSelect(qIndex, oIndex)}
                                        className="form-radio"
                                        disabled={loading}
                                    />
                                    <span className="text-richblack-5">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 rounded-md bg-yellow-50 px-6 py-3 text-center text-richblack-900 font-semibold hover:bg-yellow-100"
            >
                {loading ? 'Submitting...' : 'Submit Quiz'}
            </button>
        </div>
    )
}

export default QuizAttempt