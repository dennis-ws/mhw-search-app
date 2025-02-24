import React, {useState} from 'react'

function capitalizeWords(string) {
  return string
    .split(' ')  
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
    .join(' ');
  }



async function searchItem(item) {
  const type = item.get("type")
  const query = item.get("query")
  const url = `https://mhw-db.com/${type}`

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    /* Search the json for the query */
    const result = json.filter((data) => data.name == query)
    return result
  } catch (error) {
    console.error(error.message);
  }

}

function App() {
  const checkBoxItems = [
    "ailments", "armor", "armor-sets", "charms", "decorations", "events", 
    "items", "locations", "monsters", "motion-values", "skills", "weapons"
  ]

  const [queryData, setQueryData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmission = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target)
    const data = await searchItem(formData)
    

    if (data) {
      setQueryData(data);
      setError(null);
    } else {
      setError("Item not found!");
      setQueryData(null);
    }

  }

  // Render function to display data (handles objects, arrays, or primitive values)
  const renderItem = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{renderItem(item)}</li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <ul>
          {Object.entries(value).map(([key, val], index) => (
            <li key={index}>
              <strong>{key}:</strong> {renderItem(val)}
            </li>
          ))}
        </ul>
      );
    }

    return value;
  };

  return (
    <>
      <form onSubmit={handleSubmission}>
        <input name="query"/>
        {
          checkBoxItems.map((item, index) => (
            <label>
            <input type="radio" name="type" value={item}/> {capitalizeWords(item)}
            </label>
          ))
        }
      </form>

      {/* Display JSON data */}
      {queryData && (
        queryData.map((item, index) => (
          <div key={index}>
            <h3>{item.name}</h3>
            {Object.entries(item).map(([key, value], index) => (
              <div key={index}>
                <strong>{capitalizeWords(key)}:</strong> {renderItem(value)}
              </div>
            ))}
          </div>
        ))
      )}

    </>
  )
}

export default App;