"use client";
import React, { useState, useEffect } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { HomeOutlined, DashboardOutlined, CloudUploadOutlined } from "@ant-design/icons";

import { Button, Layout, Menu, theme } from "antd";
import { useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const router = useRouter();

    useEffect(() => {
        const stringLoginData = localStorage.getItem("loginData");
        if (stringLoginData) {
            const loginData = JSON.parse(stringLoginData);
            if (!loginData.isAuthenticated) {
                router.push("/login"); // Redirect to login if not authenticated
            }
        } else {
            router.push("/login"); // Redirect to login if no login data
        }
    }, [router]);

    // Logout function
    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem("loginData"); // Or sessionStorage.removeItem("loginData")
        // Redirect to login page
        router.push("/login");
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <HomeOutlined />,
                            label: "Home",
                            onClick: () => router.push("/home"),
                        },
                        {
                            key: "2",
                            icon: <DashboardOutlined />,
                            label: "Dashboard",
                            onClick: () => router.push("/dashboard"),
                        },
                        {
                            key: "3",
                            icon: <UserOutlined />,
                            label: "Account",
                            onClick: () => router.push("/account"),
                        },
                        {
                            key: "4",
                            icon: <CloudUploadOutlined />,
                            label: "Issue Certificate",
                            onClick: () => router.push("/issuecert"),
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                    {/* Logout Button */}
                    <Button
                        type="primary"
                        icon={<UserOutlined />}
                        onClick={handleLogout}
                        style={{ marginRight: "16px" }}
                    >
                        Logout
                    </Button>
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
