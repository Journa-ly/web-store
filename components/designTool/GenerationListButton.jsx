import { SELECT_PIPELINE_JOB, useWebSocketDispatch } from './WebSocketContext';

export default function GenerationListButton({ generation=[], closeAddCharacter }) {
  const dispatch = useWebSocketDispatch();
  let generationAvatarImage;
  const pipelineJobWithInitialImages = generation.pipelien_jobs && generation.pipeline_jobs.find(
    (job) => job.initial_images.length > 0);


  if (pipelineJobWithInitialImages) {
    generationAvatarImage = pipelineJobWithInitialImages
  }

  const handleCharacterClick = (character) => {
    closeAddCharacter();
    dispatch({
      type: SELECT_PIPELINE_JOB,
      data: character.id
    });
  }

  return (
          <li className="hover-grow" key={generation.id} style={{
            padding: '2px',
            width: "64px",
            height: "64px",
            border: generation.selected ? '2px solid black' : 'none', 
            borderRadius: '32px',
            cursor: 'pointer',
          }}>
            <button 
              onClick={() => handleCharacterClick(generation)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: "100%",
                width: "100%",
              }}
            >
              {generationAvatarImage ? (
                <img src={generationAvatarImage.image} alt={`generation_${generation.id}`} style={{ maxWidth: '100%', borderRadius: "30px", aspectRatio: "1" }} />
              ) : (
                <div style={{ 
                  backgroundColor: "lightgrey",
                  width: "100%",
                  height: "100%",
                  borderRadius: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 }}> {generation.id} </div>
              )}
            </button>
          </li>
  );
}