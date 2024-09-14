// src/components/VideoChat.js
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const socket = io('http://localhost:5000');

const VideoChat = () => {
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const userVideo = useRef(null);
  const partnerVideo = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        setStream(stream);

        const peer = new SimplePeer({
          initiator: window.location.hash === '#init',
          trickle: false,
          stream: stream
        });

        peer.on('signal', (data) => {
          socket.emit('offer', data);
        });

        socket.on('offer', (data) => {
          peer.signal(data);
        });

        peer.on('signal', (data) => {
          socket.emit('answer', data);
        });

        socket.on('answer', (data) => {
          peer.signal(data);
        });

        peer.on('stream', (stream) => {
          partnerVideo.current.srcObject = stream;
        });

        peer.on('error', (err) => {
          console.error('Error:', err);
        });

        setPeer(peer);
      })
      .catch((err) => {
        console.error('Error accessing media devices.', err);
      });

    socket.on('ice-candidate', (data) => {
      peer.signal(data);
    });

  }, []);

  return (
    <div>
      <video ref={userVideo} autoPlay playsInline muted />
      <video ref={partnerVideo} autoPlay playsInline />
    </div>
  );
};

export default VideoChat;
