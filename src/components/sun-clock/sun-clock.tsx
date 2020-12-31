import { FC, ReactElement, useEffect, useRef } from "react";
import { isContext } from "vm";
import { SunCalculator } from "../../model/sun-clculator";
import './sun-clock.scss';

class Coordinates {
    constructor(public x: number, public y: number) {}
}

const SunClock: FC = (): ReactElement => {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const dayBackgroundColor = "#aaccff";
    const nightBackgroundColor = "#252525";
  
    useEffect(() => {
        var sunData = new SunCalculator(new Date(), 62.333, 18.067);
        console.log(sunData.daylightHours);

        const canvas = canvasRef.current;
        if (canvas == null)
            return;

        canvas.width = window.innerHeight * 2;
        canvas.height = window.innerHeight * 2;

        const context = canvas.getContext('2d');
        if (context == null)
            return;

        drawNightDaySquares(sunData, context);
        drawSunPath(sunData, context);
        drawSun(sunData, context);
    }, [])

    const drawNightDaySquares = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        // Draw day
        var dayLightHeight = context.canvas.height * sunData.getLightToDarkRatio();
        context.fillStyle = dayBackgroundColor;
        context.fillRect(
            0, 0, 
            context.canvas.width, 
            dayLightHeight
        );
        
        // Draw night
        context.fillStyle = nightBackgroundColor;
        context.fillRect(
            0, dayLightHeight, 
            context.canvas.width, 
            context.canvas.height * (1 - sunData.getLightToDarkRatio())
        );
    }

    const getSunPathRadius = (context: CanvasRenderingContext2D) => {
        var padding = context.canvas.width * 0.07;
        return context.canvas.width / 2 - padding;
    }

    const drawSun = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        context.beginPath();
        console.log(sunData.getCurrentTimeInRatio());
        var dayRatioInRadians = sunData.getCurrentTimeInRatio() * Math.PI * 2 + Math.PI / 2;
        var xPos = context.canvas.width / 2 + getSunPathRadius(context) *  Math.cos(dayRatioInRadians);
        var yPos = context.canvas.width / 2 + getSunPathRadius(context) * Math.sin(dayRatioInRadians);
        context.fillStyle = "#ffff00";
        context.arc(
            xPos, 
            yPos, 
            50, 
            0, 
            Math.PI * 2);
        context.fill();
    }

    const drawSunPath = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(
            context.canvas.width / 2, 
            context.canvas.width / 2, 
            getSunPathRadius(context), 
            0, 
            Math.PI * 2);
        context.stroke();
    }
    
    return (
      <div className="sun-clock">
          <canvas className="sun-clock__canvas" width="100%" height="100%" ref={canvasRef}/>
      </div>
    )
};
export default SunClock;