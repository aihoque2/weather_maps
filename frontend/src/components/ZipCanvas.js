import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

/*
ZipCanvas.js
*/
export function ZipCanvas({ zipCodes }) {
  const map = useMap();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const size = map.getSize();

      canvas.width = size.x;
      canvas.height = size.y;

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

        const point =
          map.latLngToContainerPoint([
            zip.lat,
            zip.lon
          ]);

        /*
        Don't bother drawing points
        outside the current viewport.
        */
        if (
          point.x < 0 ||
          point.y < 0 ||
          point.x > size.x ||
          point.y > size.y
        ) {
          continue;
        }

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
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
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 350
      }}
    />
  );
}