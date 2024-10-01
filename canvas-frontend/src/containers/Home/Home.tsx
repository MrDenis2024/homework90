import React, {useEffect, useRef, useState} from 'react';
import {Draw, IncomingDraw} from '../../types.ts';

const Home = () => {
  const [draws, setDraws] = useState<Draw[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, serColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);

  const drawCircle = (x: number, y: number, color: string) => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.beginPath();
      context.fillStyle = color;
      context.arc(x, y, 10, 0, 2 * Math.PI);
      context.fill();
    }
  };

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/canvas');

    ws.current.onmessage = (event) => {
      const decodedDraw = JSON.parse(event.data) as IncomingDraw;

      if (decodedDraw.type === 'INIT' || decodedDraw.type === 'NEW_DRAW') {
        decodedDraw.payload.forEach((draw) => {
          drawCircle(draw.x, draw.y, draw.color);
        });
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    setDraws((prevState) => [...prevState, {x, y, color}]);

    drawCircle(x, y, color);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;

    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    setDraws((prevState) => [...prevState, {x, y, color}]);

    drawCircle(x, y, color);
  };

  const handleMouseUp = () => {
    if(!ws.current) return;
    ws.current.send(JSON.stringify({ type: 'DRAW', payload: draws }));
    setIsDrawing(false);
    setDraws([]);
  };

  return (
    <div className='mt-5 text-center'>
      <div>
        <h2>Canvas drawing</h2>
        <input type="color" value={color} onChange={e => serColor(e.target.value)}/>
      </div>
      <canvas ref={canvasRef} width={800} height={600} className='border border-2 border-black'  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
    </div>
  );
};

export default Home;