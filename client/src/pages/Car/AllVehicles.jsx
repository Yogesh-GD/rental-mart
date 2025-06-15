import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVehicles } from "../../slices/vehicles/vehicleSlice";
import { CarCard } from "../../components/CarCard";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import SpinningCirclesLoader from "../../components/SpinningCirclesLoader";

const AllVehicles = () => {
  const dispatch = useDispatch();
  const { vehicles, loading, error, pagination } = useSelector((state) => state.vehicle);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  useEffect(() => {
    dispatch(getVehicles(`page=${page}&limit=${limit}`));
  }, [dispatch, page, limit]);

  if (loading) return <SpinningCirclesLoader />;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto">
      <Header img={"./car1.jpg"}>
        <div className="px-3 sm:px-20">
          <h1 className="text-5xl sm:text-8xl font-bold leading-tight text-white">Vehicles</h1>
        </div>
      </Header>
      <div className="px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vehicles?.map((vehicle, index) => (
            <CarCard key={index} vehicle={vehicle} />
          ))}
        </div>
        {pagination && (
          <Pagination page={pagination.page} limit={pagination.limit} totalPages={pagination.totalPages} />
        )}
      </div>
    </div>
  );
};

export default AllVehicles;
