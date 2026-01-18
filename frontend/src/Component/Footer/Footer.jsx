import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="w-full px-8 py-2 text-white">
      <div className="w-4/5 mx-auto py-8 flex flex-col">
        <div className="flex flex-wrap justify-evenly py-8">
          <div className="flex flex-col items-center gap-2 basis-1/4 p-4">
            <h1 className="py-2 text-2xl font-bold">Streamer</h1>
            <p className="py-2 text-center text-gray-400">Connecting people worldwide through meaningful conversations.</p>
            <div className="flex gap-6 py-4 justify-center">
              <i className="fa-brands fa-facebook-f text-2xl hover:scale-125 hover:text-blue-600 transition-transform duration-300"></i>
              <i className="fa-brands fa-google text-2xl hover:scale-125 hover:text-blue-600 transition-transform duration-300"></i>
              <i className="fa-brands fa-twitter text-2xl hover:scale-125 hover:text-blue-600 transition-transform duration-300"></i>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 basis-1/4 p-4">
            <h2 className="py-2 text-xl font-semibold">Company</h2>
            <Link className="text-gray-400 py-2">About Us</Link>
            <Link className="text-gray-400 py-2">Careers</Link>
            <Link className="text-gray-400 py-2">Press</Link>
            <Link className="text-gray-400 py-2">Blog</Link>
          </div>

          <div className="flex flex-col items-center gap-2 basis-1/4 p-4">
            <h2 className="py-2 text-xl font-semibold">Support</h2>
            <Link className="text-gray-400 py-2 text-center">Safety Center</Link>
            <Link className="text-gray-400 py-2 text-center">Help Center</Link>
            <Link className="text-gray-400 py-2 text-center">Community Guidelines</Link>
            <Link className="text-gray-400 py-2 text-center">Cookie Policy</Link>
          </div>

          <div className="flex flex-col items-center gap-2 basis-1/4 p-4">
            <h2 className="py-2 text-xl font-semibold">Contact</h2>
            <Link className="text-gray-400 py-2">support@Streamer.com</Link>
            <button className="mt-2 px-6 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-black transition-colors duration-300">Contact Us</button>
          </div>
        </div>

        <hr className="border-t-2 border-white/20" />

        <div className="flex flex-wrap justify-center items-center text-center gap-2 py-6">
          <p className="flex-grow text-sm text-white">© 2025 RandomChat. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 flex-grow">
            <Link className="text-gray-400 text-sm">Terms of Service</Link>
            <Link className="text-gray-400 text-sm">Privacy Policy</Link>
            <Link className="text-gray-400 text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
