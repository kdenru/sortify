import React, { useEffect, useRef, useCallback } from 'react';
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

interface ItemListProps {
  disableVirtual?: boolean;
}

const ItemList: React.FC<ItemListProps> = (props) => {
  const { disableVirtual } = props;
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

  const reorderItems = (items: { id: number; value: any; selected?: boolean }[], oldIndex: number, newIndex: number) => {
    const updated = [...items];
    const [removed] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, removed);
    return updated;
  };

  const handleDragEnd = useCallback(async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      // Оптимистик апдейт
      const prevItems = items;
      const newItems = reorderItems(items, oldIndex, newIndex);
      useItemsStore.setState({ items: newItems });

      try {
        const movedId = items[oldIndex].id;
        let beforeId: number | null;
        if (oldIndex < newIndex) {
          beforeId = items[newIndex + 1]?.id ?? null;
        } else {
          beforeId = items[newIndex].id;
        }
        await fetch('/items/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movedId, beforeId }),
        });
        // Не делаем fetchItems, оставляем оптимистик порядок
      } catch (e) {
        // Откат если ошибка
        useItemsStore.setState({ items: prevItems });
        // Можно показать ошибку, если надо
      }
    }
  }, [items]);

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
            scroll={{ y: 830, x: 10 }}
            onScroll={handleTableScroll}
            {...(!disableVirtual ? { virtual: true, components: { body: { row: DraggableRow } } } : {})}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ItemList; 