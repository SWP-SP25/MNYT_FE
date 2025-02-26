'use client'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

const AppSidebar = () => {
    return (
        <Sidebar>
            <Menu>
                <MenuItem> Dashboard </MenuItem>
                <SubMenu label="Products">
                    <MenuItem> List </MenuItem>
                    <MenuItem> Create </MenuItem>
                </SubMenu>
                <MenuItem> Orders </MenuItem>
            </Menu>
        </Sidebar>
    );
};
export default AppSidebar;