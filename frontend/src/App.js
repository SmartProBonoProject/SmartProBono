import React, { useState } from "react";
import axios from "axios";
import { 
    TextField, 
    Button, 
    Box, 
    Typography, 
    Paper,
    Container,
    CircularProgress,
    Alert
} from "@mui/material";

function App() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const res = await axios.post("http://127.0.0.1:5000/api/legal", { prompt });
            setResponse(res.data.response);
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while processing your request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ 
                padding: "40px 20px",
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}>
                <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main',
                        textAlign: 'center'
                    }}
                >
                    Legal Advice Assistant
                </Typography>

                <Paper elevation={3} sx={{ padding: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            label="Ask a legal question or request a legal draft..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading || !prompt.trim()}
                            sx={{ 
                                padding: "12px",
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                        </Button>
                    </form>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {response && (
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            padding: 3,
                            backgroundColor: 'grey.50'
                        }}
                    >
                        <Typography variant="h6" gutterBottom color="primary">
                            Response:
                        </Typography>
                        <Typography 
                            sx={{ 
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6
                            }}
                        >
                            {response}
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Container>
    );
}

export default App;
