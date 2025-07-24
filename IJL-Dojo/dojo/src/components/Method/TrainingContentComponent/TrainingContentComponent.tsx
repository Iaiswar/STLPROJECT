import { useEffect, useState } from 'react';

function TrainingContentComponent() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/level-training-content/level_1/')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setContent(data);
      })
      .catch(err => {
        console.error('Error fetching training content:', err);
      });
  }, []);

  return (
    <div>
      <h2>Level 1 Training Content</h2>
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  );
}

export default TrainingContentComponent;
