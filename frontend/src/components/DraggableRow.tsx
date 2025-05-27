import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableRow = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
  };
  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

export default DraggableRow; 