import React from 'react';
import { Line } from 'react-konva';
import { SIZE } from '../../data/dataOne';
import { Anchor } from '../Anchor/Anchor';

const points = [0, 0, SIZE, 0, SIZE, SIZE, 0, SIZE, 0, 0];

function getAnchorPoints(x, y) {
  const halfSize = SIZE / 2;
  return [
    {
      x: x - 6,
      y: y + halfSize,
      id: 0,
    },
    {
      x: x + halfSize,
      y: y - 6,
      id: 1,
    },
    {
      x: x + SIZE + 6,
      y: y + halfSize,
      id: 2,
    },
    {
      x: x + halfSize,
      y: y + SIZE + 6,
      id: 3,
    },
  ];
}

export function Border({ step, id, onAnchorDragStart, onAnchorDragMove, onAnchorDragEnd }) {
  const { x, y } = step;
  const anchorPoints = getAnchorPoints(x, y);
  const anchors = anchorPoints.map((position, index) => (
    <Anchor
      key={`anchor-${index}`}
      id={id}
      x={position.x}
      y={position.y}
      onDragStart={onAnchorDragStart}
      onDragMove={onAnchorDragMove}
      onDragEnd={onAnchorDragEnd}
    />
  ));
  return (
    <>
      <Line x={x} y={y} points={points} stroke="black" strokeWidth={2} perfectDrawEnabled={false} />
      {anchors}
    </>
  );
}
