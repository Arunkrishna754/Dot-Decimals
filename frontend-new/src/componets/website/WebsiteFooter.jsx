import React from "react";
import {
  BsFacebook,
  BsLinkedin,
  BsThreadsFill,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { companyDetails, logoImg, QuickLinks, routes } from "../../constant";
import { Link } from "react-router-dom";
import { RiInstagramFill, RiTwitterXLine } from "react-icons/ri";

const WebsiteFooter = () => {
  return (
    <div className="py-14 bg-gradient-to-r from-primary/30 to-secondary/30">
      <div className="wrapper text-white">
        <div className="flex md:flex-row flex-col justify-between gap-10">
          <div className="flex flex-col items-center">
            <img src={logoImg} className="w-[12rem] mb-2" alt="logo" />
            <p className="desc md:max-w-[15rem] text-sm text-center">
              We have rapidly grown into a trusted partner for organizations
              seeking digital transformation, enhanced operational efficiency.
            </p>
          </div>
          <div className="flex md:flex-row flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h6 className="font-medium mb-1">Quick Links</h6>
              {QuickLinks.map(({ name, path }) => (
                <Link
                  key={path}
                  to={path}
                  className="text-white/70 desc text-sm hover:text-primary transition-all duration-300"
                >
                  {name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h6 className="font-medium mb-1">Contact Us</h6>
              <div className="flex flex-col space-y-2">
                <h6 className="text-[.9rem] mb-1">Phone</h6>
                <Link
                  to={`tel:${companyDetails.phone}`}
                  className="text-white/70 desc text-sm"
                >
                  {companyDetails.phone}
                </Link>
                <Link
                  to={`tel:${companyDetails.tel}`}
                  className="text-white/70 desc text-sm"
                >
                  {companyDetails.tel}
                </Link>
              </div>
              <div className="flex flex-col mt-2">
                <h6 className="text-[.9rem] mb-1">Office Address</h6>
                <p className="text-white/70 desc text-sm max-w-[15rem]">
                  {companyDetails.address}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-7 border-t text-white/80 border-primary w-full">
          <div className="flex justify-center gap-5 w-full">
            <div
              className="flex gap-5 items-center mt-5 p-4 rounded-[1rem] "
              // style={{
              //   background:
              //     "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
              //   backdropFilter: "blur(20px)",
              //   border: "1px solid rgba(255, 255, 255, 0.3)",
              // }}
            >
              <Link target="_blank" to={companyDetails.facebook}>
                <BsFacebook className="text-xl text-white/80 hover:text-primary transition-all duration-300" />
              </Link>
              <Link target="_blank" to={companyDetails.x}>
                <RiTwitterXLine className="text-xl text-white/80 hover:text-primary transition-all duration-300" />
              </Link>
              <Link target="_blank" to={companyDetails.linkedin}>
                <BsLinkedin className="text-xl text-white/80 hover:text-primary transition-all duration-300" />
              </Link>
              <Link target="_blank" to={companyDetails.threads}>
                <BsThreadsFill className="text-xl text-white/80 hover:text-primary transition-all duration-300" />
              </Link>
              <Link target="_blank" to={companyDetails.instagram}>
                <RiInstagramFill
                  size={25}
                  className="text-xl text-white/80 hover:text-primary transition-all duration-300"
                />
              </Link>
            </div>
          </div>
          <div className="mt-5 text-center  text-sm flex flex-col">
            {/* First div for copyright */}
            <div>
              <p className="text-white">© 2025 dots&decimals infotech. All rights reserved.</p>
            </div>

            {/* Second div for recognition */}
            <div>
              <p className="text-base md:text-[16px]">
                Recognized by the Government of India under DPIIT
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WebsiteFooter;
