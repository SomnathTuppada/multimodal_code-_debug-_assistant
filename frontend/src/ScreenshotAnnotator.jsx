import { Stage, Layer, Rect, Line } from "react-konva";
import { useRef, useState } from "react";

export default function ScreenshotAnnotator({ onExport }) {
  const stageRef = useRef(null);
  const [imageObj, setImageObj] = useState(null);
  const [lines, setLines] = useState([]);

  function handleUpload(e) {
    const file = e.target.files[0];
    const img = new Image();
    img.onload = () => setImageObj(img);
    img.src = URL.createObjectURL(file);
  }

  function handleDraw(e) {
    if (e.evt.buttons !== 1) return;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  }

  function exportImage() {
    const uri = stageRef.current.toDataURL();
    onExport(uri);
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />

      {imageObj && (
        <>
          <Stage
            width={imageObj.width}
            height={imageObj.height}
            ref={stageRef}
            onMouseMove={handleDraw}
          >
            <Layer>
              <Rect
                width={imageObj.width}
                height={imageObj.height}
                fillPatternImage={imageObj}
              />
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="red"
                  strokeWidth={3}
                  tension={0.5}
                />
              ))}
            </Layer>
          </Stage>

          <button onClick={exportImage}>Attach Screenshot</button>
        </>
      )}
    </div>
  );
}
