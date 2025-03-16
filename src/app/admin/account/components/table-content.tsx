'use client'

import useAxios from "@/hooks/useFetchAxios"
import { AccountView } from "@/types/accountsView"

export const TableContent: React.FC =() =>
{
    const {response: accountView, error: accountError, loading: accountLoading} = useAxios<AccountView[]>(
        {
            url: 'https://api-mnyt.purintech.id.vn/api/Accounts',
            method: 'get'
        });
        console.log("account data:"+accountView);
    return (
        <h1>Table Content</h1>
    );
}
export default TableContent;