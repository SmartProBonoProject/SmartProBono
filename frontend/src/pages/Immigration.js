import { Box, Typography, Button, Stepper, Step, StepLabel } from '@mui/material';
import { useState } from 'react';

const Immigration = () => {
  const [activeStep, setActiveStep] = useState(0);

  const immigrationSteps = [
    'Initial Consultation',
    'Document Collection',
    'Application Process',
    'Review & Submit'
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Main Title */}
      <Typography variant="h4" gutterBottom>
        Immigration Legal Services
      </Typography>

      {/* Process Stepper */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Our Process
        </Typography>
        <Stepper activeStep={activeStep}>
          {immigrationSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Back
          </Button>
          <Button 
            variant="contained"
            onClick={() => setActiveStep((prev) => prev + 1)}
            disabled={activeStep === immigrationSteps.length - 1}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* Your existing content */}
    </Box>
  );
};

export default Immigration; 