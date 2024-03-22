import React, { useState, useEffect } from 'react';

const App = () => {
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [ORT, setORT] = useState(0);


  // interval(=1.000초) 마다 플라스크 웹서버에 라우팅 함수를 호출해서
  // 실시간으로 변경되는 터틀봇 좌표값을 state X, Y, ORT에 저장
  // 웹서버에서 넘어오는 json파일은 console로 확인바람

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/socket_Pos')
        .then(response => response.json())
        .then(data => {
          setX(data.X);
          setY(data.Y);
          setORT(data.ORT)
        })
        .catch(error => console.error('Error:', error));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Position Now</h1>
      <h2>X : {X}</h2>
      <h2>Y : {Y}</h2>
      <h2>ORT : {ORT}</h2>
    </div>
  );
};

export default App;