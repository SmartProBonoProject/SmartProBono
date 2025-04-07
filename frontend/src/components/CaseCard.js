import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, formatDistance } from 'date-fns';
// Icons
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import FlightIcon from '@mui/icons-material/Flight';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import GavelIcon from '@mui/icons-material/Gavel';
import HelpIcon from '@mui/icons-material/Help';
import WarningIcon from '@mui/icons-material/Warning';
import {
import PropTypes from 'prop-types';
  getStatusLabel,
  getCaseTypeLabel,
  getPriorityLabel,
  CASE_STATUS,
  CASE_TYPES,
  PRIORITY_LEVELS,
} from '../data/casesData';
// Helper function to get the appropriate icon for a case type
const getCaseTypeIcon = type => {
  switch (type) {
    case CASE_TYPES.HOUSING:
      return <HomeIcon />;
    case CASE_TYPES.EMPLOYMENT:
      return <WorkIcon />;
    case CASE_TYPES.FAMILY:
      return <FamilyRestroomIcon />;
    case CASE_TYPES.IMMIGRATION:
      return <FlightIcon />;
    case CASE_TYPES.DEBT:
      return <MoneyOffIcon />;
    case CASE_TYPES.CIVIL_RIGHTS:
      return <GavelIcon />;
    case CASE_TYPES.CRIMINAL:
      return <GavelIcon />;
    case CASE_TYPES.EMERGENCY:
      return <WarningIcon color="error" />;
    default:
      return <HelpIcon />;
  }
};
// Helper function to get colors for status and priority
const getStatusColor = status => {
  switch (status) {
    case CASE_STATUS.NEW:
      return 'info';
    case CASE_STATUS.IN_PROGRESS:
      return 'primary';
    case CASE_STATUS.PENDING_CLIENT:
    case CASE_STATUS.PENDING_COURT:
      return 'warning';
    case CASE_STATUS.RESOLVED:
      return 'success';
    case CASE_STATUS.CLOSED:
      return 'default';
    default:
      return 'default';
  }
};
const getPriorityColor = priority => {
  switch (priority) {
    case PRIORITY_LEVELS.LOW:
      return 'success';
    case PRIORITY_LEVELS.MEDIUM:
      return 'info';
    case PRIORITY_LEVELS.HIGH:
      return 'warning';
    case PRIORITY_LEVELS.URGENT:
      return 'error';
    default:
      return 'default';
  }
};
const CaseCard = ({ caseData, variant = 'default' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Format dates
  const createdDate = new Date(caseData.created);
  const updatedDate = new Date(caseData.updated);
  const timeAgo = formatDistance(updatedDate, new Date(), { addSuffix: true });
  // Progress indicator (simplified version)
  const getProgressValue = status => {
    switch (status) {
      case CASE_STATUS.NEW:
        return 10;
      case CASE_STATUS.IN_PROGRESS:
        return 40;
      case CASE_STATUS.PENDING_CLIENT:
      case CASE_STATUS.PENDING_COURT:
        return 60;
      case CASE_STATUS.RESOLVED:
        return 90;
      case CASE_STATUS.CLOSED:
        return 100;
      default:
        return 0;
    }
  };
  const handleViewDetails = () => {
    navigate(`/cases/${caseData.id}`);
  };
  // Compact variant for dashboard
  if (variant === 'compact') {
    return (
      <Card
        sx={{
          mb: 2,
          borderLeft: 4,
          borderColor: theme.palette[getPriorityColor(caseData.priority)].main,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3,
          },
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title={getCaseTypeLabel(caseData.type)}>
                <Box
                  sx={{
                    mr: 1.5,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {getCaseTypeIcon(caseData.type)}
                </Box>
              </Tooltip>
              <Typography variant="h6" component="h3" noWrap sx={{ maxWidth: '180px' }}>
                {caseData.title}
              </Typography>
            </Box>
            <Chip
              label={getStatusLabel(caseData.status)}
              size="small"
              color={getStatusColor(caseData.status)}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" noWrap>
            {caseData.description}
          </Typography>
          <Box mt={1}>
            <LinearProgress
              variant="determinate"
              value={getProgressValue(caseData.status)}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleViewDetails} endIcon={<ArrowForwardIcon />}>
            View
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            <AccessTimeIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            {timeAgo}
          </Typography>
        </CardActions>
      </Card>
    );
  }
  // Default full case card
  return (
    <Card
      sx={{
        mb: 3,
        borderLeft: 6,
        borderColor: theme.palette[getPriorityColor(caseData.priority)].main,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 0 }}>
            <Tooltip title={getCaseTypeLabel(caseData.type)}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.background.default,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getCaseTypeIcon(caseData.type)}
              </Box>
            </Tooltip>
            <Box>
              <Typography variant="h6" component="h2">
                {caseData.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('Case')} #{caseData.id.split('-').pop()} • {format(createdDate, 'MMM d, yyyy')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: isMobile ? 1 : 0 }}>
            <Chip
              label={getStatusLabel(caseData.status)}
              size="small"
              color={getStatusColor(caseData.status)}
            />
            <Chip
              icon={<PriorityHighIcon />}
              label={`${t('Priority')}: ${getPriorityLabel(caseData.priority)}`}
              size="small"
              color={getPriorityColor(caseData.priority)}
              variant="outlined"
            />
          </Box>
        </Box>
        <Typography variant="body2" paragraph>
          {caseData.description}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('Client')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{caseData.client.name}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('Assigned To')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {caseData.assignedTo ? caseData.assignedTo.name : t('Unassigned')}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('Last Updated')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{timeAgo}</Typography>
            </Box>
          </Box>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            {t('Case Progress')}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgressValue(caseData.status)}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {getProgressValue(caseData.status)}% {t('complete')}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" onClick={handleViewDetails} endIcon={<ArrowForwardIcon />}>
          {t('View Case Details')}
        </Button>
        {caseData.nextSteps && caseData.nextSteps.length > 0 && (
          <Button variant="outlined" sx={{ ml: 2 }}>
            {t('Next Steps')} ({caseData.nextSteps.length})
          </Button>
        )}
        {caseData.documents && caseData.documents.length > 0 && (
          <Tooltip title={`${caseData.documents.length} ${t('documents')}`}>
            <IconButton size="small" sx={{ ml: 'auto' }} onClick={handleViewDetails}>
              <DescriptionIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

// Define PropTypes
CaseCard.propTypes = {
  /** TODO: Add description */
  caseData: PropTypes.any,
  /** TODO: Add description */
  variant: PropTypes.any,
};

export default CaseCard;