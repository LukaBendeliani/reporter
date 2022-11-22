import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

import type { MenuClickEventHandler } from 'rc-menu/lib/interface';

const { Sider } = Layout;

type MenuItem = {
    label: string;
    key: string | number;
    children?: MenuItems;
};

type MenuItems = MenuItem[];

interface SidebarProps {
    menuItems: MenuItems;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
    const navigate = useNavigate();

    const handleMenuItemClick: MenuClickEventHandler = ({ key }) => {
        navigate(`/${key}`);
    };

    return (
        <Sider>
            <Menu theme="dark" mode="inline" onClick={handleMenuItemClick} items={menuItems} />
        </Sider>
    );
};

export default Sidebar;
