import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { MdAddCircle } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'

import { setStep } from '../../../../../slices/courseSlice'
import IconBtn from '../../../../common/IconBtn'

const QuizForm = () => {
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctOption: 0 }
    ])

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm()

    useEffect(() => {
        // Fetch existing quiz if available
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/quiz/${course._id}`, {
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
                }
            } catch (error) {
                console.error('Error fetching quiz:', error)
            }
        }
        if (course?._id) {
            fetchQuiz()
        }
    }, [course._id, token])

    const addQuestion = () => {
        if (questions.length < 5) {
            setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOption: 0 }])
        } else {
            toast.error('Maximum 5 questions allowed')
        }
    }

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index)
        setQuestions(newQuestions)
    }

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].options[optionIndex] = value
        setQuestions(newQuestions)
    }

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions]
        newQuestions[index].questionText = value
        setQuestions(newQuestions)
    }

    const handleCorrectOptionChange = (questionIndex, optionIndex) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].correctOption = optionIndex
        setQuestions(newQuestions)
    }

    const onSubmit = async () => {
        if (questions.length !== 5) {
            toast.error('Please add exactly 5 questions')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/quiz/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    courseId: course._id,
                    questions
                })
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            if (data.success) {
                toast.success('Quiz created successfully')
                dispatch(setStep(4))
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error creating quiz:', error)
            toast.error('Failed to create quiz')
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5">Course Quiz</label>
                <p className="text-xs text-richblack-300">Add 5 multiple choice questions for your course</p>
            </div>

            {questions.map((question, qIndex) => (
                <div key={qIndex} className="space-y-4 border-b border-richblack-700 pb-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-richblack-5">Question {qIndex + 1}</p>
                        {questions.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className="text-sm text-pink-200"
                            >
                                <RiDeleteBin6Line />
                            </button>
                        )}
                    </div>

                    <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        placeholder="Enter question"
                        className="form-style w-full"
                        required
                    />

                    <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={question.correctOption === oIndex}
                                    onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                    className="form-radio"
                                />
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    placeholder={`Option ${oIndex + 1}`}
                                    className="form-style flex-1"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {questions.length < 5 && (
                <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-x-2 text-yellow-50"
                >
                    <MdAddCircle className="text-lg" />
                    <span>Add Question</span>
                </button>
            )}

            <div className="flex justify-end gap-x-2">
                <button
                    type="button"
                    onClick={() => dispatch(setStep(1))}
                    className="flex items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                >
                    Back
                </button>
                <IconBtn
                    disabled={loading}
                    text={loading ? "Saving..." : "Save & Continue"}
                />
            </div>
        </form>
    )
}

export default QuizForm