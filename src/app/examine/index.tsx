'use client'

import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, Pagination } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CustomLayout } from "@/components";
import Cookies from "next-cookies";
import {NextPageContext} from "next";

interface DataType {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume: string;
  number: string;
  pages: string;
  doi: string;
  status: number;
  createTime: string;
  updateTime: string;
}

const Examine: React.FC = () => {
  const [jsonData, setJsonData] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const data: DataType[] = jsonData
      .filter(item => item.status === 0)
      .map((item) => ({
        ...item,
        key: item._id,
      }));

  const fetchData = (page: number, pageSize: number) => {
    fetch(`/api/userSubmitOfStatus?page=${page}&limit=${pageSize}&status=0`,{cache: 'no-store'})
        .then(response => response.json())
        .then(data => {
          setJsonData(data.data);
          setPagination({
            ...pagination,
            current: data.meta.currentPage,
            total: data.meta.totalItems,
          });
        })
        .catch(error => console.error(error));
  };

  const rejectArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/userSubmit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 1 }),
      });

      if (response.ok) {
        console.log('Article rejected successfully');
        fetchData(pagination.current, pagination.pageSize); // Refresh the table data
      } else {
        console.log('Failed to reject article');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const passArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/userSubmit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 2 }),
      });

      if (response.ok) {
        console.log('userSubmit passed successfully');
        fetchData(pagination.current, pagination.pageSize); // Refresh the table data
      } else {
        console.log('Failed to pass userSubmit');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize); // Fetch initial data
  }, []);

  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    fetchData(page, newPageSize);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Authors',
      dataIndex: 'authors',
      key: 'authors',
    },
    {
      title: 'Journal',
      dataIndex: 'journal',
      key: 'journal',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
    },
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Pages',
      dataIndex: 'pages',
      key: 'pages',
    },
    {
      title: 'DOI',
      dataIndex: 'doi',
      key: 'doi',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
          <Space size="middle">
            <Button onClick={() => passArticle(record._id)}>Pass</Button>
            <Button danger onClick={() => rejectArticle(record._id)}>Reject</Button>
          </Space>
      ),
    },
  ];

  const cookies = Cookies({} as NextPageContext);
  let token = cookies['token']
  let _userInfoStr = cookies['userInfo']
  const role = cookies['role']
  return (
      <CustomLayout token={token} userInfo={_userInfoStr} needRole={1} realRole={role}>
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            style={{ padding: "100px" }}
        />
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}>
          <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={handlePageChange}
          />
        </div>
      </CustomLayout>
  );
};

export default Examine;