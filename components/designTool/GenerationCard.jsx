import { useState } from 'react';
import Card from './Card';
import ImageCarousel from './ImageCarousel';
import ImageText from './ImageText';
import PromptInput from './PromptInput';
import ThemeSelector from './ThemeSelector';
import Toolbar from './Toolbar';
import { PIPELINE_JOB, useWebSocket, useWebSocketDispatch } from './WebSocketContext';
import NavigationArrows from './buttons/NavigationArrows';
import { SERVER_URL } from './constants';

const GenerationCard = ({ generation = {} }) => {
  const queueMessage = useWebSocket();
  const dispatch = useWebSocketDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const latestPipeline = generation.generation_group_images.length
    ? generation.generation_group_images[0].pipeline_job
    : null;
  const latestQuotePrompt = latestPipeline ? latestPipeline.initial_quote_prompt : null;
  const latestPrompt = latestPipeline ? latestPipeline.initial_prompt : null;
  const latestTheme = latestPipeline ? latestPipeline.theme : null;

  const onSubmit = (submitEvent) => {
    setIsSubmitting(true);
    submitEvent.preventDefault();

    const promptInput = submitEvent.target.querySelector('textarea[name="prompt"]');
    const themeInput = submitEvent.target.querySelector('select[name="selectedTheme"]');
    const quotePromptInput = submitEvent.target.querySelector('input[name="quotePrompt"]');

    const promptText = promptInput ? promptInput.value : '';
    const quotePromptText = quotePromptInput ? quotePromptInput.value : '';
    const theme = themeInput ? parseInt(themeInput.value) : null;

    const payload = {
      generation_group_id: generation.id,
      images: [],
      prompt: promptText,
      quote_prompt: quotePromptText,
      theme: theme
    };
    queueMessage(JSON.stringify({ type: 'heartbeat' }));

    fetch(`${SERVER_URL}/images/regenerate`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: PIPELINE_JOB,
          data: data
        });
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Card>
      <ImageCarousel
        images={generation.generation_group_images}
        generationGroupID={generation.id}
      />
      <form id={`generation_form_${generation.id}`} className="form" onSubmit={onSubmit}>
        <PromptInput defaultPrompt={latestPrompt} />
        <ThemeSelector defaultTheme={latestTheme} />
        <ImageText defaultQuotePrompt={latestQuotePrompt} />
        <Toolbar />
      </form>
      <NavigationArrows />
    </Card>
  );
};

export default GenerationCard;
