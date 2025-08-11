import { useEffect, useState } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const brandsPerPage = 12; // ✅ عدد العناصر في الصفحة

  function getBrands() {
    setIsLoading(true);
    axios
      .get("https://ecommerce.routemisr.com/api/v1/brands")
      .then((response) => {
        setBrands(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  
  useEffect(() => {
    getBrands();
  }, []);

  // ✅ تحديد الـ Brands التي ستظهر في الصفحة الحالية
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);

  const totalPages = Math.ceil(brands.length / brandsPerPage);

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ يرجع لأعلى الصفحة
    }
  }

  // ✅ Spinner أثناء التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RingLoader color="#22c55e" size={100} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-center font-bold text-green-600 mb-6">🏷️ All Brands</h1>


      {/* ✅ عرض الـ Brands */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {currentBrands.map((brand) => (
          <div
            key={brand._id}
            className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center p-4"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="w-24 h-24 object-contain mb-3"
            />
            <p className="text-gray-700 font-medium text-center">{brand.name}</p>
          </div>
        ))}
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
