import React, { useEffect, useState } from 'react'
import axios from 'axios'
import jwt_decode from "jwt-decode";
const ViewData = () => {
    const [data, setData] = useState()
    const decoded = jwt_decode(localStorage.getItem('Token'));
    useEffect(() => {
        axios.get('https://aerothonbackend-production.up.railway.app/api/fabrication', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('Token')
            },
        })
            .then((res) => setData(res.data))
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Item
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                StartDate
                            </th>
                            <th scope="col" className="px-6 py-3">
                                EndDate
                            </th>
                            {decoded?.roles[0] === 'ADMIN' &&

                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            }
                        </tr>
                    </thead>
                    <tbody>

                        {data?.map(itm => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {itm?.item}
                                </th>
                                <td className="px-6 py-4">
                                    {itm?.quantity}
                                </td>
                                <td className="px-6 py-4">
                                    {itm?.startDate?.substring(0, 10)}
                                </td>
                                <td className="px-6 py-4">
                                    {itm?.endDate?.substring(0, 10)}
                                </td>
                                {decoded?.roles[0] === 'ADMIN' &&
                                    <td className="px-6 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" value="" className="sr-only peer"/>
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
                                        </label>

                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ViewData