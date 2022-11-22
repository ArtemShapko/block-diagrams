import React, { useRef, useState } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
// import { INITIAL_STATE, SIZE } from './data/dataOne';
import { Border } from './components/Boreder/Border';

let getId = 0;
const SIZE = 100;
function createConnectionPoints(source, destination) {
  return [source.x, source.y, destination.x, destination.y];
}

function hasIntersection(position, step) {
  return !(
    step.x > position.x ||
    step.x + SIZE < position.x ||
    step.y > position.y ||
    step.y + SIZE < position.y
  );
}

function detectConnection(position, id, steps) {
  const intersectingStep = Object.keys(steps).find((key) => {
    return key !== id && hasIntersection(position, steps[key]);
  });
  if (intersectingStep) {
    return intersectingStep;
  }
  return null;
}
const App = () => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [connectionPreview, setConnectionPreview] = useState(null);
  const [connections, setConnections] = useState([]);
  const [steps, setSteps] = useState([]);

  function handleSelection(id) {
    if (selectedStep === id) {
      setSelectedStep(null);
    } else {
      setSelectedStep(id);
    }
  }

  function handleStepDrag(e, key) {
    const position = e.target.position();
    setSteps({
      ...steps,
      [key]: {
        ...steps[key],
        ...position,
      },
    });
  }

  function handleAnchorDragStart(e) {
    const position = e.target.position();
    setConnectionPreview(
      <Line
        x={position.x}
        y={position.y}
        points={createConnectionPoints(position, position)}
        stroke="black"
        strokeWidth={2}
      />,
    );
  }

  function getMousePos(e) {
    const position = e.target.position();
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    return {
      x: pointerPosition.x - position.x,
      y: pointerPosition.y - position.y,
    };
  }

  function handleAnchorDragMove(e) {
    const position = e.target.position();
    const mousePos = getMousePos(e);
    setConnectionPreview(
      <Line
        x={position.x}
        y={position.y}
        points={createConnectionPoints({ x: 0, y: 0 }, mousePos)}
        stroke="black"
        strokeWidth={2}
      />,
    );
  }

  function handleAnchorDragEnd(e, id) {
    setConnectionPreview(null);
    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();
    const connectionTo = detectConnection(mousePos, id, steps);
    if (connectionTo !== null) {
      setConnections([
        ...connections,
        {
          to: connectionTo,
          from: id,
        },
      ]);
    }
  }

  const stepObjs = Object.keys(steps).map((key, i) => {
    const { x, y } = steps[key];
    return (
      <div
        id={i}
        // onClick={(e) => {
        //   // setSteps();
        //   // steps.filter((el) => {
        //   //   console.log('первое: ', el.id);
        //   //   console.log('второе', e.target.attrs.id);
        //   //   console.log('второе', e);
        //   //   return el.id - 1 != e.target.attrs.id;
        //   // }),
        // }}
      >
        <Rect
          id={i}
          strokeWidth={1}
          stroke="black"
          key={key}
          x={x}
          y={y}
          width={SIZE}
          height={SIZE}
          fill={'white'}
          onClick={() => handleSelection(key)}
          draggable
          onDragMove={(e) => handleStepDrag(e, key)}
          perfectDrawEnabled={false}
          // onMouseDown={(e) => {
          //   setSteps(deleteItem(e));
          // }}
        />
      </div>
    );
  });
  const connectionObjs = connections.map((connection) => {
    const fromStep = steps[connection.from];
    const toStep = steps[connection.to];
    const lineEnd = {
      x: toStep.x - fromStep.x,
      y: toStep.y - fromStep.y,
    };
    const points = createConnectionPoints({ x: 0, y: 0 }, lineEnd);
    return (
      <Line
        x={fromStep.x + SIZE / 2}
        y={fromStep.y + SIZE / 2}
        points={points}
        stroke="black"
        strokeWidth={2}
      />
    );
  });
  const borders =
    selectedStep !== null ? (
      <Border
        id={selectedStep}
        step={steps[selectedStep]}
        onAnchorDragEnd={(e) => handleAnchorDragEnd(e, selectedStep)}
        onAnchorDragMove={handleAnchorDragMove}
        onAnchorDragStart={handleAnchorDragStart}
      />
    ) : null;
  return (
    <div>
      <button
        onClick={() => {
          setSteps([
            ...steps,
            {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              id: ++getId,
            },
          ]);
        }}>
        Добавить элемент
      </button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {stepObjs}
          {borders}
          {connectionObjs}
          {connectionPreview}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
