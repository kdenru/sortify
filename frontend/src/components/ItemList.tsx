import React, { useEffect, useRef } from 'react';
import { Table, Input } from 'antd';
import { useItemsStore } from '../store/itemsStore';
import styles from './ItemList.module.css';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableRow from './DraggableRow';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
];

const ItemList: React.FC = () => {
  const { items, loading, fetchItems, selectedIds, setSelectedIds, search, setSearch } = useItemsStore();
  const setItems = useItemsStore((s) => s.setItems);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchItems(value);
    }, 400);
  };

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedIds(selectedRowKeys as number[]);
    },
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
    }
  };

  return (
    <div className={styles.root}>
      <Input
        placeholder="Поиск..."
        value={search}
        onChange={onSearchChange}
        className={styles.input}
        allowClear
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <Table
            dataSource={items}
            columns={columns}
            rowKey="id"
            pagination={false}
            rowSelection={rowSelection}
            loading={loading}
            components={{ body: { row: DraggableRow } }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ItemList; 