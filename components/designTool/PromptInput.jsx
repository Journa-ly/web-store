import { useEffect, useState } from 'react';

const PromptInput = ({ defaultPrompt }) => {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    if (prompt === null) setPrompt(defaultPrompt);
  }, []);

  return (
    <>
      <label className="prompt-input-label">Describe Your Image</label>
      <textarea 
        name="prompt" 
        placeholder="A colorful Corgi DJing a party" 
        className="prompt-input prevent-zoom"
        rows="3"
        required
        defaultValue={prompt}
      />
    </>
  )
};

export default PromptInput;