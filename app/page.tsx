"use client";
import { useState } from "react";

export default function Home() {
  const [list, setList] = useState([]);
  const [keywords, setKeywords] = useState<string>("");
  const [pageCount, setPageCount] = useState<string>("");
  const [error, setError] = useState<Boolean>(false);
  const [searching, setSearching] = useState<Boolean>(false);

  const callapi = async () => {
    setList([]);
    setError(false);
    setSearching(false);
    // Check for empty fields and default the pageCount field to 1
    if (keywords.trim() === "") {
      setError(true);
      return;
    }
    if (pageCount.trim() === "") setPageCount("1");

    const params = new URLSearchParams({
      pageCount: pageCount,
      keywords: keywords,
    });

    const url = `api/scrap?${params}`;

    setSearching(true);
    const req = await fetch(url);
    const sponsoredAdsList = await req.json();
    setList(sponsoredAdsList);
    setSearching(false);
  };

  return (
    <main className=" flex flex-col p-24 justify-start items-start">
      <input
        type="text"
        name="keywords"
        onChange={(e) => {
          setError(false), setKeywords(e.target.value);
        }}
        value={keywords}
        className={`border rounded-md p-2 my-2 focus:outline-none focus:border-blue-500 transition duration-300 placeholder-gray-200 w-2/5 ${
          error && " outline outline-1 outline-red-600"
        }`}
        placeholder="Keywords"
      />
      <input
        type="text"
        name="pageCount"
        onChange={(e) => setPageCount(e.target.value)}
        value={pageCount}
        className="border rounded-md p-2 my-2 focus:outline-none focus:border-blue-500 transition duration-300 placeholder-gray-200 w-14"
        placeholder="Pages"
      />
      <button
        onClick={callapi}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 my-1 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-700 transition duration-300"
      >
        Fetch Ads
      </button>
      {searching && <>Searching...</>}
      {list.length == 0 && <>No data found</>}
      <ul>
        {list.length > 0 &&
          list?.map((item: any, key) => {
            return (
              <div key={key}>
                <p>{`Page : ${key + 1}`}</p>
                <li className="flex flex-col">
                  {item?.length > 0 &&
                    item?.map((subitem: any, subkey: number) => {
                      return (
                        <a
                          key={subkey}
                          href={subitem["href"]}
                          className="text-blue-500 hover:underline hover:text-blue-600 focus:outline-none focus:underline focus:text-blue-600 transition duration-300"
                        >
                          {subitem["title"]}
                        </a>
                      );
                    })}
                </li>
              </div>
            );
          })}
      </ul>
    </main>
  );
}
