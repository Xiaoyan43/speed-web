'use client'

import React, { useEffect, useState } from 'react';
import {Space, Table, Tag, Button, Pagination, Modal, Form, Input} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CustomLayout } from "@/components";
import axios from "axios";
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

const HomePage: React.FC = () => {
    const [jsonData, setJsonData] = useState<DataType[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const data: DataType[] = jsonData
        .filter(item => item.status === 2)
        .map((item) => ({
            ...item,
            key: item._id,
        }));

    const fetchData = (page: number, pageSize: number) => {
        fetch(`/api/userSubmitOfStatus?page=${page}&limit=${pageSize}&status=2`,{cache: 'no-store'})
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

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize); // Fetch initial data
    }, []);

    const handlePageChange = (page: number, pageSize?: number) => {
        const newPageSize = pageSize || pagination.pageSize;
        fetchData(page, newPageSize);
    };

    const [showForm, setShowForm] = useState(false);
    const [form] = Form.useForm();
    const [validateRequired, setValidateRequired] = useState(true);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleSubmit = async (values: any) => {
        try {
            await axios.post('api/userSubmit', values);
            form.resetFields();
            toggleForm();
            fetchData(pagination.current, pagination.pageSize); // Refresh data after submission
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleValidation = () => {
        setValidateRequired(!validateRequired);
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
    ];

    const cookies = Cookies({} as NextPageContext);
    let token = cookies['token']
    let _userInfoStr = cookies['userInfo']
    return (
        <CustomLayout token={token} userInfo={_userInfoStr}>
            <div style={{ textAlign: 'right', marginTop: '30px', marginRight: "100px"}}>
                <Button type="primary" onClick={toggleForm}>
                    Add Article
                </Button>
            </div>
            <Modal
                visible={showForm}
                title="Add Article"
                onCancel={toggleForm}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} validateTrigger="onSubmit">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: validateRequired,
                                message: 'Please enter the title',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="authors"
                        label="Authors"
                        rules={[
                            {
                                required: validateRequired,
                                message: 'Please enter the authors',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="journal"
                        label="Journal"
                        rules={[
                            {
                                required: validateRequired,
                                message: 'Please enter the journal',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="year"
                        label="Publication Year"
                        rules={[
                            {
                                required: validateRequired,
                                message: 'Please enter the publication year',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="volume"
                        label="Volume"
                        rules={[
                            {
                                required: validateRequired,
                                message: 'Please enter the volume',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="number"
                        label="Issue"
                        rules={[
                            {
                                required: validateRequired,
                                message: 'Please enter the issue',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="pages"
                        label="Pages"
                        rules={[
                            {
                                required: validateRequired,
                                message: 'Please enter the pages',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="doi"
                        label="DOI"
                        rules={[
                            {
                                required: validateRequired,
                                message: 'Please enter the DOI',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                style={{ marginLeft: "100px", marginRight: "100px", marginTop: "30px"}}
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

export default HomePage;