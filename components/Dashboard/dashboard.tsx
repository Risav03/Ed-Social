
import React from 'react'
import { DashboardInfo } from './dashboardInfo'
import { PostFetcher } from '../Posts/postFetcher'


export const Dashboard = () => {

    return (
        <div className=' h-screen max-h-screen'>
            <div className='border-b-[1px] w-full border-slate-400/20 pb-10'>
                <DashboardInfo/>
            </div>
            <div className='overflow-y-scroll'>
                <PostFetcher/>
            </div>
        </div>
    )
}
