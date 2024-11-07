
import React from 'react'
import { DashboardInfo } from './dashboardInfo'


export const Dashboard = () => {


    return (
        <div className='border-r-[2px] border-slate-400/20 h-screen max-h-screen'>
            <div className='border-b-[1px] border-slate-400/20 pb-10'>
                <DashboardInfo/>
            </div>
            <div className='overflow-y-scroll'>

            </div>
        </div>
    )
}
