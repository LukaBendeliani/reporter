import React from 'react';
import { Layout } from 'antd';

import { ReportList } from '../../components';
import { useProfileGuard } from '../../hooks/usePorfileGuard';

import './index.css';

const Home: React.FC = () => {
    useProfileGuard();

    return (
        <Layout className="site-layout" style={{ minHeight: '100vh' }}>
            <ReportList />
        </Layout>
    );
};

export default Home;
