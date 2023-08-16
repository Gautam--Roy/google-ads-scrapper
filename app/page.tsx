"use client";
import { useState } from "react";

export default function Home() {
  const [list, setList] = useState([]);
  const [keywords, setKeywords] = useState<string>("");

  const callapi = async () => {
    setList([]);

    const params = new URLSearchParams({
      pageCount: "2",
      keywords: keywords,
    });

    const url = `api/scrap?${params}`;

    const req = await fetch(url);
    const sponsoredAdsList = await req.json();
    console.log(sponsoredAdsList);
    setList(sponsoredAdsList);
  };

  return (
    <main className=" flex flex-col p-24 justify-start items-start">
      <input
        type="text"
        name="keywords"
        onChange={(e) => setKeywords(e.target.value)}
        value={keywords}
        className="border rounded-md p-2 my-2 focus:outline-none focus:border-blue-500 transition duration-300 placeholder-gray-200 w-2/5"
        placeholder="Enter your keywords"
      />
      <button
        onClick={callapi}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-700 transition duration-300"
      >
        Fetch Ads
      </button>
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
