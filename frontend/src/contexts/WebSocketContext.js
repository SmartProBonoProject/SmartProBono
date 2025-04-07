import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import SocketService from '../services/socket';
import { logInfo, logError, logWarning } from '../utils/logger';
import { useAuth } from './AuthContext';
import config from '../config';

// Create context
const WebSocketContext = createContext();

// Get socket service instance
const socketService = new SocketService();

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  // State for connection status and error
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // Get auth context
  const { isAuthenticated, getToken } = useAuth();
  
  // Event listeners
  const [eventHandlers, setEventHandlers] = useState({});
  
  // Connect to the WebSocket server
  const connect = useCallback(async () => {
    try {
      // Clear previous connection error
      setConnectionError(null);
      
      // Get auth token if authenticated
      const authOptions = {};
      if (isAuthenticated) {
        try {
          const token = await getToken();
          if (token) {
            authOptions.token = token;
            logInfo('Using authenticated WebSocket connection');
          }
        } catch (err) {
          logError('Error getting auth token for WebSocket:', err);
        }
      } else {
        logInfo('Using public WebSocket connection (not authenticated)');
      }
      
      // Connect to WebSocket server
      const success = socketService.initSocket(authOptions);
      
      if (success) {
        // Set up handlers for connection events
        socketService.onOpen(() => {
          logInfo('WebSocket connected');
          setIsConnected(true);
          setConnectionError(null);
        });
        
        socketService.onError((error) => {
          logError('WebSocket error:', error);
          setConnectionError(error.message || 'Connection error');
        });
        
        socketService.onClose((event) => {
          logInfo('WebSocket closed:', event);
          setIsConnected(false);
          
          if (!event.wasClean) {
            setConnectionError('Connection closed unexpectedly');
            
            // Attempt to reconnect after delay
            setTimeout(() => {
              if (!socketService.isConnected()) {
                connect();
              }
            }, 5000);
          }
        });
        
        // Add handler for auth errors
        socketService.on('auth_error', (data) => {
          logError('WebSocket authentication error:', data.message);
          setConnectionError(`Authentication error: ${data.message}`);
        });
        
        // Register existing event handlers
        Object.entries(eventHandlers).forEach(([event, handlers]) => {
          handlers.forEach(handler => {
            socketService.on(event, handler);
          });
        });
        
        // Special handler for notifications
        socketService.on('notification', (data) => {
          // Call any registered notification handlers
          if (eventHandlers.notification) {
            eventHandlers.notification.forEach(handler => {
              try {
                handler(data);
              } catch (err) {
                logError('Error in notification handler:', err);
              }
            });
          }
          
          // Show browser notification if supported and permission granted
          if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
            try {
              new Notification(data.title, {
                body: data.message,
                icon: '/logo192.png'
              });
            } catch (err) {
              logError('Error creating browser notification:', err);
            }
          }
        });
        
        // Handle browser notification events
        socketService.on('browser_notification', (notification) => {
          // Check if user has granted permission and document is not visible
          if ('Notification' in window && 
              Notification.permission === 'granted' && 
              (document.hidden || document.visibilityState === 'hidden')) {
            try {
              const notif = new Notification(notification.title, {
                body: notification.message,
                icon: '/logo192.png',
                tag: notification.id // Prevents duplicate notifications
              });
              
              // Handle notification click
              notif.onclick = function() {
                window.focus();
                if (notification.actionUrl) {
                  window.location.href = notification.actionUrl;
                }
                this.close();
              };
              
              logInfo('Browser notification shown:', notification.title);
            } catch (err) {
              logError('Error creating browser notification:', err);
            }
          }
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      logError('Error connecting to WebSocket:', error);
      setConnectionError(error.message || 'Failed to connect');
      return false;
    }
  }, [isAuthenticated, getToken, eventHandlers]);
  
  // Disconnect from the WebSocket server
  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
  }, []);
  
  // Send a message to the WebSocket server
  const sendMessage = useCallback((message) => {
    if (!isConnected) {
      logWarning('Cannot send message: WebSocket not connected');
      return false;
    }
    
    try {
      // Special handling for test notifications
      if (message.type === 'test_notification') {
        logInfo('Sending test notification:', message);
        socketService.sendMessage({
          type: 'test_notification',
          data: message.data
        });
        return true;
      }
      
      socketService.sendMessage(message);
      return true;
    } catch (error) {
      logError('Error sending message:', error);
      return false;
    }
  }, [isConnected]);
  
  // Register an event handler
  const on = useCallback((event, handler) => {
    setEventHandlers(prev => {
      const handlers = prev[event] || [];
      // Don't add duplicate handlers
      if (handlers.indexOf(handler) === -1) {
        const newHandlers = [...handlers, handler];
        socketService.on(event, handler);
        return { ...prev, [event]: newHandlers };
      }
      return prev;
    });
    
    // Return cleanup function
    return () => off(event, handler);
  }, []);
  
  // Remove an event handler
  const off = useCallback((event, handler) => {
    setEventHandlers(prev => {
      const handlers = prev[event] || [];
      const newHandlers = handlers.filter(h => h !== handler);
      socketService.off(event, handler);
      return { ...prev, [event]: newHandlers };
    });
  }, []);
  
  // Auto-connect when authenticated changes
  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      connect();
    }
  }, [isAuthenticated, isConnected, connect]);
  
  // Context value
  const contextValue = {
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage,
    on,
    off
  };
  
  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default WebSocketContext; 