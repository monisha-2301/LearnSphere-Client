import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";

const quizEndpoints = {
    CREATE_QUIZ_API: '/api/v1/quiz/create',
    GET_QUIZ_API: '/api/v1/quiz',
    UPDATE_QUIZ_API: '/api/v1/quiz/update',
    DELETE_QUIZ_API: '/api/v1/quiz',
}

// Create quiz for a course
export const createQuiz = async (data, token) => {
    try {
        const response = await apiConnector('POST', quizEndpoints.CREATE_QUIZ_API, data, {
            Authorization: `Bearer ${token}`,
        })
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success('Quiz created successfully')
        return response.data
    } catch (error) {
        console.error('CREATE_QUIZ_API API ERROR:', error)
        toast.error(error.message || 'Failed to create quiz')
        return null
    }
}

// Get quiz for a course
export const getQuiz = async (courseId, token) => {
    try {
        const response = await apiConnector('GET', `${quizEndpoints.GET_QUIZ_API}/${courseId}`, null, {
            Authorization: `Bearer ${token}`,
        })
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        return response.data.quiz
    } catch (error) {
        console.error('GET_QUIZ_API API ERROR:', error)
        toast.error(error.message || 'Failed to fetch quiz')
        return null
    }
}

// Update quiz
export const updateQuiz = async (data, token) => {
    try {
        const response = await apiConnector('PUT', quizEndpoints.UPDATE_QUIZ_API, data, {
            Authorization: `Bearer ${token}`,
        })
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success('Quiz updated successfully')
        return response.data.quiz
    } catch (error) {
        console.error('UPDATE_QUIZ_API API ERROR:', error)
        toast.error(error.message || 'Failed to update quiz')
        return null
    }
}

// Delete quiz
export const deleteQuiz = async (courseId, token) => {
    try {
        const response = await apiConnector('DELETE', `${quizEndpoints.DELETE_QUIZ_API}/${courseId}`, null, {
            Authorization: `Bearer ${token}`,
        })
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success('Quiz deleted successfully')
        return true
    } catch (error) {
        console.error('DELETE_QUIZ_API API ERROR:', error)
        toast.error(error.message || 'Failed to delete quiz')
        return false
    }
}