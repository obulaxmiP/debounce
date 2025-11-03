
//--------without lodash-----------

// import { useState } from "react";

// function Search() {
//   const [text, setText] = useState("");

//   const debounce = (func, delay) => {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => func(...args), delay);
//     };
//   };

//   const handleSearch = debounce((value) => {
//     console.log("Searching for:", value);
//   }, 2000);

//   return (
//     <input
//       type="text"
//       value={text}
//       onChange={(e) => {
//         setText(e.target.value);
//         handleSearch(e.target.value);
//       }}
//       placeholder="Type to search..."
//     />
//   );
// }


// export default Search;






//----------------------with lodash----------------

// import { useState } from "react";
// import _ from "lodash";

// function Search() {
//   const [text, setText] = useState("");

//   const handleSearch = _.debounce((value) => {
//     console.log("Searching for:", value);
//   }, 500);

//   return (
//     <input
//       type="text"
//       value={text}
//       onChange={(e) => {
//         setTexty(e.target.value);
//         handleSearch(e.target.value);
//       }}
//       placeholder="Type to search..."
//     />
//   );
// }



// export default Search;








//----------with lodash and usememo-------------


// import React, { useState, useMemo, useEffect } from "react";
// import _ from "lodash";

// function SearchBox() {
//   const [text, setText] = useState("");


//   const debouncedSearch = useMemo(() =>
//     _.debounce((value) => {
//       console.log("Searching for:", value);
//     }, 500)
//     , []);


//   useEffect(() => {
//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [debouncedSearch]);

//   return (
//     <input
//       type="text"
//       value={text}
//       onChange={(e) => {
//         setText(e.target.value);
//         debouncedSearch(e.target.value);
//       }}
//       placeholder="Type to search..."
//     />
//   );
// }

// export default SearchBox;










import React, { useState, useRef } from "react";
import axios from "axios";

function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const cancelTokenRef = useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);


    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Previous request canceled");
    }


    cancelTokenRef.current = axios.CancelToken.source();

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users?name_like=${value}`,
        { cancelToken: cancelTokenRef.current.token }
      );

      setResults(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("🚫 Request canceled:", err.message);
      } else {
        setError("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>🔍 Search Users (CancelToken)</h2>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Type a name..."
        style={{ padding: "8px", width: "250px", marginBottom: "1rem" }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchUsers;


//---------changing-----------------