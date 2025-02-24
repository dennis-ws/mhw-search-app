import React, {useState} from 'react'

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
    json.filter((data) => data.name == query)
    return json;
  } catch (error) {
    console.error(error.message);
  }

}

function App() {
  const checkBoxItems = [
    "ailments", "armor", "armor Sets", "charms", "decorations", "events", 
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

  return (
    <>
      <form onSubmit={handleSubmission}>
        <input name="query"/>
        {
          checkBoxItems.map((item, index) => (
            <label>
            <input type="radio" name="type" value={item}/> {item}
            </label>
          ))
        }
      </form>
    </>
  )
}

export default App;