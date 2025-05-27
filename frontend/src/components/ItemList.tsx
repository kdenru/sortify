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
  const { items, loading, fetchItems, selectedIds, setSelectedIds } = useItemsStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedIds(selectedRowKeys as number[]);
    },
  };

  if (loading) return <Spin />;

  return (
    <div>
      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        size="middle"
        pagination={false}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default ItemList; 