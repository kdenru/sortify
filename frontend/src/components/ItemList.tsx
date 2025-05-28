import React, { useEffect, useRef, useCallback } from 'react';
import { Table, Input, Spin } from 'antd';
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
  const {
    items,
    loading,
    fetchItems,
    fetchMore,
    hasMore,
    setSelectedIds,
    search,
    setSearch,
  } = useItemsStore();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const selectedIds = items.filter(i => i.selected).map(i => i.id);

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

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const sensors = useSensors(pointerSensor);

  const handleDragEnd = useCallback(async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      // movedId — id перетаскиваемого
      const movedId = items[oldIndex].id;
      let beforeId: number | null;
      if (oldIndex < newIndex) {
        // Двигаем вниз — вставляем после newIndex, значит beforeId следующий элемент
        beforeId = items[newIndex + 1]?.id ?? null;
      } else {
        // Двигаем вверх — вставляем перед newIndex
        beforeId = items[newIndex].id;
      }
      await fetch('/items/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movedId, beforeId }),
      });
      fetchItems(search); // обновляем список
    }
  }, [items, fetchItems, search]);

  // Подгрузка данных при скролле вниз
  const handleTableScroll = (e: any) => {
    if (!e || !e.currentTarget) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 200 && !loading && hasMore) {
      fetchMore();
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
            loading={loading && items.length === 0}
            components={{ body: { row: DraggableRow } }}
            virtual
            scroll={{ y: 1000, x: 10 }}
            onScroll={handleTableScroll}
          />
        </SortableContext>
      </DndContext>
      {loading && items.length > 0 && (
        <div style={{ textAlign: 'center', padding: 16 }}><Spin /></div>
      )}
    </div>
  );
};

export default ItemList; 