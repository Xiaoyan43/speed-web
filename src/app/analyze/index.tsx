'use client'
import { useState, useEffect } from 'react';
import {Button, Form, Input, List, message, Modal, Pagination} from 'antd';
import { CustomLayout } from '@/components';
import Cookies from "next-cookies";
import { NextPageContext } from "next";
import axios from "axios";

interface Article {
    _id: string;
    title: string;
    authors: string;
    journal: string;
    year: string;
    volume: string;
    number: string;
    pages: string;
    doi: string;
}

const Analyze = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({
        claim: '',
        resultOfEvidence: '',
        type: '',
        participant: '',
    });
    const [selectedId, setSelectedId] = useState<string>('');
    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await fetch(`/api/userSubmitOfStatus?page=${page}&limit=${pageSize}&status=2`);
            const data = await response.json();
            setArticles(data.data);
            setPagination({
                ...pagination,
                current: data.meta.currentPage,
                total: data.meta.totalItems,
            });
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

    const handleFormSubmit = async () => {
        try {
            const response = await fetch(`/api/analyze/${selectedId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });

            if (response.ok) {
                setFormValues({
                    claim: '',
                    resultOfEvidence: '',
                    type: '',
                    participant: '',
                });
                setShowForm(false)
                fetchData(pagination.current, pagination.pageSize); // Refresh the table data
            } else {
                message.error("submit failed");
                console.log('Failed to pass userSubmit');
            }
        } catch (error) {
            setFormValues({
                claim: '',
                resultOfEvidence: '',
                type: '',
                participant: '',
            });
            setShowForm(false)
            message.error("submit failed");
        }
    }

    const handleCancel = () => {
        setFormValues({
            claim: '',
            resultOfEvidence: '',
            type: '',
            participant: '',
        });
        setShowForm(false);
    };

    const cookies = Cookies({} as NextPageContext);
    let token = cookies['token']
    let _userInfoStr = cookies['userInfo']
    const role = cookies['role']
    return (
        <CustomLayout token={token} userInfo={_userInfoStr} needRole={2} realRole={role}>
            <div style={{ padding: '100px' }}>
                <List
                    dataSource={articles}
                    renderItem={(item: Article) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.title}
                                description={`${item.authors} - ${item.year}`}
                            />
                            <div>
                                Journal: {item.journal} | Volume: {item.volume} | Issue: {item.number} | Pages: {item.pages} | DOI: {item.doi}
                            </div>
                            <span style={{ marginLeft: '30px' }}></span>
                            <Button danger onClick={() => {
                                setSelectedId(item._id);
                                setShowForm(true);
                            }}>Analyze</Button>
                        </List.Item>
                    )}
                />
                <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}>
                    <Pagination
                        current={pagination.current}
                        total={pagination.total}
                        pageSize={pagination.pageSize}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            {showForm && (
                <Modal
                    title="Analyze Article"
                    visible={showForm}
                    onCancel={handleCancel}
                    onOk={handleFormSubmit}
                    okText="OK"
                    cancelText="Cancel"
                >
                    <Form>
                        <Form.Item label="Claim">
                            <Input
                                value={formValues.claim}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, claim: e.target.value })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Result of Evidence">
                            <Input
                                value={formValues.resultOfEvidence}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, resultOfEvidence: e.target.value })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Type">
                            <Input
                                value={formValues.type}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, type: e.target.value })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Participant">
                            <Input
                                value={formValues.participant}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, participant: e.target.value })
                                }
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </CustomLayout>
    );
};

export default Analyze;