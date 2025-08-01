import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center scale-90">
      <div className="w-[100px] h-[100px] rounded-full animate-spin bg-[conic-gradient(blue_0deg_60deg,_rgb(249,250,251)_60deg_360deg)] flex items-center justify-center">
        <div className="w-[95px] h-[95px] bg-gray-50 rounded-full"></div>
      </div>
    </div>
  )
}

export default Loader
