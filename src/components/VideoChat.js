// src/components/VideoChat.js
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const socket = io('http://localhost:5001');

const VideoChat = () => {
  const [stream, setStream] = useState(null); // Define state for the stream
  const [peer, setPeer] = useState(null);
  const userVideo = useRef(null);
  const partnerVideo = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        userVideo.current.srcObject = mediaStream;
        setStream(mediaStream); // Set the stream state

        const peer = new SimplePeer({
          initiator: window.location.hash === '#init',
          trickle: false,
          stream: mediaStream
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
      if (peer) {
        peer.signal(data);
      }
    });

    // Cleanup function to stop the media stream and close the peer connection on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };

  }, [peer, stream]); // Include stream in dependencies

  return (
    <div>
      <video ref={userVideo} autoPlay playsInline muted />
      <video ref={partnerVideo} autoPlay playsInline />
    </div>
  );
};

export default VideoChat;
