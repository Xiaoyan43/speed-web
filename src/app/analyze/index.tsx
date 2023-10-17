'use client'
import { useState, useEffect } from 'react';
import { Button, Form, Input, List, Modal, Pagination } from 'antd';
import { CustomLayout } from '@/components';
import Cookies from "next-cookies";
import {NextPageContext} from "next";

interface Article {
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
        </CustomLayout>
    );
};

export default Analyze;