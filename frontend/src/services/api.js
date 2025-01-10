import config from '../config';

const API_URL = config.apiUrl;

export const generateContract = async (template, formData, language) => {
  try {
    const response = await fetch(`${API_URL}/api/contracts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template,
        formData,
        language
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate document');
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error generating contract:', error);
    throw error;
  }
};

export const getTemplates = async () => {
  try {
    const response = await fetch(`${API_URL}/api/contracts/templates`);
    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}; 