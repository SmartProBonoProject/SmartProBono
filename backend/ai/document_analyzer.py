"""
Document Analysis AI Module for SmartProBono
This module provides document analysis capabilities using AI models.
"""

import os
import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple

# Placeholder for actual AI model integration
# In a production environment, you would use a real AI model API like OpenAI, HuggingFace, etc.

class DocumentAnalyzer:
    """
    Document analyzer class that provides AI-powered document analysis capabilities.
    """
    
    def __init__(self, model_name: str = "legal-document-analyzer-v1"):
        """
        Initialize the document analyzer with a specific model.
        
        Args:
            model_name: The name of the model to use for analysis
        """
        self.model_name = model_name
        self.api_key = os.environ.get('AI_API_KEY', 'demo_key')
        
        # Load document templates and patterns
        self._load_document_templates()
    
    def _load_document_templates(self):
        """Load document templates and patterns from JSON files."""
        try:
            # In a real implementation, you would load actual templates
            self.templates = {
                "contract": {
                    "sections": ["parties", "terms", "conditions", "termination", "signatures"],
                    "required_fields": ["party_names", "effective_date", "term_length"]
                },
                "legal_brief": {
                    "sections": ["summary", "facts", "issues", "arguments", "conclusion"],
                    "required_fields": ["case_number", "court", "parties", "date"]
                },
                "immigration_form": {
                    "sections": ["personal_info", "travel_history", "purpose", "declarations"],
                    "required_fields": ["full_name", "nationality", "passport_number", "visa_type"]
                }
            }
        except Exception as e:
            print(f"Error loading document templates: {e}")
            self.templates = {}
    
    def analyze_document(self, document_text: str, document_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze a document and extract key information.
        
        Args:
            document_text: The text content of the document
            document_type: Optional type of document to guide analysis
            
        Returns:
            Dictionary containing analysis results
        """
        # In a real implementation, you would call an actual AI model API
        # This is a simplified mock implementation
        
        result = {
            "timestamp": datetime.now().isoformat(),
            "model": self.model_name,
            "document_length": len(document_text),
            "analysis": {}
        }
        
        # Detect document type if not provided
        if not document_type:
            document_type = self._detect_document_type(document_text)
        
        result["document_type"] = document_type
        
        # Extract key information based on document type
        if document_type == "contract":
            result["analysis"] = self._analyze_contract(document_text)
        elif document_type == "legal_brief":
            result["analysis"] = self._analyze_legal_brief(document_text)
        elif document_type == "immigration_form":
            result["analysis"] = self._analyze_immigration_form(document_text)
        else:
            result["analysis"] = self._analyze_generic_document(document_text)
        
        # Add risk assessment
        result["risk_assessment"] = self._assess_document_risks(document_text, document_type)
        
        # Add readability metrics
        result["readability"] = self._calculate_readability(document_text)
        
        return result
    
    def _detect_document_type(self, text: str) -> str:
        """
        Detect the type of document based on its content.
        
        Args:
            text: The document text
            
        Returns:
            Detected document type
        """
        # In a real implementation, this would use ML classification
        # Simple keyword-based detection for demonstration
        text_lower = text.lower()
        
        if "agreement" in text_lower and "parties" in text_lower and "terms" in text_lower:
            return "contract"
        elif "court" in text_lower and "case" in text_lower and "argument" in text_lower:
            return "legal_brief"
        elif "immigration" in text_lower and "visa" in text_lower and "passport" in text_lower:
            return "immigration_form"
        else:
            return "unknown"
    
    def _analyze_contract(self, text: str) -> Dict[str, Any]:
        """Analyze a contract document."""
        # Mock implementation - in reality, would use NLP to extract entities and clauses
        parties = self._extract_parties(text)
        dates = self._extract_dates(text)
        
        return {
            "parties": parties,
            "effective_date": dates[0] if dates else None,
            "termination_date": dates[-1] if len(dates) > 1 else None,
            "key_clauses": self._extract_key_clauses(text),
            "obligations": self._extract_obligations(text),
            "governing_law": self._extract_governing_law(text)
        }
    
    def _analyze_legal_brief(self, text: str) -> Dict[str, Any]:
        """Analyze a legal brief document."""
        return {
            "case_info": self._extract_case_info(text),
            "legal_arguments": self._extract_legal_arguments(text),
            "cited_cases": self._extract_case_citations(text),
            "requested_relief": self._extract_requested_relief(text)
        }
    
    def _analyze_immigration_form(self, text: str) -> Dict[str, Any]:
        """Analyze an immigration form."""
        return {
            "applicant_info": self._extract_applicant_info(text),
            "visa_type": self._extract_visa_type(text),
            "travel_history": self._extract_travel_history(text),
            "supporting_documents": self._extract_supporting_documents(text)
        }
    
    def _analyze_generic_document(self, text: str) -> Dict[str, Any]:
        """Analyze a generic document when type is unknown."""
        return {
            "summary": self._generate_summary(text),
            "key_entities": self._extract_entities(text),
            "topics": self._extract_topics(text),
            "sentiment": self._analyze_sentiment(text)
        }
    
    def _assess_document_risks(self, text: str, document_type: str) -> Dict[str, Any]:
        """Assess potential risks in the document."""
        # In a real implementation, this would use AI to identify legal risks
        risks = []
        
        if document_type == "contract":
            # Check for common contract risks
            if "indemnification" in text.lower() and "unlimited" in text.lower():
                risks.append({
                    "type": "high_risk_clause",
                    "description": "Unlimited indemnification clause detected",
                    "severity": "high"
                })
            
            if not re.search(r"governing law|jurisdiction", text.lower()):
                risks.append({
                    "type": "missing_clause",
                    "description": "No governing law or jurisdiction clause found",
                    "severity": "medium"
                })
        
        return {
            "identified_risks": risks,
            "risk_score": len(risks) * 25 if risks else 0,  # Simple scoring
            "recommendations": self._generate_risk_recommendations(risks)
        }
    
    def _calculate_readability(self, text: str) -> Dict[str, Any]:
        """Calculate readability metrics for the document."""
        # Simplified readability calculation
        words = text.split()
        sentences = re.split(r'[.!?]+', text)
        avg_words_per_sentence = len(words) / max(len(sentences), 1)
        
        # Simplified Flesch Reading Ease calculation
        # In a real implementation, would use proper linguistic analysis
        long_words = sum(1 for word in words if len(word) > 6)
        long_word_percentage = long_words / max(len(words), 1) * 100
        
        # Mock score - higher is easier to read (0-100)
        readability_score = max(0, min(100, 100 - long_word_percentage - (avg_words_per_sentence * 2)))
        
        return {
            "score": readability_score,
            "grade_level": self._score_to_grade_level(readability_score),
            "avg_words_per_sentence": avg_words_per_sentence,
            "complex_word_percentage": long_word_percentage
        }
    
    def _score_to_grade_level(self, score: float) -> str:
        """Convert readability score to grade level."""
        if score >= 90:
            return "5th grade (very easy to read)"
        elif score >= 80:
            return "6th grade (easy to read)"
        elif score >= 70:
            return "7th grade (fairly easy to read)"
        elif score >= 60:
            return "8th-9th grade (plain English)"
        elif score >= 50:
            return "10th-12th grade (fairly difficult)"
        elif score >= 30:
            return "College (difficult)"
        else:
            return "College graduate (very difficult)"
    
    # Helper methods for entity extraction
    def _extract_parties(self, text: str) -> List[str]:
        """Extract party names from a contract."""
        # Mock implementation - would use NER in real application
        parties = []
        party_patterns = [
            r"(?:between|party of the first part|party of the second part)[:\s]+([A-Z][A-Za-z\s,]+)(?:,|and|of)",
            r"(?:This\s+[A-Za-z\s]+\s+is\s+made\s+between\s+)([A-Z][A-Za-z\s,]+)(?:,|and|of)"
        ]
        
        for pattern in party_patterns:
            matches = re.findall(pattern, text)
            parties.extend([match.strip() for match in matches if match.strip()])
        
        return parties[:2]  # Usually contracts have two main parties
    
    def _extract_dates(self, text: str) -> List[str]:
        """Extract dates from text."""
        # Simple date pattern matching - would use more robust methods in production
        date_patterns = [
            r"\d{1,2}/\d{1,2}/\d{2,4}",  # MM/DD/YYYY
            r"\d{1,2}-\d{1,2}-\d{2,4}",  # MM-DD-YYYY
            r"(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}"  # Month DD, YYYY
        ]
        
        dates = []
        for pattern in date_patterns:
            matches = re.findall(pattern, text)
            dates.extend(matches)
        
        return dates
    
    def _extract_key_clauses(self, text: str) -> List[Dict[str, str]]:
        """Extract key clauses from a contract."""
        # Mock implementation
        clauses = []
        clause_types = ["termination", "confidentiality", "non-compete", "payment", "liability"]
        
        for clause_type in clause_types:
            if clause_type.lower() in text.lower():
                # Find the paragraph containing this clause
                paragraphs = text.split('\n\n')
                for para in paragraphs:
                    if clause_type.lower() in para.lower():
                        clauses.append({
                            "type": clause_type,
                            "text": para[:100] + "..." if len(para) > 100 else para
                        })
                        break
        
        return clauses
    
    def _extract_obligations(self, text: str) -> Dict[str, List[str]]:
        """Extract obligations for each party."""
        # Mock implementation
        parties = self._extract_parties(text)
        obligations = {party: [] for party in parties}
        
        # Look for shall/must/agrees to statements
        obligation_patterns = [
            r"([A-Z][A-Za-z\s]+)\s+shall\s+([^\.;]+)",
            r"([A-Z][A-Za-z\s]+)\s+must\s+([^\.;]+)",
            r"([A-Z][A-Za-z\s]+)\s+agrees\s+to\s+([^\.;]+)"
        ]
        
        for pattern in obligation_patterns:
            matches = re.findall(pattern, text)
            for party_name, obligation in matches:
                party_name = party_name.strip()
                for party in parties:
                    if party_name in party or party in party_name:
                        obligations[party].append(obligation.strip())
        
        return obligations
    
    def _extract_governing_law(self, text: str) -> Optional[str]:
        """Extract governing law clause."""
        # Mock implementation
        law_patterns = [
            r"(?:governed by|subject to) the laws of\s+([^\.;]+)",
            r"(?:jurisdiction|venue)(?:\s+shall be)?\s+in\s+([^\.;]+)"
        ]
        
        for pattern in law_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None
    
    def _extract_case_info(self, text: str) -> Dict[str, str]:
        """Extract case information from a legal brief."""
        # Mock implementation
        case_number_match = re.search(r"[Cc]ase\s+[Nn]o\.?\s+([A-Z0-9-]+)", text)
        court_match = re.search(r"(?:IN THE |BEFORE THE )([A-Z][A-Za-z\s]+COURT[A-Za-z\s]*)", text)
        
        return {
            "case_number": case_number_match.group(1) if case_number_match else "Unknown",
            "court": court_match.group(1) if court_match else "Unknown"
        }
    
    def _extract_legal_arguments(self, text: str) -> List[str]:
        """Extract legal arguments from a brief."""
        # Mock implementation - would use more sophisticated NLP in reality
        arguments = []
        
        # Look for argument headers or keywords
        arg_patterns = [
            r"(?:ARGUMENT|DISCUSSION)(?:\s+[IVX]+)?\s*\n+([^#]+?)(?=\n\n|\Z)",
            r"(?:Plaintiff|Defendant|Appellant|Respondent)\s+(?:argues|contends)\s+that\s+([^\.;]+)"
        ]
        
        for pattern in arg_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.DOTALL)
            arguments.extend([match.strip() for match in matches if match.strip()])
        
        return arguments[:3]  # Return top 3 arguments
    
    def _extract_case_citations(self, text: str) -> List[str]:
        """Extract case citations from a legal brief."""
        # Mock implementation - would use legal citation parsers in reality
        citation_patterns = [
            r"(?:[A-Z][a-z]+\s+v\.\s+[A-Z][a-z]+),\s+\d+\s+[A-Z]\.[A-Z]\.[A-Za-z0-9]+\s+\d+\s+\(\d{4}\)",
            r"\d+\s+U\.S\.\s+\d+\s+\(\d{4}\)"
        ]
        
        citations = []
        for pattern in citation_patterns:
            matches = re.findall(pattern, text)
            citations.extend(matches)
        
        return citations
    
    def _extract_requested_relief(self, text: str) -> Optional[str]:
        """Extract requested relief from a legal brief."""
        # Mock implementation
        relief_patterns = [
            r"(?:WHEREFORE|PRAYER FOR RELIEF)(?:[^#]+?)(?=\n\n|\Z)",
            r"(?:plaintiff|defendant|appellant|respondent)\s+(?:requests|seeks|prays)\s+([^\.;]+)"
        ]
        
        for pattern in relief_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(0).strip()
        
        return None
    
    def _extract_applicant_info(self, text: str) -> Dict[str, str]:
        """Extract applicant information from an immigration form."""
        # Mock implementation
        name_match = re.search(r"(?:Name|Full Name):\s*([A-Za-z\s]+)", text, re.IGNORECASE)
        dob_match = re.search(r"(?:Date of Birth|DOB|Birth Date):\s*(\d{1,2}/\d{1,2}/\d{2,4})", text, re.IGNORECASE)
        nationality_match = re.search(r"(?:Nationality|Citizenship):\s*([A-Za-z\s]+)", text, re.IGNORECASE)
        
        return {
            "name": name_match.group(1).strip() if name_match else "Unknown",
            "date_of_birth": dob_match.group(1) if dob_match else "Unknown",
            "nationality": nationality_match.group(1).strip() if nationality_match else "Unknown"
        }
    
    def _extract_visa_type(self, text: str) -> Optional[str]:
        """Extract visa type from an immigration form."""
        # Mock implementation
        visa_match = re.search(r"(?:Visa Type|Visa Category):\s*([A-Z]-\d+|[A-Z]+)", text, re.IGNORECASE)
        
        if not visa_match:
            # Try to find common visa types
            common_visas = ["B-1", "B-2", "F-1", "H-1B", "J-1", "L-1", "O-1"]
            for visa in common_visas:
                if visa in text:
                    return visa
        else:
            return visa_match.group(1)
        
        return None
    
    def _extract_travel_history(self, text: str) -> List[Dict[str, str]]:
        """Extract travel history from an immigration form."""
        # Mock implementation - would use more sophisticated extraction in reality
        travel_history = []
        
        # Look for date patterns followed by country names
        travel_pattern = r"(\d{1,2}/\d{1,2}/\d{2,4})\s+(?:to|until)?\s+(?:\d{1,2}/\d{1,2}/\d{2,4})?\s+([A-Za-z\s]+)"
        matches = re.findall(travel_pattern, text)
        
        for date, country in matches:
            travel_history.append({
                "date": date,
                "country": country.strip()
            })
        
        return travel_history
    
    def _extract_supporting_documents(self, text: str) -> List[str]:
        """Extract list of supporting documents from an immigration form."""
        # Mock implementation
        doc_section_match = re.search(r"(?:Supporting Documents|Documents Provided|Attachments)(?:[:\s]+)([^#]+?)(?=\n\n|\Z)", text, re.IGNORECASE | re.DOTALL)
        
        if doc_section_match:
            doc_text = doc_section_match.group(1)
            # Split by bullet points, numbers, or newlines
            docs = re.split(r'(?:•|\d+\.|\n+)', doc_text)
            return [doc.strip() for doc in docs if doc.strip()]
        
        return []
    
    def _generate_summary(self, text: str) -> str:
        """Generate a summary of the document."""
        # Mock implementation - would use actual summarization model in production
        sentences = re.split(r'[.!?]+', text)
        
        # Extract first sentence and a couple from the middle and end
        summary_sentences = []
        if sentences:
            summary_sentences.append(sentences[0])
        
        if len(sentences) > 5:
            summary_sentences.append(sentences[len(sentences) // 2])
        
        if len(sentences) > 10:
            summary_sentences.append(sentences[-2])
        
        return " ".join(summary_sentences)
    
    def _extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract named entities from text."""
        # Mock implementation - would use NER models in production
        entities = {
            "people": [],
            "organizations": [],
            "locations": [],
            "dates": []
        }
        
        # Simple pattern matching for demonstration
        # People (capitalized names)
        people_matches = re.findall(r"([A-Z][a-z]+\s+[A-Z][a-z]+)", text)
        entities["people"] = list(set(people_matches))[:5]  # Limit to 5 unique names
        
        # Organizations (capitalized words ending in common suffixes)
        org_matches = re.findall(r"([A-Z][A-Za-z\s]+(?:Inc\.|Corp\.|LLC|Ltd\.|Company|Association|Organization))", text)
        entities["organizations"] = list(set(org_matches))[:5]
        
        # Locations (common place indicators)
        loc_matches = re.findall(r"(?:in|at|from|to)\s+([A-Z][a-z]+(?:,\s+[A-Z][a-z]+)?)", text)
        entities["locations"] = list(set(loc_matches))[:5]
        
        # Dates
        entities["dates"] = self._extract_dates(text)[:5]
        
        return entities
    
    def _extract_topics(self, text: str) -> List[str]:
        """Extract main topics from the document."""
        # Mock implementation - would use topic modeling in production
        # Count word frequencies and use as simple topic proxy
        words = re.findall(r'\b[a-z]{4,}\b', text.lower())
        word_counts = {}
        
        for word in words:
            if word not in ["this", "that", "with", "from", "have", "been"]:  # Skip common words
                word_counts[word] = word_counts.get(word, 0) + 1
        
        # Get top 5 words by frequency
        top_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        return [word for word, _ in top_words]
    
    def _analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of the document."""
        # Mock implementation - would use sentiment analysis models in production
        # Simple keyword-based approach
        positive_words = ["agree", "approve", "benefit", "favorable", "grant", "positive", "accept"]
        negative_words = ["disagree", "deny", "reject", "terminate", "violation", "dispute", "negative"]
        
        text_lower = text.lower()
        positive_count = sum(text_lower.count(word) for word in positive_words)
        negative_count = sum(text_lower.count(word) for word in negative_words)
        
        total = positive_count + negative_count
        if total == 0:
            sentiment_score = 0
        else:
            sentiment_score = (positive_count - negative_count) / total
        
        # Map to sentiment category
        if sentiment_score > 0.25:
            sentiment = "positive"
        elif sentiment_score < -0.25:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        return {
            "score": sentiment_score,
            "category": sentiment,
            "positive_indicators": positive_count,
            "negative_indicators": negative_count
        }
    
    def _generate_risk_recommendations(self, risks: List[Dict[str, str]]) -> List[str]:
        """Generate recommendations based on identified risks."""
        recommendations = []
        
        for risk in risks:
            if risk["type"] == "high_risk_clause" and "indemnification" in risk["description"]:
                recommendations.append("Consider limiting the scope of indemnification to reduce liability exposure")
            
            if risk["type"] == "missing_clause" and "governing law" in risk["description"]:
                recommendations.append("Add a governing law clause to specify which jurisdiction's laws apply to the agreement")
        
        # Add general recommendations if few specific ones
        if len(recommendations) < 2:
            recommendations.append("Have the document reviewed by legal counsel before finalizing")
            
        return recommendations

# Example usage
if __name__ == "__main__":
    analyzer = DocumentAnalyzer()
    
    # Example contract text
    sample_text = """
    AGREEMENT
    
    This Agreement is made on April 15, 2023, between ABC Corporation, a Delaware corporation ("Company"), and John Smith, an individual ("Consultant").
    
    1. SERVICES
    Consultant shall provide marketing consulting services to Company as described in Exhibit A.
    
    2. TERM
    This Agreement shall commence on April 20, 2023 and continue until October 20, 2023, unless terminated earlier.
    
    3. COMPENSATION
    Company shall pay Consultant $5,000 per month for services rendered.
    
    4. CONFIDENTIALITY
    Consultant shall maintain all confidential information in strict confidence.
    
    5. INDEMNIFICATION
    Consultant shall indemnify and hold Company harmless from any claims arising from Consultant's performance.
    
    6. TERMINATION
    Either party may terminate this Agreement with 30 days written notice.
    
    IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.
    
    ABC Corporation
    By: Jane Doe, CEO
    
    John Smith
    """
    
    # Analyze the document
    result = analyzer.analyze_document(sample_text)
    print(json.dumps(result, indent=2))
