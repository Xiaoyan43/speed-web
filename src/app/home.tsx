'use client'

import React, {useEffect, useState} from 'react';
import {Space, Table, Tag, Button, Pagination, Modal, Form, Input, Dropdown, Menu, Checkbox, Rate, message} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {CustomLayout} from "@/components";
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
    claim: string,
    resultOfEvidence: string,
    type: string,
    participant: string,
    rating: string
}

const HomePage: React.FC = () => {
    const [jsonData, setJsonData] = useState<DataType[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [selectedColumns, setSelectedColumns] = useState<string[]>([
        'title',
        'authors',
        'journal',
        'year',
        'volume',
        'number',
        'pages',
        'doi',
        'claim',
        'resultOfEvidence',
        'type',
        'participant',
        'rating'
    ]);

    const data: DataType[] = jsonData
        .filter((item) => item.status === 3)
        .map((item) => ({
            ...item,
            key: item._id,
        }));

    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const fetchData = (page: number, pageSize: number) => {
        fetch(`/api/userSubmitOfStatus?page=${page}&limit=${pageSize}&status=3`, {cache: 'no-store'})
            .then((response) => response.json())
            .then((data) => {
                setJsonData(data.data);
                setPagination({
                    ...pagination,
                    current: data.meta.currentPage,
                    total: data.meta.totalItems,
                });
            })
            .catch((error) => console.error(error));
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
            try {
                const response = await axios.post('api/userSubmit', values);
                if (response.status === 200) {
                    message.success('User submitted successfully.');
                } else {
                    message.error('User submission failed.');
                }
            } catch (error) {
                message.error('An error occurred while submitting the user.');
            }
            toggleForm();
            fetchData(pagination.current, pagination.pageSize); // Refresh data after submission
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleValidation = () => {
        setValidateRequired(!validateRequired);
    };

    const handleColumnSelect = (selectedColumn: string) => {
        const updatedColumns = selectedColumns.includes(selectedColumn)
            ? selectedColumns.filter((column) => column !== selectedColumn)
            : [...selectedColumns, selectedColumn];
        setSelectedColumns(updatedColumns);
    };

    const columns: ColumnsType<DataType> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => <a onClick={() => showRatingModal(record)}>{text}</a>,
        },
        {
            title: 'Authors',
            dataIndex: 'authors',
            key: 'authors',
            filters: [
                {text: 'John', value: 'John'},
                {text: 'Jane', value: 'Jane'},
                // Add more filter options
            ],
            onFilter: (value, record) => record.authors.includes(value),
        },
        {
            title: 'Journal',
            dataIndex: 'journal',
            key: 'journal',
            sorter: (a, b) => a.journal.localeCompare(b.journal),
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            sorter: (a, b) => a.year.localeCompare(b.year),
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            sorter: (a, b) => a.volume.localeCompare(b.volume),
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
            title: 'CLAIM',
            dataIndex: 'claim',
            key: 'claim',
            sorter: (a, b) => a.claim.localeCompare(b.claim),
        },
        {
            title: 'RESULT OF EVIDENCE',
            dataIndex: 'resultOfEvidence',
            key: 'resultOfEvidence',
            sorter: (a, b) => a.resultOfEvidence.localeCompare(b.resultOfEvidence),
        },
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
            title: 'PARTICIPANT',
            dataIndex: 'participant',
            key: 'participant',
            sorter: (a, b) => a.participant.localeCompare(b.participant),
        },
        {
            title: 'RATING',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a, b) => a.rating.localeCompare(b.rating),
            render: (rating) => <Rate disabled defaultValue={rating} />,
        }
    ];

    const cookies = Cookies({} as NextPageContext);
    let token = cookies['token'];
    let _userInfoStr = cookies['userInfo'];
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DataType | null>(null);
    const [rating, setRating] = useState(0);

    const showRatingModal = (item: DataType) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleRatingChange = (value: number) => {
        setRating(value);
    };

    const handleRatingSubmit = () => {
        // Perform rating submission logic here, e.g., send rating to the server
        console.log(`Rating for item with ID ${selectedItem?._id}: ${rating}`);
        setShowModal(false);
        handleSubmitRating();
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        searchAPI(value);
    };

    const searchAPI = (keyword: string) => {
        const apiUrl = `/api/userSubmit/search?query=${encodeURIComponent(keyword)}`;

        axios.get(apiUrl)
            .then((response) => {
                const data = response.data;
                setJsonData(data.data);
                setPagination({
                    ...pagination,
                    current: data.meta.currentPage,
                    total: data.meta.totalItems,
                });
                console.log(response.data);
            })
            .catch((error) => {
                // Handle errors
                if (error.response) {
                    // Request was made and server responded with an error response
                    const status = error.response.status;
                    if (status === 400) {
                        message.error('Bad Request: Invalid search query.');
                    } else if (status === 404) {
                        message.error('Not Found: Search endpoint not found.');
                    } else {
                        message.error('An error occurred while searching.');
                    }
                } else if (error.request) {
                    // Request was made but no response was received
                    message.error('No response received from the server.');
                } else {
                    // Error occurred while setting up the request
                    message.error('An error occurred while making the request.');
                }
            });
    };

    const handleSubmitRating = async () => {
        try {
            // Send the rating to the server
            const response = await axios.post("/api/rateItem", {
                userSubmitId: selectedItem?._id,
                rating: rating,
            });
            console.log('response', response)
            // Check the response status and display a success or failure message
            if (response.status == 200) {
                // The rating was submitted successfully
                setShowModal(false);
                message.success("Rating submitted successfully");
                fetchData(pagination.current, pagination.pageSize); // Fetch initial data
            } else {
                // There was an error submitting the rating
                message.error("Failed to submit rating");
            }
        } catch (error) {
            console.error(error);
            message.error("Failed to submit rating");
        }
    };

    return (
        <CustomLayout token={token} userInfo={_userInfoStr}>
            <Modal
                title={`Rate "${selectedItem?.title}"`}
                visible={showModal}
                onCancel={() => setShowModal(false)}
                onOk={handleRatingSubmit}
            >
                <div>
                    <p>Please rate this item:</p>
                    <Rate value={rating} onChange={handleRatingChange} />
                </div>
            </Modal>
            <div style={{textAlign: 'right', marginTop: '30px', marginRight: '100px'}}>
                <Input.Search
                    placeholder="Search"
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 200 }}
                />
                <span style={{marginLeft: "20px"}}></span>
                <Dropdown
                    overlay={
                        <Menu>
                            {columns.map((column ) => (
                                <Menu.Item key={column.key}>
                                    <Checkbox
                                        checked={selectedColumns.includes(column.key)}
                                        onChange={() => handleColumnSelect(column.key)}>
                                        {column.title}
                                    </Checkbox>
                                </Menu.Item>
                            ))}
                        </Menu>
                    }
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button>Select Columns</Button>
                </Dropdown>
                <span style={{marginLeft: "20px"}}></span>
                <Button type="primary" onClick={toggleForm}>
                    Add Article
                </Button>
            </div>
            <Modal visible={showForm} onCancel={toggleForm} footer={null}>
                <Form form={form} onFinish={handleSubmit} style={{marginTop: "30px"}}>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{required: validateRequired, message: 'Please enter the title.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Authors"
                        name="authors"
                        rules={[{required: validateRequired, message: 'Please enter the authors.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Journal"
                        name="journal"
                        rules={[{required: validateRequired, message: 'Please enter the journal.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Year"
                        name="year"
                        rules={[{required: validateRequired, message: 'Please enter the year.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Volume"
                        name="volume"
                        rules={[{required: validateRequired, message: 'Please enter the volume.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Number"
                        name="number"
                        rules={[{required: validateRequired, message: 'Please enter the number.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Pages"
                        name="pages"
                        rules={[{required: validateRequired, message: 'Please enter the pages.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="DOI"
                        name="doi"
                        rules={[{required: validateRequired, message: 'Please enter the DOI.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="EMAIL"
                        name="email"
                        rules={[{required: validateRequired, message: 'Please enter the EMAIL.'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div style={{marginLeft: '100px', marginRight: '100px', marginTop: '30px'}}>
                <Table
                    columns={columns.filter((column) => selectedColumns.includes(column.key as string))}
                    dataSource={data}
                    pagination={false}
                />
                <div style={{position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)'}}>
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </CustomLayout>
    );
};

export default HomePage;