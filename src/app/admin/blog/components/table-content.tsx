'use client'

import useAxios from "@/hooks/useFetchAxios"
import { BlogPost, BlogResponse } from "@/types/blog";
import { Table, TableProps } from "antd";

export const TableContent = () => {
    const {response: blogView, error: blogError, loading: blogLoading} = useAxios<BlogResponse>(
    {
        url: 'https://api-mnyt.purintech.id.vn/api/BlogPosts/all',
        method: 'get'
    });
    
    console.log("blog list ", blogView?.data);
    const columns: TableProps<BlogPost>['columns'] = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Author',
            dataIndex: 'authorName',
            key: 'authorName'
        },
        {
            title: 'Period',
            dataIndex: 'period',
            key: 'period'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Published Date',
            dataIndex: 'publishedDay',
            key: 'publishedDay'
        },
        {
            title: 'Likes',
            dataIndex: 'likeCount',
            key: 'likeCount'
        },
        {
            title: 'Comments',
            dataIndex: 'commentCount',
            key: 'commentCount'
        }
    ]
    
    return (
        <Table<BlogPost> columns={columns} dataSource={blogView?.data}/>
    );
}

export default TableContent; 