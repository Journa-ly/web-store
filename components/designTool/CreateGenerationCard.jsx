import { useState } from 'react';
import Card from './Card';
import ImageText from './ImageText';
import NewGenerationToolbar from './NewGenerationToolbar';
import PlaceholderArea from './PlaceholderArea';
import PromptInput from './PromptInput';
import ThemeSelector from './ThemeSelector';
import { PIPELINE_JOB, useWebSocket, useWebSocketDispatch } from './WebSocketContext';
import NavigationArrows from './buttons/NavigationArrows';
import { SERVER_URL } from './constants';


const CreateGenerationCard = () => {
  const queueMessage = useWebSocket();
  const dispatch = useWebSocketDispatch();
  const [formError, setFormError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (submitEvent) => {
    setIsSubmitting(true);
    submitEvent.preventDefault();

    const promptInput = submitEvent.target.querySelector('textarea[name="prompt"]');
    const themeInput = submitEvent.target.querySelector('select[name="selectedTheme"]');
    const quotePromptInput = submitEvent.target.querySelector('input[name="quotePrompt"]');

    const promptText = promptInput ? promptInput.value : "";
    const quotePromptText = quotePromptInput ? quotePromptInput.value : "";
    const theme = themeInput ? parseInt(themeInput.value) : null;

    if (!promptText) {
      setFormError('Please enter a prompt to generate images');
      return;
    } else {
      setFormError(null);
    }

    const payload = {
      images: [],
      prompt: promptText,
      quote_prompt: quotePromptText,
      theme: theme,
    };

    queueMessage(JSON.stringify({ type: "heartbeat" }));

    fetch(`${SERVER_URL}/images/generate`, {
      credentials: 'include',
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',        
      }),
      body: JSON.stringify(payload)
    }).then(response => response.json())
      .then(data => {
        dispatch({
          type: PIPELINE_JOB,
          data: data,
        });
        setIsSubmitting(false);
        document.getElementById("upload-form").reset();
      })
      .catch((error) => {
        console.error('Error:', error);
        setFormError('An error occurred while generating images. Please try again.');
      });


    // const useFaceID = useFaceIDInput ? useFaceIDInput.checked : false;
    // let base64EncodedFiles = [];
    
    // if (fileInput) {
    //   const files = Array.from(fileInput.files); // Convert FileList to Array
    //   const base64Promises = files.map(readFileAsBase64);
      
    //   await Promise.all(base64Promises).then(encodedFiles => {
    //     base64EncodedFiles = encodedFiles;
    //   }).catch(error => {
    //     console.error("Error reading files:", error);
    //     setFormError('Error reading image file. Please try again.');
    //   });
      
    //   if (!base64EncodedFiles.length && !promptText) {
    //     setFormError('Please upload an image or enter a prompt');
    //     return;
    //   } else {
    //     setFormError(null);
    //   }
    // }
  }

  return (
      <Card>
        <PlaceholderArea />
        <form id="upload-form" className="upload-form" onSubmit={onSubmit}>
          <PromptInput />
          <ThemeSelector />
          <ImageText />
          <NewGenerationToolbar />
        </form>
        <NavigationArrows />
      </Card>
    )
}

export default CreateGenerationCard;
