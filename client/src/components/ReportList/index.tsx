import React from 'react';
import { Button, Layout, List, PageHeader, Popconfirm, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useInfiniteQuery } from 'react-query';
import { toast } from 'react-toastify';

import { getPrimaryReports } from '../../api/reports';
import AddModal from './AddModal';
import './index.css';

import type { Report } from '../../types/global';

interface ReportListProps {}

const ReportList: React.FC<ReportListProps> = () => {
    const navigate = useNavigate();
    const [authToken] = useLocalStorage('AUTH_TOKEN', '');

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isError } =
        useInfiniteQuery(['reports', { authToken }], getPrimaryReports, {
            enabled: !!authToken,
            getNextPageParam: (lastpage) => lastpage.nextPage,
            refetchOnWindowFocus: false,
        });

    const reports = data?.pages.flatMap(({ reports }: any) => [...reports]);

    const onLoadMore = () => {
        fetchNextPage();
    };

    const onView = (report: Report) => {
        navigate(`/reports/${report.id}`);
    };

    const loadMore = (
        <div className="report-list-load-more">
            <Button onClick={onLoadMore}>
                {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                    ? 'Load More'
                    : 'Nothing more to load'}
            </Button>
        </div>
    );

    const extras = [<AddModal key="1" />];

    if (isError) {
        toast.error(`${error}`, { containerId: 'global-toast' });
    }

    return (
        <Layout>
            <PageHeader title={'Reports'} extra={extras}></PageHeader>
            <Spin size="large" spinning={isFetching}>
                <List
                    itemLayout="horizontal"
                    className="report-list-list"
                    loadMore={loadMore}
                    dataSource={reports}
                    renderItem={(item) => (
                        <List.Item actions={[<Button onClick={() => onView(item)}>View</Button>]}>
                            <List.Item.Meta
                                title={<a onClick={() => onView(item)}>{item.title}</a>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Spin>
        </Layout>
    );
};

export default ReportList;
