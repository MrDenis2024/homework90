import React, {useRef, useState} from 'react';
import {Draw} from '../../types.ts';

const Home = () => {
  const [draws, setDraws] = useState<Draw[]>([]);
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

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = event.pageX - canvas.offsetLeft;
    const y = event.pageY - canvas.offsetTop;
    setDraws((prevState) => [...prevState, {x, y, color}]);

    drawCircle(x, y, color);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;

    const x = event.pageX - canvas.offsetLeft;
    const y = event.pageY - canvas.offsetTop;
    setDraws((prevState) => [...prevState, {x, y, color}]);

    drawCircle(x, y, color);
  };

  const handleMouseUp = () => {
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