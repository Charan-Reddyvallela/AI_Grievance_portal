const natural = require('natural');
const franc = require('franc');

// Translation: use optional lib or pass-through (no external package to avoid install issues)

// Department keywords mapping
const departmentKeywords = {
  'Sanitation Department': [
    'garbage', 'waste', 'trash', 'cleanliness', 'dustbin', 'sewage', 'drainage', 
    'cleaning', 'sanitation', 'dump', 'litter', 'smell', 'dirty'
  ],
  'Electrical Department': [
    'street light', 'electricity', 'power', 'light', 'pole', 'wire', 'transformer',
    'voltage', 'connection', 'meter', 'short circuit', 'spark'
  ],
  'Water Department': [
    'water', 'pipeline', 'leakage', 'supply', 'tap', 'connection', 'drain',
    'overflow', 'contamination', 'pressure', 'shortage'
  ],
  'Roads Department': [
    'pothole', 'road', 'street', 'highway', 'traffic', 'bridge', 'footpath',
    'damaged', 'broken', 'repair', 'construction', 'speed breaker'
  ],
  'Healthcare Department': [
    'hospital', 'clinic', 'medical', 'doctor', 'health', 'medicine', 'emergency',
    'ambulance', 'treatment', 'patient', 'disease'
  ]
};

// Priority keywords mapping
const priorityKeywords = {
  'Red': [
    'urgent', 'accident', 'fire', 'danger', 'emergency', 'critical', 'life threatening',
    'hazardous', 'immediate', 'severe', 'serious', 'fatal'
  ],
  'Yellow': [
    'issue', 'problem', 'complaint', 'request', 'need', 'broken', 'not working',
    'damaged', 'leaking', 'blocked', 'overflow'
  ],
  'Green': [
    'resolved', 'fixed', 'completed', 'done', 'working', 'normal', 'regular',
    'minor', 'small', 'suggestion', 'improvement'
  ]
};

class AIProcessor {
  // Detect language of complaint text
  static async detectLanguage(text) {
    try {
      const langCode = franc(text);
      const languageMap = {
        'eng': 'English',
        'hin': 'Hindi',
        'ben': 'Bengali',
        'tam': 'Tamil',
        'tel': 'Telugu',
        'mar': 'Marathi',
        'guj': 'Gujarati',
        'kan': 'Kannada',
        'mal': 'Malayalam',
        'pan': 'Punjabi'
      };
      return languageMap[langCode] || 'English';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'English';
    }
  }

  // Translate text to English (pass-through when no translator; categorization still works on keywords)
  static async translateToEnglish(text, sourceLanguage) {
    if (sourceLanguage === 'English') return text;
    // Without external translation API: return as-is so AI categorization still runs on original text
    return text;
  }

  // Categorize complaint by department
  static categorizeDepartment(text) {
    const lowerText = text.toLowerCase();
    const scores = {};

    // Calculate score for each department
    for (const [department, keywords] of Object.entries(departmentKeywords)) {
      scores[department] = 0;
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          scores[department]++;
        }
      });
    }

    // Find department with highest score
    let bestDepartment = 'General Administration';
    let maxScore = 0;

    for (const [department, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestDepartment = department;
      }
    }

    return bestDepartment;
  }

  // Determine priority level
  static determinePriority(text) {
    const lowerText = text.toLowerCase();
    
    // Check for high priority keywords first
    for (const keyword of priorityKeywords.Red) {
      if (lowerText.includes(keyword)) {
        return 'Red';
      }
    }

    // Check for low priority keywords
    for (const keyword of priorityKeywords.Green) {
      if (lowerText.includes(keyword)) {
        return 'Green';
      }
    }

    // Default to medium priority
    return 'Yellow';
  }

  // Calculate text similarity for duplicate detection
  static calculateSimilarity(text1, text2) {
    try {
      // Tokenize and normalize both texts
      const tokenizer = new natural.WordTokenizer();
      const tokens1 = tokenizer.tokenize(text1.toLowerCase());
      const tokens2 = tokenizer.tokenize(text2.toLowerCase());

      // Remove stop words
      const stopWords = natural.stopwords;
      const filteredTokens1 = tokens1.filter(token => !stopWords.includes(token));
      const filteredTokens2 = tokens2.filter(token => !stopWords.includes(token));

      // Calculate Jaccard similarity
      const set1 = new Set(filteredTokens1);
      const set2 = new Set(filteredTokens2);
      
      const intersection = new Set([...set1].filter(x => set2.has(x)));
      const union = new Set([...set1, ...set2]);
      
      return intersection.size / union.size;
    } catch (error) {
      console.error('Similarity calculation error:', error);
      return 0;
    }
  }

  // Generate AI suggestions
  static generateSuggestions(text, department, priority) {
    const suggestions = {
      'Sanitation Department': {
        'Red': 'Your urgent sanitation issue has been forwarded to the Sanitation Department for immediate action.',
        'Yellow': 'Your complaint has been forwarded to the Sanitation Department for regular processing.',
        'Green': 'Your sanitation suggestion has been noted and forwarded to the Sanitation Department.'
      },
      'Electrical Department': {
        'Red': 'Your urgent electrical issue has been forwarded to the Electrical Department for immediate attention.',
        'Yellow': 'Your electrical complaint has been forwarded to the Electrical Department for inspection.',
        'Green': 'Your electrical issue has been resolved. Thank you for your patience.'
      },
      'Water Department': {
        'Red': 'Your urgent water issue has been forwarded to the Water Department for immediate resolution.',
        'Yellow': 'Your water complaint has been forwarded to the Water Department for investigation.',
        'Green': 'Your water issue has been resolved. Thank you for reporting.'
      },
      'Roads Department': {
        'Red': 'Your urgent road safety issue has been forwarded to the Roads Department for immediate action.',
        'Yellow': 'Your road complaint has been forwarded to the Roads Department for repair scheduling.',
        'Green': 'Your road issue has been resolved. Drive safely!'
      },
      'Healthcare Department': {
        'Red': 'Your urgent healthcare issue has been forwarded to the Healthcare Department for immediate attention.',
        'Yellow': 'Your healthcare concern has been forwarded to the Healthcare Department for review.',
        'Green': 'Your healthcare feedback has been noted. Thank you for your input.'
      }
    };

    return suggestions[department]?.[priority] || 
           `Your complaint has been forwarded to the ${department} for processing.`;
  }

  // Process complaint with AI
  static async processComplaint(complaintText) {
    try {
      // Detect language
      const detectedLanguage = await this.detectLanguage(complaintText);
      
      // Translate to English if needed
      const translatedText = await this.translateToEnglish(complaintText, detectedLanguage);
      
      // Categorize department
      const department = this.categorizeDepartment(translatedText);
      
      // Determine priority
      const priority = this.determinePriority(translatedText);
      
      // Generate suggestions
      const suggestions = this.generateSuggestions(translatedText, department, priority);
      
      return {
        original_language: detectedLanguage,
        translated_text: translatedText,
        department: department,
        priority_level: priority,
        ai_suggestions: suggestions
      };
    } catch (error) {
      console.error('AI processing error:', error);
      // Return default values if AI processing fails
      return {
        original_language: 'English',
        translated_text: complaintText,
        department: 'General Administration',
        priority_level: 'Yellow',
        ai_suggestions: 'Your complaint has been forwarded to the General Administration for processing.'
      };
    }
  }
}

module.exports = AIProcessor;
