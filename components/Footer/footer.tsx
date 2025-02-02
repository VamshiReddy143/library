"use client";
import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

export function FooterPage() {
  return (
    <Footer className="bg-gray-800   text-white">
   
        {/* Divider */}
        <Footer.Divider className="my-2 border-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <Footer.Copyright
            href="#"
            by="Library App™"
            year={new Date().getFullYear()}
            className="text-gray-400 flex gap-3"
          />

          {/* Social Icons */}
          <div className="flex space-x-5">
            <Footer.Icon
              href="#"
              icon={BsFacebook}
              className="text-gray-400 hover:text-white"
            />
            <Footer.Icon
              href="#"
              icon={BsInstagram}
              className="text-gray-400 hover:text-white"
            />
            <Footer.Icon
              href="#"
              icon={BsTwitter}
              className="text-gray-400 hover:text-white"
            />
            <Footer.Icon
              href="#"
              icon={BsGithub}
              className="text-gray-400 hover:text-white"
            />
            <Footer.Icon
              href="#"
              icon={BsDribbble}
              className="text-gray-400 hover:text-white"
            />
          </div>
        </div>
      
    </Footer>
  );
}