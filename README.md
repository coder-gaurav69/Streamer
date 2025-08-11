# 🎥 Streamer – Omegle-like Video Chat App  

**Tech Stack:** WebRTC, Socket.io, Node.js, Express, React  

## 🔹 Description  
Streamer is a real-time video chat web application that connects users randomly, similar to Omegle. It leverages WebRTC for peer-to-peer video calls and Socket.io for signaling.  

## 🎯 Goal of Project  
The primary goal of **Streamer** is to provide a **simple, fast, and seamless way** for strangers to connect via video chat without requiring complicated setups or account creation. It aims to replicate and improve upon the experience of platforms like Omegle by ensuring a **responsive UI**, **smooth peer-to-peer connection**, and **reliable real-time communication**.  

## 🛠 Process of Project  
1. **Planning & Tech Selection** – Chose **WebRTC** for real-time video streaming and **Socket.io** for signaling between peers.  
2. **Backend Setup** – Built with **Node.js + Express**, integrated Socket.io for user pairing logic, signaling, and room management.  
3. **Frontend Development** – Created a **React-based UI** that is intuitive and responsive, with video components, controls, and connection states.  
4. **WebRTC Integration** – Implemented peer connection handling (offer/answer, ICE candidates) for smooth call setup and teardown.  
5. **Testing & Deployment** – Tested for latency, device compatibility, and cross-browser support. Deployed backend and frontend using **Render**.  

## 📌 Features of Project  
- 🎲 **Random User Pairing** – Instantly connects you with a random stranger.  
- 📡 **Real-Time Video Calls** – Powered by **WebRTC** for direct peer-to-peer connections.  
- 🔄 **Automatic Lifecycle Handling** – Joins, leaves, and call endings are handled smoothly.  
- 🎛 **Call Controls** – Mute, unmute, end call, and reconnect options.  
- 📱 **Responsive UI** – Works seamlessly across desktop, tablet, and mobile devices.  

## 📁 Folder Structure  
```
Streamer/
├── client/    # Frontend (React)
├── server/    # Backend (Node.js + Express + Socket.io + WebRTC)
```

## 📷 Screenshots  
<img width="1873" height="903" alt="image" src="https://github.com/user-attachments/assets/9e4ddf6d-8f34-4098-b8c5-f9e9449e4363" />  

## 🔗 Links  
- 🌐 **Live Demo**: [Streamer on Render](https://streamer-1.onrender.com)  
