import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuOutlined } from '@ant-design/icons';

const DraggableRow = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : 1,
  };

  // Клонируем детей, чтобы добавить drag handle во вторую ячейку (если есть)
  const children = React.Children.toArray(props.children);
  // Если есть хотя бы две ячейки, вставляем drag handle во вторую
  if (children.length > 1) {
    const secondTd = children[1] as React.ReactElement<any>;
    children[1] = React.cloneElement(secondTd, {
      style: { ...(secondTd.props.style || {}), display: 'flex', alignItems: 'center', gap: 8 },
      children: [
        <MenuOutlined
          key="drag-icon"
          style={{ cursor: 'grab', color: '#999' }}
          {...attributes}
          {...listeners}
        />,
        secondTd.props.children,
      ],
    });
  }

  return (
    <tr {...props} ref={setNodeRef} style={style}>
      {children}
    </tr>
  );
};

export default React.memo(DraggableRow); 