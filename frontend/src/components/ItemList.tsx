import React, { useEffect } from 'react';
import { Table, Spin } from 'antd';
import { useItemsStore } from '../store/itemsStore';

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
  const { items, loading, fetchItems } = useItemsStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) return <Spin />;

  return (
    <div>
      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        size="middle"
        pagination={false}
      />
    </div>
  );
};

export default ItemList; 