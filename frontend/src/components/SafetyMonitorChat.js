import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
  Grid,
  Divider,
  Badge,
  Alert,
  useTheme as useChakraTheme,
  VisuallyHidden,
} from '@chakra-ui/react';
import {
  TextField,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Fade,
  useTheme as useMuiTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FaPaperPlane,
  FaMapMarkerAlt,
  FaBell,
  FaCamera,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPhone,
  FaLock,
  FaUserFriends,
  FaPlus,
} from 'react-icons/fa';
import axios from 'axios';
// Import secure encryption utilities
import { encryptMessage, decryptMessage, SessionKeyManager } from '../utils/secureEncryption';
import { logInfo, logError } from '../utils/logger';
import PropTypes from 'prop-types';
// Enhanced screen reader announcement component with different politeness levels
const ScreenReaderAnnouncement = ({
  children,
  politeness = 'polite', // Can be "polite", "assertive", or "off"
  clearAfter = 5000, // Clear announcement after 5 seconds to prevent duplicate reading
}) => {
  const [announcement, setAnnouncement] = useState(children);
  useEffect(() => {
    setAnnouncement(children);
    if (clearAfter && children) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, clearAfter);
      return () => clearTimeout(timer);
    }
  }, [children, clearAfter]);
  if (!announcement) return null;
  return (
    <VisuallyHidden
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      data-testid="screen-reader-announcement"
    >
      {announcement}
    </VisuallyHidden>
  );
};
const SafetyMonitorChat = ({
  caseId,
  clientInfo,
  lawyerInfo,
  onSendSOS,
  onLocationShare,
  onAddCompanion,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [companions, setCompanions] = useState([]);
  const [selectedCompanions, setSelectedCompanions] = useState([]);
  const [isAddingCompanions, setIsAddingCompanions] = useState(false);
  const [sosDialogOpen, setSosDialogOpen] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState('active'); // 'active', 'warning', 'danger'
  const [announcement, setAnnouncement] = useState(''); // For screen reader announcements
  const [encryptionKey, setEncryptionKey] = useState(null); // Store encryption key
  const [encryptionReady, setEncryptionReady] = useState(false); // Track encryption status
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // For keyboard focus management
  const sosButtonRef = useRef(null); // For emergency focus management
  const chakraTheme = useChakraTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  // Initialize encryption when component mounts
  useEffect(() => {
    initializeEncryption();
  }, [caseId, initializeEncryption]);
  // Initialize encryption for the current chat session
  const initializeEncryption = async () => {
    try {
      const sessionKey = await SessionKeyManager.getSessionKey(`chat_${caseId}`);
      setEncryptionKey(sessionKey);
      setEncryptionReady(true);
      logInfo('Encryption initialized for chat session');
    } catch (error) {
      logError('Failed to initialize encryption:', error);
      announce(
        'Failed to initialize secure chat. Some messages may not be encrypted.',
        'assertive'
      );
    }
  };
  // Scroll to bottom of message list when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
    // Set up polling for location updates if sharing is enabled
    const locationInterval = setInterval(() => {
      if (isSharingLocation) {
        updateLocation();
      }
    }, 30000); // Update every 30 seconds
    return () => clearInterval(locationInterval);
  }, [caseId, isSharingLocation, fetchInitialData, updateLocation]);
  // Improved announcement function for screen readers
  const announce = (message, politeness = 'polite') => {
    setAnnouncement({ text: message, politeness });
    // For critical announcements, also use the browser's native speech API if available
    if (politeness === 'assertive' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };
  const fetchInitialData = async () => {
    setIsLoading(true);
    announce(`Loading safety monitor for case ${caseId}`, 'polite');
    try {
      // Fetch messages from safety monitor API
      const messagesResponse = await axios.get(`/api/safety-monitor/chat/${caseId}`);
      const statusResponse = await axios.get(`/api/safety-monitor/status/${caseId}`);
      const companionsResponse = await axios.get(`/api/safety-monitor/companion/${caseId}`);
      // Decrypt messages if they are encrypted
      let messagesData = messagesResponse.data.messages || [];
      if (encryptionReady) {
        messagesData = await Promise.all(
          messagesData.map(async message => {
            // Only try to decrypt if the message has encryptedContent field
            if (message.encryptedContent && message.iv) {
              try {
                return await decryptMessage(encryptionKey, message);
              } catch (error) {
                logError('Failed to decrypt message:', error);
                // Return a placeholder for failed decryption
                return {
                  ...message,
                  text: 'This message cannot be decrypted. It may have been encrypted with a different key.',
                  decryptionFailed: true,
                };
              }
            }
            return message;
          })
        );
      }
      setMessages(messagesData);
      setCompanions(companionsResponse.data.companions || []);
      setSelectedCompanions(companionsResponse.data.companions || []);
      // Update status based on response
      setSosActive(statusResponse.data.active_sos || false);
      setIsSharingLocation(statusResponse.data.location_sharing || false);
      if (statusResponse.data.current_location) {
        setLocation(statusResponse.data.current_location);
      }
      // Set safety status based on safety_level
      if (statusResponse.data.safety_level === 'EMERGENCY') {
        setSafetyStatus('danger');
      } else if (statusResponse.data.safety_level === 'WARNING') {
        setSafetyStatus('warning');
      } else {
        setSafetyStatus('active');
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      // Add error message
      const errorMessage = {
        text: 'Failed to load chat history and safety status. Please try refreshing the page.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = {
      text: input,
      sender: clientInfo ? 'client' : 'lawyer',
      senderId: clientInfo ? clientInfo.id : lawyerInfo.id,
      senderName: clientInfo ? clientInfo.name : lawyerInfo.name,
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    // Optimistically update UI with unencrypted message
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    announce('Message sent');
    try {
      // Encrypt message if encryption is ready
      let messageToSend = {
        content: userMessage.text,
        sender: userMessage.sender,
        sender_id: userMessage.senderId,
        type: 'text',
      };
      if (encryptionReady) {
        try {
          const encryptedMessage = await encryptMessage(encryptionKey, userMessage);
          // Update messageToSend with encrypted data
          messageToSend = {
            encryptedContent: encryptedMessage.encryptedContent,
            iv: encryptedMessage.iv,
            sender: userMessage.sender,
            sender_id: userMessage.senderId,
            type: 'encrypted',
            encryptionVersion: encryptedMessage.encryptionVersion,
          };
        } catch (error) {
          console.error('Failed to encrypt message:', error);
          // Continue with unencrypted message if encryption fails
          announce('Failed to encrypt message. Sending as plaintext.', 'polite');
        }
      }
      // Send message to server using safety monitor API
      const response = await axios.post(`/api/safety-monitor/chat/${caseId}`, messageToSend);
      // If we got a response from support, add it to the chat
      if (response.data.response) {
        let responseMessage = {
          text: response.data.response.content,
          sender: response.data.response.sender,
          senderId: response.data.response.sender_id,
          timestamp: response.data.response.timestamp,
        };
        // Try to decrypt if it's an encrypted message and encryption is ready
        if (response.data.response.type === 'encrypted' && encryptionReady) {
          try {
            responseMessage = await decryptMessage(encryptionKey, {
              encryptedContent: response.data.response.encryptedContent,
              iv: response.data.response.iv,
              timestamp: response.data.response.timestamp,
              senderId: response.data.response.sender_id,
              type: response.data.response.type,
            });
          } catch (error) {
            console.error('Failed to decrypt response:', error);
            responseMessage.text =
              'This message cannot be decrypted. It may have been encrypted with a different key.';
            responseMessage.decryptionFailed = true;
          }
        }
        setMessages(prev => [...prev, responseMessage]);
        announce('New message received from support team');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage = {
        text: 'Failed to send message. Please try again.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      announce('Error sending message. Please try again.');
    } finally {
      setIsLoading(false);
      // Focus back on input field
      inputRef.current?.focus();
    }
  };
  const toggleLocationSharing = async () => {
    if (isSharingLocation) {
      setIsSharingLocation(false);
      // Notify server that sharing stopped using safety monitor API
      try {
        await axios.post(`/api/safety-monitor/status/${caseId}`, {
          location_sharing: false,
          user_id: clientInfo ? clientInfo.id : lawyerInfo.id,
        });
        // Add system message about stopping location sharing
        const systemMessage = {
          text: 'Location sharing has been disabled.',
          sender: 'system',
          timestamp: new Date().toISOString(),
          isLocationUpdate: true,
        };
        setMessages(prev => [...prev, systemMessage]);
        announce('Location sharing has been turned off');
      } catch (error) {
        console.error('Error stopping location sharing:', error);
        announce('Error turning off location sharing');
      }
      return;
    }
    announce('Requesting location access...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          };
          setLocation(locationData);
          setIsSharingLocation(true);
          // Send location to server using safety monitor API
          try {
            await axios.post(`/api/safety-monitor/status/${caseId}`, {
              location_sharing: true,
              current_location: locationData,
              user_id: clientInfo ? clientInfo.id : lawyerInfo.id,
            });
            // Add system message about location sharing
            const systemMessage = {
              text: 'Location sharing is now active. Your support team can see your location.',
              sender: 'system',
              timestamp: new Date().toISOString(),
              isLocationUpdate: true,
            };
            setMessages(prev => [...prev, systemMessage]);
            announce('Location sharing is now active');
            if (onLocationShare) {
              onLocationShare(locationData);
            }
          } catch (error) {
            console.error('Error sharing location:', error);
            // Add error message
            const errorMessage = {
              text: 'Failed to enable location sharing. Please try again.',
              sender: 'system',
              timestamp: new Date().toISOString(),
              isError: true,
            };
            setMessages(prev => [...prev, errorMessage]);
            announce('Error enabling location sharing');
          }
        },
        error => {
          console.error('Geolocation error:', error);
          // Handle errors or permission denials
          const errorMessage = {
            text: 'Unable to access your location. Please check your browser settings and try again.',
            sender: 'system',
            timestamp: new Date().toISOString(),
            isError: true,
          };
          setMessages(prev => [...prev, errorMessage]);
          announce('Unable to access your location. Please check browser permissions.');
        }
      );
    } else {
      // Geolocation not supported
      const errorMessage = {
        text: 'Location sharing is not supported by your browser.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      announce('Location sharing is not supported by your browser');
    }
  };
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          };
          setLocation(locationData);
          // Send updated location to server using safety monitor API
          try {
            await axios.post(`/api/safety-monitor/status/${caseId}`, {
              current_location: locationData,
              user_id: clientInfo ? clientInfo.id : lawyerInfo.id,
            });
          } catch (error) {
            console.error('Error updating location:', error);
          }
        },
        error => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };
  const handleSOSRequest = () => {
    setSosDialogOpen(true);
    announce('SOS confirmation dialog opened');
  };
  const confirmSOS = async () => {
    setSosDialogOpen(false);
    setSosActive(true);
    setSafetyStatus('danger');
    // Add SOS message to the chat
    const sosMessage = {
      text: 'SOS ALERT: Client has requested emergency assistance.',
      sender: 'system',
      timestamp: new Date().toISOString(),
      isSOS: true,
    };
    setMessages(prev => [...prev, sosMessage]);
    announce('SOS alert has been activated. Support team has been notified.');
    // Send SOS to server using safety monitor API
    try {
      const response = await axios.post(`/api/safety-monitor/sos/${caseId}`, {
        message: 'Client has requested emergency assistance',
        location: location,
        user_id: clientInfo ? clientInfo.id : lawyerInfo.id,
      });
      if (onSendSOS) {
        onSendSOS(location);
      }
    } catch (error) {
      console.error('Error sending SOS:', error);
      // Add error message
      const errorMessage = {
        text: 'Failed to send SOS alert to the support team. Please call emergency services directly if you need immediate help.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      announce(
        'Error sending SOS alert. Please call emergency services if you need immediate help.'
      );
    }
  };
  const cancelSOS = () => {
    setSosDialogOpen(false);
    announce('SOS request cancelled');
  };
  const markSafe = async () => {
    setSosActive(false);
    setSafetyStatus('active');
    // Add system message
    const safeMessage = {
      text: 'Client has marked themselves as safe. SOS alert has been canceled.',
      sender: 'system',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, safeMessage]);
    announce('You have marked yourself as safe. SOS alert has been cancelled.');
    // Notify server using safety monitor API
    try {
      await axios.post(`/api/safety-monitor/sos/${caseId}/cancel`, {
        user_id: clientInfo ? clientInfo.id : lawyerInfo.id,
      });
    } catch (error) {
      console.error('Error marking safe:', error);
      // Add error message
      const errorMessage = {
        text: 'Failed to cancel SOS alert. Please try again.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      announce('Error cancelling SOS alert');
    }
  };
  const handleAddCompanions = () => {
    setIsAddingCompanions(true);
  };
  const confirmAddCompanions = async () => {
    setIsAddingCompanions(false);
    // Filter out newly added companions
    const newCompanions = selectedCompanions.filter(
      selected => !companions.some(existing => existing.id === selected.id)
    );
    if (newCompanions.length === 0) {
      return;
    }
    setIsLoading(true);
    try {
      // Add each new companion using safety monitor API
      for (const companion of newCompanions) {
        await axios.post(`/api/safety-monitor/companion/${caseId}`, {
          name: companion.name,
          phone: companion.phone,
          relationship: companion.relationship,
          email: companion.email,
          user_id: clientInfo ? clientInfo.id : lawyerInfo.id,
        });
      }
      // Update companions list
      setCompanions([...companions, ...newCompanions]);
      // Add system message
      const companionMessage = {
        text: `${newCompanions.length} new emergency contacts added. They will be notified in case of an emergency.`,
        sender: 'system',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, companionMessage]);
      if (onAddCompanion) {
        onAddCompanion(newCompanions);
      }
    } catch (error) {
      console.error('Error adding companions:', error);
      // Add error message
      const errorMessage = {
        text: 'Failed to add emergency contacts. Please try again.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      announce('Error adding emergency contacts');
    } finally {
      setIsLoading(false);
    }
  };
  const cancelAddCompanions = () => {
    setIsAddingCompanions(false);
    // Reset selection to current companions
    setSelectedCompanions(companions);
  };
  // Message bubble component
  const MessageBubble = ({ message }) => {
    const isClient = message.sender === 'client';
    const isLawyer = message.sender === 'lawyer';
    const isSystem = message.sender === 'system';
    const bgColor = isClient ? 'blue.50' : isLawyer ? 'green.50' : 'gray.100';
    const textAlign = isClient ? 'right' : 'left';
    const messageType = isSystem
      ? message.isSOS
        ? 'emergency alert'
        : message.isSafe
          ? 'safety update'
          : message.isLocationUpdate
            ? 'location update'
            : message.isError
              ? 'error message'
              : 'system message'
      : isClient
        ? 'sent message'
        : 'received message';
    if (isSystem) {
      return (
        <Box
          width="100%"
          textAlign="center"
          my={4}
          role="status"
          aria-live={message.isSOS ? 'assertive' : 'polite'}
        >
          <Box
            display="inline-block"
            bg={message.isSOS ? 'red.100' : message.isSafe ? 'green.100' : 'gray.100'}
            borderRadius="md"
            px={4}
            py={2}
          >
            {message.isSOS && (
              <FaExclamationTriangle
                color="red"
                style={{ display: 'inline', marginRight: '8px' }}
                aria-hidden="true"
              />
            )}
            {message.isSafe && (
              <FaCheckCircle
                color="green"
                style={{ display: 'inline', marginRight: '8px' }}
                aria-hidden="true"
              />
            )}
            {message.isLocationUpdate && (
              <FaMapMarkerAlt
                style={{ display: 'inline', marginRight: '8px' }}
                aria-hidden="true"
              />
            )}
            <Typography variant="body2" display="inline">
              {message.text}
            </Typography>
          </Box>
        </Box>
      );
    }
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems={isClient ? 'flex-end' : 'flex-start'}
        mb={2}
        width="100%"
        aria-label={`${isClient ? 'You' : message.senderName}: ${message.text}`}
        role="listitem"
      >
        <Box display="flex" alignItems="center" mb={1}>
          {!isClient && <Avatar size="sm" name={message.senderName} mr={2} aria-hidden="true" />}
          <Typography variant="caption" color="gray.500">
            {message.senderName} • {new Date(message.timestamp).toLocaleTimeString()}
            {message.decrypted && (
              <Box as="span" ml={1} aria-label="Encrypted message">
                <FaLock size="0.75em" aria-hidden="true" />
              </Box>
            )}
            {message.decryptionFailed && (
              <Box as="span" ml={1} color="red.500" aria-label="Decryption failed">
                <FaExclamationTriangle size="0.75em" aria-hidden="true" />
              </Box>
            )}
          </Typography>
          {isClient && <Avatar size="sm" name={message.senderName} ml={2} aria-hidden="true" />}
        </Box>
        <Box maxWidth="70%" bg={bgColor} p={3} borderRadius="lg" boxShadow="sm">
          <Typography variant="body1" textAlign={textAlign}>
            {message.text}
          </Typography>
        </Box>
      </Box>
    );
  };
  const logMessage = (message) => {
    if (process.env.NODE_ENV !== 'production') {
      logInfo(message);
    }
  };
  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      role="region"
      aria-label="Safety Monitor Chat"
    >
      {/* Screen reader announcements */}
      <ScreenReaderAnnouncement>{announcement}</ScreenReaderAnnouncement>
      {/* Header with status and actions */}
      <Box
        p={4}
        borderBottom="1px"
        borderColor="gray.200"
        bg="white"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        as="header"
        aria-label="Chat controls and status"
      >
        <Box display="flex" alignItems="center">
          <Badge
            colorScheme={sosActive ? 'red' : safetyStatus === 'warning' ? 'yellow' : 'green'}
            variant="subtle"
            px={2}
            py={1}
            borderRadius="full"
            aria-label={`Safety status: ${sosActive ? 'SOS Active' : safetyStatus === 'warning' ? 'Check-in Required' : 'Active'}`}
          >
            {sosActive ? 'SOS ACTIVE' : safetyStatus === 'warning' ? 'Check-in Required' : 'Active'}
          </Badge>
          {isSharingLocation && (
            <Badge
              ml={2}
              colorScheme="blue"
              variant="subtle"
              px={2}
              py={1}
              borderRadius="full"
              aria-label="Location sharing is active"
            >
              <Box display="flex" alignItems="center">
                <FaMapMarkerAlt style={{ marginRight: '4px' }} aria-hidden="true" />
                Location Sharing
              </Box>
            </Badge>
          )}
        </Box>
        <Box role="toolbar" aria-label="Safety actions">
          <Tooltip label="Share your location">
            <IconButton
              aria-label={isSharingLocation ? 'Stop sharing location' : 'Share your location'}
              icon={<FaMapMarkerAlt />}
              onClick={toggleLocationSharing}
              colorScheme={isSharingLocation ? 'blue' : 'gray'}
              mr={2}
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Add companions">
            <IconButton
              aria-label="Add emergency contacts"
              icon={<FaUserFriends />}
              onClick={handleAddCompanions}
              colorScheme="gray"
              mr={2}
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Send SOS alert">
            <IconButton
              aria-label={sosActive ? 'SOS alert is active' : 'Send SOS emergency alert'}
              icon={<FaBell />}
              onClick={handleSOSRequest}
              colorScheme={sosActive ? 'red' : 'gray'}
              mr={2}
              size="sm"
            />
          </Tooltip>
        </Box>
      </Box>
      {/* SOS alert bar - shows when SOS is active */}
      {sosActive && (
        <Alert status="error" variant="solid" role="alert" aria-live="assertive">
          <Box display="flex" justifyContent="space-between" width="100%" p={2}>
            <Box display="flex" alignItems="center">
              <FaExclamationTriangle style={{ marginRight: '8px' }} aria-hidden="true" />
              SOS Alert is active. Support team has been notified.
            </Box>
            <Button
              colorScheme="green"
              size="sm"
              onClick={markSafe}
              aria-label="Mark yourself as safe and cancel SOS alert"
            >
              I'm Safe
            </Button>
          </Box>
        </Alert>
      )}
      {/* Chat message area */}
      <Box
        flex={1}
        overflowY="auto"
        p={4}
        bg="gray.50"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {isLoading && messages.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            aria-label="Loading messages"
          >
            <CircularProgress aria-label="Loading" />
          </Box>
        ) : (
          messages.map((message, index) => <MessageBubble key={index} message={message} />)
        )}
        <div ref={messagesEndRef} tabIndex={-1} aria-hidden="true" />
      </Box>
      {/* Message input area */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        p={4}
        bg="white"
        borderTop="1px"
        borderColor="gray.200"
        role="form"
        aria-label="Message input form"
      >
        <Grid templateColumns="1fr auto" gap={2}>
          <TextField
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            variant="filled"
            size="md"
            ref={inputRef}
            aria-label="Message text"
            autoComplete="off"
          />
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            isDisabled={!input.trim()}
            leftIcon={<FaPaperPlane aria-hidden="true" />}
            aria-label="Send message"
          >
            Send
          </Button>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-start">
          <Tooltip label={encryptionReady ? 'End-to-end encrypted' : 'Encryption initializing...'}>
            <Box
              display="flex"
              alignItems="center"
              fontSize="sm"
              color={encryptionReady ? 'green.500' : 'gray.500'}
              aria-label={
                encryptionReady ? 'Secure end-to-end encrypted chat' : 'Encryption initializing...'
              }
            >
              <FaLock style={{ marginRight: '4px' }} aria-hidden="true" />
              {encryptionReady ? 'Secure Chat' : 'Securing Chat...'}
            </Box>
          </Tooltip>
        </Box>
      </Box>
      {/* SOS Confirmation Dialog */}
      <Dialog
        open={sosDialogOpen}
        onClose={cancelSOS}
        aria-labelledby="sos-dialog-title"
        aria-describedby="sos-dialog-description"
      >
        <DialogTitle id="sos-dialog-title">
          <Box display="flex" alignItems="center">
            <FaExclamationTriangle
              style={{ color: 'red', marginRight: '8px' }}
              aria-hidden="true"
            />
            Send SOS Alert
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="sos-dialog-description">
            This will send an emergency alert to the support team and share your current location.
            Use this only in case of emergency when you need immediate assistance.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSOS} color="primary" aria-label="Cancel SOS request">
            Cancel
          </Button>
          <Button
            onClick={confirmSOS}
            color="error"
            variant="contained"
            aria-label="Confirm and send SOS alert"
          >
            Send SOS Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Define PropTypes
ScreenReaderAnnouncement.propTypes = {
  /** TODO: Add description */
  children: PropTypes.any,
  /** TODO: Add description */
  politeness: PropTypes.any,
  /** TODO: Add description */
  // Can be "polite": PropTypes.any,
  /** TODO: Add description */
  "assertive": PropTypes.any,
  /** TODO: Add description */
  or "off"
  clearAfter: PropTypes.any,
  /** TODO: Add description */
  // Clear announcement after 5 seconds to prevent duplicate reading: PropTypes.any,
};

export default SafetyMonitorChat;