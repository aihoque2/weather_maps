import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

/*
ZipCanvas.js
*/
export function ZipCanvas({ zipCodes, mode }) { // TODO: Mode
  const map = useMap();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const size = map.getSize();

      const topLeft = map.containerPointToLayerPoint([0,0]);

      canvas.width = size.x;
      canvas.height = size.y;
      
      /*
      Since this canvas is inside a Leaflet Pane,
      position the canvas itself using Leaflet's
      layer-coordinate system.
      */
      
      canvas.style.left = `${topLeft.x}px`;
      canvas.style.top = `${topLeft.y}px`;

      canvas.style.width = `${size.x}px`;
      canvas.style.height = `${size.y}px`;

      const ctx = canvas.getContext("2d");

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.fillStyle = "red";

      for (const zip of zipCodes) {
        if (
          typeof zip.lat !== "number" ||
          typeof zip.lon !== "number"
        ) {
          continue;
        }

        /*
        Convert this geographic location into
        Leaflet LAYER coordinates.
        */

        const layerPoint =
          map.latLngToLayerPoint([
            zip.lat,
            zip.lon
          ]);

        const x = layerPoint.x - topLeft.x;
        const y = layerPoint.y - topLeft.y;

        /*
        Don't bother drawing points
        outside the current viewport.
        */
        if (
          x < 0 ||
          y < 0 ||
          x > size.x ||
          y > size.y
        ) {
          continue;
        }

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          2,              // blot radius
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    };

    draw();

    /*
    Recalculate geographic positions after
    the user moves/zooms/resizes the map.
    */
    map.on("moveend", draw);
    map.on("zoomend", draw);
    map.on("resize", draw);

    return () => {
      map.off("moveend", draw);
      map.off("zoomend", draw);
      map.off("resize", draw);
    };

  }, [map, zipCodes]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        pointerEvents: "none",
      }}
    />
  );
}