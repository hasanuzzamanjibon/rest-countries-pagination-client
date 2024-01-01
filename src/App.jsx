import { useEffect, useState } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalDocuments, setTotalDocuments] = useState(0);
  const [ItemsPerPage, setItemsPerPage] = useState(12);
  const [allCountries, setAllCountries] = useState([]);
  const [filterByRegion, setRegion] = useState("");

  let curentIndex = parseInt(currentPage) - 1;
  let buttonIndex = parseInt(currentPage) + 4;
  console.log(curentIndex, buttonIndex);

  const handleItemsPerPage = (v) => {
    setItemsPerPage(parseInt(v));
    setCurrentPage(1);
  };

  const handleFilterByRegion = (region) => {
    setRegion(region);
    setCurrentPage(1);
  };
  // pagination
  const totalItems = TotalDocuments;
  const itemsPerPage = ItemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);

  const AllCountryRegion = allCountries.map((country) => country.region);
  const regions = [...new Set(AllCountryRegion)];

  useEffect(() => {
    const Country = async () => {
      const res = await fetch(
        `https://country-server-hasanujjamanjibon.vercel.app/api/allcountries?page=${currentPage}&items=${itemsPerPage}&region=${filterByRegion}`
      );
      const data = await res.json();
      setCountries(data);
    };
    Country();
  }, [currentPage, itemsPerPage, filterByRegion]);





  useEffect(() => {
    const TotalDocumentsCount = async () => {
      const res = await fetch(
        `https://country-server-hasanujjamanjibon.vercel.app/allCountries?region=${filterByRegion}`
      );
      const data = await res.json();
      // console.log("result", data.result);
      setTotalDocuments(data.totalProducts);
      setAllCountries(data.result);
    };
    TotalDocumentsCount();
  }, [filterByRegion]);

  return (
    <div className="my-20 px-6">
      <div className=" flex justify-end gap-6 items-center">
        <div>
          <label htmlFor="select">Filter By :</label>
          {regions ? (
            <select id="select" onChange={(e) => handleFilterByRegion(e.target.value)}>
              {regions?.map((region, i) => (
                <option key={i}>{region}</option>
              ))}
              <option value="">All</option>
            </select>
          ) : (
            ""
          )}
        </div>
        <div>
          <label htmlFor="select">Show :</label>
          <select onChange={(e) => handleItemsPerPage(e.target.value)} name="" id="select">
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="40">40</option>
          </select>
        </div>
      </div>
      <div className="text-xl font-semibold">Total Countries : {allCountries?.length || 0}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {countries?.map((country, i) => (
          <div key={i} className="shadow w-full px-5">
            <img
              className="w-full h-60 border"
              src={country?.flags?.png}
              alt={country?.name?.official}
            />
            <p>Name : {country?.name?.official}</p>
            <p>Population : {country?.population}</p>
            <p>Region : {country?.region}</p>
          </div>
        ))}
      </div>
      <div className="text-center my-6">
        <p>
          - {currentPage} Page of {totalPages} -
        </p>
      </div>
      <div className="flex justify-center flex-wrap gap-3 ">
        {currentPage !== 1 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-1 bg-slate-100  rounded-md text-xl font-bold"
          >
            &lt;
          </button>
        )}

        {pageNumbers?.slice(curentIndex, buttonIndex)?.map((number, i) => (
          <button
            className={`px-4 py-1  rounded-md ${
              currentPage === number ? "bg-slate-300" : "bg-slate-100"
            }`}
            key={i}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
        {currentPage !== totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-1 bg-slate-100  rounded-md text-xl font-bold"
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
