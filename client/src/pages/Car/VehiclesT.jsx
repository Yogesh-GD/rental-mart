import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getVehicles } from '../../slices/vehicles/vehicleSlice';
import { CarCard } from '../../components/CarCard';
import Pagination from "../../components/Pagination"
import { useSearchParams } from 'react-router';


const VehiclesT = () => {
    const dispatch = useDispatch()
    const { vehicles, loading, error ,pagination} = useSelector((state) => state.vehicle)

    const [searchParams] = useSearchParams()
    let page = searchParams.get('page') || 1
    let limit = searchParams.get('limit') || 10
    let type = searchParams.get('type') || undefined

    useEffect(() => {
        dispatch(getVehicles(`page=${page}&limit=${limit}&${type ? "type="+type : "" }`))
    }, [page,limit])


    if (loading) return <p>Loading page...</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center mb-6">Vehicles</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {vehicles?.map((vehicle, index) => (
                    <CarCard key={index} vehicle={vehicle} />
                ))}
            </div>
            <div>
                {
                    pagination && 
                    <Pagination  page={pagination.page} limit={pagination.limit} totalPages={pagination.totalPages}/>
                }
            </div>
        </div>
    )
}

export default VehiclesT