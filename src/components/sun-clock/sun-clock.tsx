import { FC, ReactElement, useEffect, useRef } from "react";
import { isContext } from "vm";
import { SunCalculator } from "../../model/sun-clculator";
import './sun-clock.scss';

class Coordinates {
    constructor(public x: number, public y: number) {}
}

const SunClock: FC = (): ReactElement => {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const dayBackgroundColor = "#99aaee";
    const nightBackgroundColor = "#101010";
  
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

        drawEverything(sunData, context);
    }, [])

    const drawEverything = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        drawSunPath(sunData, context);
        drawDarkAndLightDuration(sunData, context);
            
        context.globalCompositeOperation = "destination-out";
        clipAroundSun(sunData, context)
            
        context.globalCompositeOperation = "destination-over";
        drawSun(sunData, context);
        drawNightDaySquares(sunData, context);
    }

    const drawNightDaySquares = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        // Draw day
        var sunPathRadiusOffset = (context.canvas.height - getSunPathRadius(context) * 2) / 2;
        var dayLightHeight = getSunPathRadius(context) * 2 * sunData.getLightToDarkRatio() + sunPathRadiusOffset;
        context.fillStyle = dayBackgroundColor;
        context.fillRect(
            0, 0, 
            context.canvas.width, 
            dayLightHeight
        );
        
        // Draw night
        context.fillStyle = nightBackgroundColor;
        context.fillRect(
            0, 0, 
            context.canvas.width, 
            context.canvas.height
        );
    }

    const clipAroundSun = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        const sunPosition = getSunCenter(sunData, context);
        const sunSize = getSunSize(context);
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(sunPosition.x, sunPosition.y, sunSize * 1.3, 0, Math.PI*2);
        context.fill();
    }

    const getSunCenter = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        var sunPathRadius = getSunPathRadius(context);
        var dayRatioInRadians = sunData.getCurrentTimeInRatio() * Math.PI * 2 + Math.PI / 2;
        return new Coordinates(
            context.canvas.width / 2 + sunPathRadius *  Math.cos(dayRatioInRadians),
            context.canvas.width / 2 + sunPathRadius * Math.sin(dayRatioInRadians)
        );
    }

    const getSunSize = (context: CanvasRenderingContext2D) => {
        return context.canvas.width * 0.025;
    }

    const getSunPathRadius = (context: CanvasRenderingContext2D) => {
        var padding = context.canvas.width * 0.07;
        return context.canvas.width / 2 - padding;
    }

    const isCurrentlyDark = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        const sunCoordinates = getSunCenter(sunData, context);
        return sunCoordinates.y > context.canvas.height * sunData.getLightToDarkRatio();
    }

    const drawSun = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        const sunCoordinates = getSunCenter(sunData, context);
        context.beginPath();
        context.fillStyle = "#ffffaa";
        context.arc(
            sunCoordinates.x, 
            sunCoordinates.y, 
            getSunSize(context), 
            0, 
            Math.PI * 2,
        );
        context.fill();
    }

    const drawDarkAndLightDuration = (sunData: SunCalculator, context: CanvasRenderingContext2D) => {
        const darkLightOffsetCenter = (1 - sunData.getLightToDarkRatio()) * getSunPathRadius(context) * 2 - getSunPathRadius(context);
        const distanceFromPathFactor = 0.97;
        const dayAngleSize = Math.acos(darkLightOffsetCenter / getSunPathRadius(context) * 1 / distanceFromPathFactor);
        const distanceFromLineFactor = 1.04;

        context.globalAlpha = 0.5;
        context.strokeStyle = "#ffffff";
        context.lineCap = "round";
        context.lineWidth = context.canvas.width * 0.01;
            // Draw light path
            context.beginPath();
                context.arc(
                    context.canvas.width / 2, 
                    context.canvas.width / 2, 
                    getSunPathRadius(context) * distanceFromPathFactor, 
                    -dayAngleSize - Math.PI / 2 * (1 / distanceFromLineFactor), 
                    dayAngleSize - Math.PI / 2 * distanceFromLineFactor,
                );
            context.stroke();

            // Draw dark path
            context.beginPath();
                context.arc(
                    context.canvas.width / 2, 
                    context.canvas.width / 2, 
                    getSunPathRadius(context) * distanceFromPathFactor, 
                    dayAngleSize - Math.PI / 2 * (1 / distanceFromLineFactor), 
                    -dayAngleSize - Math.PI / 2 * distanceFromLineFactor,
            );
            context.stroke();
        context.globalAlpha = 1;

        const textDistance = getSunPathRadius(context) * 0.2;
        const lightTextCoords = new Coordinates(context.canvas.width / 2, context.canvas.width / 2 - getSunPathRadius(context) + textDistance);
        drawText("Light - " + sunData.getLightTimeInText(), context, lightTextCoords)
        context.globalAlpha = 0.5;
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(lightTextCoords.x, context.canvas.width / 2 - getSunPathRadius(context) + textDistance * 0.3);
        context.lineTo(lightTextCoords.x, context.canvas.width / 2 - getSunPathRadius(context) + textDistance * 0.75);
        context.stroke();
        context.globalAlpha = 1;
        
    }

    const drawText = (text: string, context: CanvasRenderingContext2D, pos: Coordinates, color: string = "#ffffff", fontSize: number = 1) => {
        context.fillStyle = "#ffffff";
        context.font = Math.round(context.canvas.height * 0.02 * fontSize) + "px Staatliches";
        context.textAlign ="center";
        context.fillText(text, pos.x, pos.y);
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