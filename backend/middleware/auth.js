import { supabaseAdmin, isDemoMode } from '../lib/supabaseAdmin.js';

// Verifies the Supabase JWT per request and attaches the user to req.user.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Sign in required to perform this action.' });
  }

  if (isDemoMode || !supabaseAdmin) {
    if (token.startsWith('demo_user_')) {
      const parts = token.split(':');
      req.user = {
        id: parts[0],
        email: `${parts[1] || 'student'}@srmist.edu.in`,
        user_metadata: {
          name: decodeURIComponent(parts[1] || 'Student Contributor'),
          year: decodeURIComponent(parts[2] || '4th Year'),
          branch: decodeURIComponent(parts[3] || 'CSE')
        }
      };
    } else {
      req.user = {
        id: 'user_current_demo',
        email: 'student@srmist.edu.in',
        user_metadata: {
          name: 'Priyansh Verma',
          year: '4th Year',
          branch: 'CSE-AIML'
        }
      };
    }
    return next();
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }

  req.user = data.user;
  next();
}

// Optional auth: Attaches req.user if a valid token is provided without failing
export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  if (isDemoMode || !supabaseAdmin) {
    if (token.startsWith('demo_user_')) {
      const parts = token.split(':');
      req.user = {
        id: parts[0],
        email: `${parts[1] || 'student'}@srmist.edu.in`,
        user_metadata: {
          name: decodeURIComponent(parts[1] || 'Student Contributor'),
          year: decodeURIComponent(parts[2] || '4th Year'),
          branch: decodeURIComponent(parts[3] || 'CSE')
        }
      };
    } else {
      req.user = {
        id: 'user_current_demo',
        email: 'student@srmist.edu.in',
        user_metadata: {
          name: 'Priyansh Verma',
          year: '4th Year',
          branch: 'CSE-AIML'
        }
      };
    }
    return next();
  }

  const { data } = await supabaseAdmin.auth.getUser(token);
  req.user = data?.user ?? null;
  next();
}
