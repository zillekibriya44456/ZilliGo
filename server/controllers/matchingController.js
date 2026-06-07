const pool = require('../utils/db');

/**
 * AI Compatibility Engine API
 * Calculates similarity vectors between users based on interests, languages, and travel goals.
 */
const matchingController = {
  
  // Calculate compatibility between two users
  // In a real AI system, this would use vector embeddings and a model like OpenAI text-embedding-3.
  // Here we use a deterministic weighted heuristic algorithm.
  calculateCompatibility: (userA, userB) => {
    let score = 0;
    const sharedInterests = [];
    const sharedLanguages = [];

    // 1. Interest Overlap (Weight: 50%)
    if (userA.interests && userB.interests) {
      userA.interests.forEach(interest => {
        if (userB.interests.includes(interest)) {
          score += 15; // Each shared interest gives 15 points
          sharedInterests.push(interest);
        }
      });
    }

    // 2. Language Matching (Weight: 30%)
    // E.g., User A wants to learn what User B speaks natively, or both speak the same language.
    if (userA.languages && userB.languages) {
      userA.languages.forEach(langA => {
        userB.languages.forEach(langB => {
          if (langA.language_code === langB.language_code) {
            sharedLanguages.push(langA.language_code);
            // If one is learning and one is native, high compatibility!
            if ((langA.proficiency === 'learning' && langB.proficiency === 'native') || 
                (langB.proficiency === 'learning' && langA.proficiency === 'native')) {
              score += 25;
            } else if (langA.proficiency === langB.proficiency) {
              score += 10;
            }
          }
        });
      });
    }

    // 3. Explorer Type Overlap (Weight: 20%)
    if (userA.explorer_type === userB.explorer_type) {
      score += 20;
    }

    // Cap the score at 99% (Nobody is perfect except the AI)
    const finalScore = Math.min(Math.floor(score), 99);

    // Generate AI Icebreaker based on the strongest connection point
    let icebreaker = "Say hello and ask how their day is going!";
    if (sharedInterests.length > 0) {
      icebreaker = `You both love ${sharedInterests[0]}. Ask them about their favorite experience related to it!`;
    } else if (sharedLanguages.length > 0) {
      icebreaker = `You both practice ${sharedLanguages[0]}. Try sending your first message in that language!`;
    } else if (userA.explorer_type === userB.explorer_type) {
      icebreaker = `You are both ${userA.explorer_type}s! Ask them about their favorite destination they've explored.`;
    }

    return {
      score: Math.max(finalScore, 40), // Minimum baseline score
      sharedInterests,
      sharedLanguages,
      icebreaker
    };
  },

  // GET /api/matching/suggestions/:userId
  getSuggestions: async (req, res) => {
    const { userId } = req.params;

    try {
      // 1. Fetch current user data
      const userRes = await pool.query(`
        SELECT u.id, u.name, p.country_code, p.explorer_type, p.bio 
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id = $1
      `, [userId]);

      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentUser = userRes.rows[0];

      // Fetch interests
      const interestsRes = await pool.query('SELECT interest FROM user_interests WHERE user_id = $1', [userId]);
      currentUser.interests = interestsRes.rows.map(row => row.interest);

      // Fetch languages
      const langRes = await pool.query('SELECT language_code, proficiency FROM user_languages WHERE user_id = $1', [userId]);
      currentUser.languages = langRes.rows;

      // 2. Fetch potential matches (excluding self and existing friends)
      const potentialMatchesRes = await pool.query(`
        SELECT u.id, u.name, u.avatar, p.country_code as country, p.explorer_type, p.bio
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id != $1
        AND u.id NOT IN (
          SELECT user_id_2 FROM friendships WHERE user_id_1 = $1
          UNION
          SELECT user_id_1 FROM friendships WHERE user_id_2 = $1
        )
        LIMIT 50
      `, [userId]);

      const suggestions = [];

      // 3. Process matches through the compatibility engine
      for (let potentialUser of potentialMatchesRes.rows) {
        // Fetch their interests and languages
        const pInterests = await pool.query('SELECT interest FROM user_interests WHERE user_id = $1', [potentialUser.id]);
        potentialUser.interests = pInterests.rows.map(row => row.interest);

        const pLangs = await pool.query('SELECT language_code, proficiency FROM user_languages WHERE user_id = $1', [potentialUser.id]);
        potentialUser.languages = pLangs.rows;

        // Calculate score
        const compatibility = matchingController.calculateCompatibility(currentUser, potentialUser);

        suggestions.push({
          id: potentialUser.id,
          name: potentialUser.name,
          avatar: potentialUser.avatar,
          country: potentialUser.country,
          explorerType: potentialUser.explorer_type,
          bio: potentialUser.bio,
          matchScore: compatibility.score,
          sharedInterests: compatibility.sharedInterests,
          sharedLanguages: compatibility.sharedLanguages,
          aiIcebreaker: compatibility.icebreaker
        });
      }

      // 4. Sort by highest score and return top 10
      suggestions.sort((a, b) => b.matchScore - a.matchScore);
      
      res.json(suggestions.slice(0, 10));

    } catch (err) {
      console.error('Error generating AI suggestions:', err);
      res.status(500).json({ error: 'Failed to generate friend suggestions' });
    }
  }
};

module.exports = matchingController;
