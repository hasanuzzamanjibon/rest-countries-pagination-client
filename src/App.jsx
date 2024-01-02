import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

function App() {
  // hook
  const searchText = useRef();
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalDocuments, setTotalDocuments] = useState(0);
  const [ItemsPerPage, setItemsPerPage] = useState(12);
  const [allCountries, setAllCountries] = useState([]);
  const [filterByRegion, setRegion] = useState("");
  const [searchbyText, setSearchByText] = useState("");
  const [isLoading, setLoading] = useState(true);
  console.log("ItemsPerPage", ItemsPerPage);
  // variable for button
  let curentIndex = parseInt(currentPage) - 1;
  let buttonIndex = parseInt(currentPage) + 4;

  // handler function
  const handlerSearchText = () => {
    setLoading(true);
    setItemsPerPage(12);
    setCurrentPage(1);
    setRegion("");
    setSearchByText(searchText.current.value);
  };

  const handleItemsPerPage = (v) => {
    setLoading(true);
    setCurrentPage(1);
    setItemsPerPage(parseInt(v));
  };

  const handleFilterByRegion = (region) => {
    setLoading(true);
    setItemsPerPage(12);
    setCurrentPage(1);
    setRegion(region);
  };

  // pagination
  const totalItems = TotalDocuments;
  const itemsPerPage = ItemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  const regions = [...new Set(allCountries.map((country) => country.region))];

  useEffect(() => {
    const Country = async () => {
      const res = await fetch(
        `https://rest-country-server-hasanujjamanjibon.vercel.app/api/allcountries?page=${currentPage}&items=${itemsPerPage}&region=${filterByRegion}&subregion=${searchbyText}`
      );
      const data = await res.json();
      setCountries(data.result);
      setTotalDocuments(data.totalProducts);
      setAllCountries(data.regionResult);
      setLoading(false);
    };
    Country();
  }, [currentPage, itemsPerPage, filterByRegion, searchbyText]);

  return (
    <div className="my-20 px-6">
      <div className=" flex justify-center flex-wrap gap-6 items-center">
        <div className=" rounded-md border-2 border-slate-400 min-w-max ">
          <input
            ref={searchText}
            type="search"
            className=" text-center focus:border-0 focus:outline-none"
            placeholder="search by sub-region"
          />
          <button
            onClick={() => handlerSearchText()}
            className="bg-slate-400 items-end py-2 px-3 text-white"
          >
            <FaSearch />
          </button>
        </div>
        <div className="min-w-max">
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
        <div className="min-w-max">
          <label htmlFor="select">Show :</label>
          <select
            value={ItemsPerPage}
            onChange={(e) => handleItemsPerPage(e.target.value)}
            id="select"
          >
            <option disabled={ItemsPerPage === 12 ? true : false}>12</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="40">40</option>
          </select>
        </div>
      </div>
      <div className="text-xl font-semibold my-8">Total Countries : {TotalDocuments || 0}</div>

      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
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
      )}

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
