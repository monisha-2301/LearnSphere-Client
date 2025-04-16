import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { FiDownload } from 'react-icons/fi'
import { apiConnector } from '../../../services/apiConnector'
import { courseEndpoints } from '../../../services/apis'
import QuizAttempt from './QuizAttempt'

const CourseCertificate = ({ courseId, courseName }) => {
    const { token } = useSelector((state) => state.auth)
    const [certificate, setCertificate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [quizPassed, setQuizPassed] = useState(false)

    const handleQuizComplete = (passed) => {
        if (passed) {
            setQuizPassed(true)
            checkCourseCompletion()
        }
    }

    const checkCourseCompletion = async () => {
            try {
                setLoading(true)
                const response = await apiConnector('POST', courseEndpoints.GENERATE_CERTIFICATE_API, { courseId, token }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })

                if (response.data.success) {
                    setCertificate(response.data.certificate)
                    // Convert base64 to blob and trigger download
                    if (response.data.pdfBuffer) {
                        const pdfBlob = new Blob(
                            [Uint8Array.from(atob(response.data.pdfBuffer), c => c.charCodeAt(0))],
                            { type: 'application/pdf' }
                        )
                        const url = window.URL.createObjectURL(pdfBlob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `${courseName}-Certificate.pdf`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        window.URL.revokeObjectURL(url)
                        toast.success('Certificate downloaded successfully')
                    }
                }
                setLoading(false)
            } catch (error) {
                console.error('Certificate generation error:', error)
                if (error.response?.data?.message) {
                    toast.error(error.response.data.message)
                }
                setLoading(false)
            }
        }

        useEffect(() => {
            const initializeCertificate = async () => {
                if (token && courseId) {
                    await checkCourseCompletion()
                }
            }
            initializeCertificate()
        }, [courseId, token])

    const verifyCertificate = async () => {
        try {
            window.open(
                `${import.meta.env.VITE_APP_BASE_URL}/certificate/verify/${certificate.certificateId}`,
                '_blank'
            )
        } catch (error) {
            console.error('Certificate verification error:', error)
            toast.error('Failed to verify certificate')
        }
    }

    if (!certificate && !quizPassed) {
        return <QuizAttempt courseId={courseId} onQuizComplete={handleQuizComplete} />
    }

    if (!certificate) return null

    return (
        <div className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
            <h2 className="text-2xl font-bold text-richblack-5">Course Certificate</h2>
            <p className="mt-2 text-richblack-200">
                Congratulations! You've completed {courseName}
            </p>
            <div className="mt-4 flex items-center gap-4">
                <p className="text-sm text-richblack-300">
                    Certificate ID: {certificate.certificateId}
                </p>
            </div>
            <br />
                <button
                    onClick={verifyCertificate}
                    className="flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-2 text-richblack-900 hover:bg-yellow-100"
                >
                    <FiDownload className="text-lg" />
                    Verify Certificate
                </button>
        </div>
    )
}

export default CourseCertificate