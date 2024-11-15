import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const url = "http://localhost:8000";

function App() {
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socket = io(url);
    setSocket(socket);
    socket.emit("join-room", "1234567");
    socket.on("receive-coordinates", (data) => {
      console.log(data);
    });
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    async function getCoordinates() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.log(error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
    getCoordinates();
  }, []);

  const sendCoordinates = () => {
    if (socket) {
      socket.emit("send-coordinates", {
        coordinates: coordinates,
        roomId: "1234567",
      });
    }
  };
  return (
    <div className="App">
      {JSON.stringify(coordinates)}
      <button onClick={sendCoordinates}>send</button>
    </div>
  );
}

export default App;
