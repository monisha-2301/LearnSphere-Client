import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { ACCOUNT_TYPE } from "../../../utils/constants"
import { enrollCourse } from "../../../services/operations/courseDetailsAPI"
import Img from './../../common/Img';


function CourseDetailsCard({ course, setConfirmationModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleEnroll = async () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't enroll in a course.")
      return
    }
    if (token) {
      try {
        const response = await dispatch(enrollCourse(courseId, token))
        if (response?.success) {
          toast.success("Successfully enrolled in the course")
          window.location.reload()
        } else {
          toast.error(response?.message || "Failed to enroll in the course")
        }
      } catch (error) {
        console.error("Error enrolling in course:", error)
        toast.error("Failed to enroll in the course")
      }
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to enroll in the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5 `}
      >
        {/* Course Image */}
        <Img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <button
                className="yellowButton outline-none"
                onClick={handleEnroll}
              >
                Enroll Now
              </button>
              <button
                className="yellowButton outline-none"
                onClick={() => navigate(`/view-course/${courseId}/section/${course?.courseContent?.[0]?._id}/sub-section/${course?.courseContent?.[0]?.subSection?.[0]?._id}`)}
              >
                Start Learning
              </button>
            </div>
          </div>


          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              Course Requirements :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard