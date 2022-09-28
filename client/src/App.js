import { useEffect, useState } from "react";

const App = () => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    fetch("/api/hello")
    .then(res => res.json())
    .then(data => setValue(data.message));
  }, [])

  return (
    <>
      {value ? <p>
        {value}
      </p> : null}
    </>
  );
}

export default App;
