import React from "react";
import { FooterLink2 } from "../../../data/footer-links";
import { Link } from "react-router-dom";
import { ImGithub, ImLinkedin2 } from "react-icons/im";


// Images
import LearnSphereLogo from "../../assets/Logo/Logo-Full-Light.png";

// footer data
const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];



const Footer = () => {
  return (
    <div className="bg-richblack-800 mx-7 rounded-3xl mb-10">

      <br />
      <br />

      {/* bottom footer */}
      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
        {/* Section 1 */}
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex ">
            {BottomFooter.map((ele, ind) => {
              return (
                <div
                  key={ind}
                  className={` ${BottomFooter.length - 1 === ind ? "" : "border-r border-richblack-700 "}
                   px-3 cursor-pointer hover:text-richblack-50 transition-all duration-200`}
                >
                  <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center flex flex-col sm:flex-row ">
            <div className="flex ">
              <span> ©️Copyright 2025 all rights reserved</span>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default Footer;