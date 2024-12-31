import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { WEBSOCKET_URL } from './constants';

// Context creation
const WebSocketContext = createContext();
const WebSocketDispatchContext = createContext();

const initialState = {
  sessionId: null,
  generationsGroups: [],
  sharedGenerationsGroups: [],
  error: null
};

export const SESSION_ID = 'SESSION_ID';
export const PIPELINE_JOB = 'PIPELINE_JOB';
export const SET_IMAGE = 'SET_IMAGE';
export const SET_PIPELINE_JOBS = 'SET_PIPELINE_JOBS';
export const SELECT_PIPELINE_JOB = 'SELECT_PIPELINE_JOB';
export const SELECT_PIPELINE_JOB_AND_IMAGE = 'SELECT_PIPELINE_JOB_AND_IMAGE';
export const DESELECT_PIPELINE_JOBS = 'DE_SELECT_PIPELINE_JOB';
const SET_SHARED_GENERATIONS_GROUPS = 'SET_SHARED_GENERATIONS_GROUPS';
export const SELECT_IMAGE = 'SELECT_IMAGE';
export const ERROR = 'ERROR';
export const CLEAR = 'CLEAR';


export function webSocketReducer(state, action) {
  switch (action.type) {
    case SESSION_ID: {
      return {
        ...state,
        sessionId: action.data
      }
    }
    case PIPELINE_JOB: {
      const exists = state.generationsGroups.some(job => job.id === action.data.id);
    
      return {
        ...state,
        generationsGroups: exists
          ? state.generationsGroups.map((job) =>
              job.id === action.data.id
                ? {
                    ...job,
                    ...action.data,
                    generation_group_images: action.data.generation_group_images || job.generation_group_images || [],
                    selected: job.id === action.data.id,
                  }
                : job
            )
          : [
              {
                ...action.data,
                generation_group_images: action.data.generation_group_images || [],
                selected: true,
              },
              ...state.generationsGroups,
            ],
      };
    }
    case SET_PIPELINE_JOBS: {
      return {
        ...state,
        generationsGroups: action.data.map((group) => {
          const currentGroup = state.generationsGroups.find((currentGroup) => currentGroup.id === group.id);
          const selectedImage = currentGroup && currentGroup.generation_group_images.find((selectedImage) => selectedImage.selected);
          return {
          ...group,
          selected: currentGroup ? currentGroup.selected : false,
          generation_group_images: (
            group.generation_group_images.map((image, index) => ({
              ...image,
              selected: (
                selectedImage && currentGroup.generation_group_images.find((currentImage) => currentImage.uuid === image.uuid) ?
                currentGroup.generation_group_images.find((currentImage) => currentImage.uuid === image.uuid).selected : index === 0
              )
            }))
          )}
        })
      }
    }
    case SELECT_IMAGE: {
      return {
        ...state,
        generationsGroups: state.generationsGroups.map((group) => ({
          ...group,
          generation_group_images: group.generation_group_images ? group.generation_group_images.map((image) => ({
            ...image,
            selected: group.id === action.data.generationGroupID ? image.uuid === action.data.imageUUID : image.selected
          })) : [],
        }))
      }
    }
    case SET_IMAGE: {
      return {
        ...state,
        generationsGroups: state.generationsGroups.map((group) => ({
          ...group,
          generation_group_images: group.generation_group_images ? group.generation_group_images.map((image) => ({
            selected: image.selected,
            ...(action.data.id === image.id ? action.data : image),
          })) : [],
        }))
      }
    }
    case SELECT_PIPELINE_JOB: {
      return {
        ...state,
        generationsGroups: state.generationsGroups.map((group) => ({
          ...group,
          selected: group.id === action.data
        })),
      }
    }
    case SELECT_PIPELINE_JOB_AND_IMAGE: {
      return {
        ...state,
        generationsGroups: state.generationsGroups.map((group) => ({
          ...group,
          selected: group.id === action.data.generationGroupID,
          generation_group_images: group.generation_group_images ? group.generation_group_images.map((image) => ({
            ...image,
            selected: group.id === action.data.generationGroupID ? image.uuid === action.data.imageUUID : image.selected
          })) : [],
        }))
      }
    }
    case DESELECT_PIPELINE_JOBS: {
      return {
        ...state,
        generationsGroups: state.generationsGroups.map((group) => ({
          ...group,
          selected: false
        })),
      }
    }
    case SET_SHARED_GENERATIONS_GROUPS:
      return {
        ...state,
        sharedGenerationsGroups: [...action.data, ...state.sharedGenerationsGroups]
      }
    case ERROR: {
      return {
        ...state,
        generationsGroups: state.generationsGroups.map((group) => ({
          ...group,
          error: group.id === action.data.id ? action.data.error : group.error,
        })),
      }
    }
    case CLEAR: {
      return {
        ...initialState
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function useWebSocketData() {
  return useContext(WebSocketContext);
}

export function useWebSocketDispatch() {
  return useContext(WebSocketDispatchContext);
}

export function WebSocketProvider({ children }) {
  const initialStateFromSession = () => {
    const sessionData = sessionStorage.getItem('websocketData');
    return sessionData ? JSON.parse(sessionData) : initialState;
  };

  const [value, dispatch] = useReducer(
    webSocketReducer,
    initialStateFromSession()
  );

  // Effect to sync state with sessionStorage
  useEffect(() => {
    sessionStorage.setItem('websocketData', JSON.stringify(value));
  }, [value]);

  return (
    <WebSocketContext.Provider value={value}>
      <WebSocketDispatchContext.Provider value={dispatch}>
        {children}
      </WebSocketDispatchContext.Provider>
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const [messageQueue, setMessageQueue] = useState([]);
  const socket = useRef(null);
  const [isSocketOpen, setSocketOpen] = useState(false);
  const dispatch = useWebSocketDispatch();
  const messageQueueRef = useRef(messageQueue);

  function handleSessionId(data) {
    dispatch({
      type: SESSION_ID,
      data
    });
  }
  
  function handlePipelineJob(data) {
    dispatch({
      type: PIPELINE_JOB,
      data
    });
  }

  function handleSetPipelineJobs(data) {
    dispatch({
      type: SET_PIPELINE_JOBS,
      data
    });
  }
  
  function handleError(data) {
    dispatch({
      type: ERROR,
      data
    });
  }

  const queueMessage = (message) => {
    if (isSocketOpen && socket.current) {
      socket.current.send(message);
    } else {
      setMessageQueue((prevQueue) => [...prevQueue, message]);
    }
  };

  function sendHeartbeat() {
    return setInterval(() => {
        queueMessage(JSON.stringify({ type: "heartbeat" }));
    }, 30000);
  }


  useEffect(() => {
    messageQueueRef.current = messageQueue;
  }, [messageQueue]);

  useEffect(() => {
    function connectWebSocket() {
      if (!socket.current && messageQueue.length > 0) {
        let url = `${WEBSOCKET_URL}/ws/images/`;
        socket.current = new WebSocket(url);

        socket.current.onopen = () => {
            setSocketOpen(true);
            // Send all messages in the queue
            messageQueueRef.current.forEach((msg) => socket.current.send(msg));
            setMessageQueue([]); // Clear the queue after sending
        };
  
        socket.current.onmessage = function(event) {
          // Handle incoming messages
          const data = JSON.parse(event.data);
  
          if (data.type === "connect") {
            // handleSessionId(data.session_id);
            handleSetPipelineJobs(data.data);
          } else if (data.type === "pipeline_job") {
            handlePipelineJob(data.data);
          } else if (data.type === "regenerate_images") {
            handlePipelineJob(data.data);
          } else if (data.type === "image_data") {
            handlePipelineJob(data.data);
          } else if (data.type === "error") {
            console.error('Error:', data.error);
            handleError(data);
          } else if (data.type === "heartbeat") {
            // console.log('Heartbeat - alive');
          } else {
            console.error('Unknown message type:', data.type);
          }
        };
  
        socket.current.onerror = function(error) {
          console.error('WebSocket Error:', error);
        };
  
        socket.current.onclose = (event) => {
          console.log('WebSocket closed unexpectedly: ', event.code, event.reason)
          socket.current = null;
          setSocketOpen(false);
        };
      }
    }
    // Attempt to connect if there are messages in the queue
    if (messageQueue.length > 0 && !isSocketOpen) {
      connectWebSocket();
    }
  }, [messageQueue, isSocketOpen]);

  useEffect(() => {
    queueMessage(JSON.stringify({ type: "heartbeat" }));
    const interval = sendHeartbeat();
    return () => clearInterval(interval);
  }, []);
  
  return queueMessage;
}
