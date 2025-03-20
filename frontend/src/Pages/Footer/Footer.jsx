import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <div>
      <div className="footer" style={{color:'white'}}>
        <div className="footerchild">
          <div className="footerGrandChild1">
            <div>
              <h1>Streamer</h1>
              <p>Connecting people worldwide through meaningful conversations.</p>
              <div >
                <i className="fa-brands fa-facebook-f"></i>
                <i className="fa-brands fa-google"></i>
                <i className="fa-brands fa-twitter"></i>
              </div>
            </div>
            <div>
              <h2>Company</h2>
              <Link>About Us</Link>
              <Link>Careers</Link>
              <Link>Press</Link>
              <Link>Blog</Link>
            </div>
            <div>
              <h2>Support</h2>
              <Link>Safety Center</Link>
              <Link>Help Center</Link>
              <Link>Community Guidelines</Link>
              <Link>Cookie Policy</Link>
            </div>
            <div>
              <h2>Contact</h2>
              <Link>support@Streamer.com</Link>
              <button>Contact Us</button>
            </div>
          </div>
          <hr />
          <div className="footerGrandChild2">
            <p style={{flexGrow:'1'}}>© 2025 RandomChat. All rights reserved.</p>
            <div>
              <Link>Terms of Service</Link>
              <Link>Privacy Policy</Link>
              <Link>Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
