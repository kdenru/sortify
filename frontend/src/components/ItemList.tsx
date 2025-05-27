import React, { useEffect, useRef } from 'react';
import { Table, Input } from 'antd';
import { useItemsStore } from '../store/itemsStore';
import styles from './ItemList.module.css';

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

  return (
    <div>
      <Input
        placeholder="Поиск..."
        value={search}
        onChange={onSearchChange}
        className={styles.input}
        allowClear
      />
      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        pagination={false}
        rowSelection={rowSelection}
        loading={loading}
      />
    </div>
  );
};

export default ItemList; 