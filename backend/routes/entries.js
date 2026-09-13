import { Router } from 'express';
import { supabaseAdmin, isDemoMode } from '../lib/supabaseAdmin.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { mockEntries, mockVotes, mockComments } from '../lib/mockStore.js';

const router = Router();

// ── GET /api/entries — list entries for a vault with sorting and filtering ────
router.get('/', optionalAuth, async (req, res) => {
  const { vault_id, sort = 'top', year } = req.query;
  if (!vault_id) return res.status(400).json({ error: 'vault_id is required.' });

  if (isDemoMode || !supabaseAdmin) {
    let list = mockEntries.filter((e) => e.vault_id === vault_id);

    if (year === 'seniors') {
      list = list.filter((e) => e.author_year === '4th Year' || e.author_year === 'Alumni');
    } else if (year) {
      list = list.filter((e) => e.author_year === year);
    }

    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      list.sort((a, b) => b.vote_count - a.vote_count);
    }

    // Attach hasVoted and isOwner if viewer is signed in
    const viewerId = req.user?.id;
    const enriched = list.map((item) => ({
      ...item,
      hasVoted: viewerId ? mockVotes.some((v) => v.entry_id === item.id && v.user_id === viewerId) : false,
      isOwner: viewerId ? item.author_id === viewerId : false,
      comment_count: mockComments.filter((c) => c.entry_id === item.id).length
    }));

    return res.json(enriched);
  }

  let query = supabaseAdmin
    .from('entries_with_votes')
    .select('*')
    .eq('vault_id', vault_id);

  if (year === 'seniors') {
    query = query.in('author_year', ['4th Year', 'Alumni']);
  } else if (year) {
    query = query.eq('author_year', year);
  }

  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('vote_count', { ascending: false }).order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  // Attach hasVoted for the viewer if signed in
  let userVotes = new Set();
  if (req.user) {
    const { data: votes } = await supabaseAdmin
      .from('votes')
      .select('entry_id')
      .eq('user_id', req.user.id);
    if (votes) {
      votes.forEach((v) => userVotes.add(v.entry_id));
    }
  }

  const enriched = (data || []).map((e) => ({
    ...e,
    hasVoted: userVotes.has(e.id),
    isOwner: req.user ? req.user.id === e.author_id : false
  }));

  res.json(enriched);
});

// ── GET /api/entries/search — cross-vault title and content search ───────────
router.get('/search', async (req, res) => {
  const q = (req.query.q ?? '').trim();
  if (!q) return res.json([]);

  if (isDemoMode || !supabaseAdmin) {
    const term = q.toLowerCase();
    const results = mockEntries
      .filter((e) => e.title.toLowerCase().includes(term) || e.content.toLowerCase().includes(term))
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 8);
    return res.json(results);
  }

  const { data, error } = await supabaseAdmin
    .from('entries_with_votes')
    .select('*')
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    .order('vote_count', { ascending: false })
    .limit(8);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── GET /api/entries/:id — single entry detail ──────────────────────────────
router.get('/:id', optionalAuth, async (req, res) => {
  const entryId = req.params.id;

  if (isDemoMode || !supabaseAdmin) {
    const entry = mockEntries.find((e) => e.id === entryId);
    if (!entry) return res.status(404).json({ error: 'Entry not found.' });

    const viewerId = req.user?.id;
    const hasVoted = viewerId ? mockVotes.some((v) => v.entry_id === entryId && v.user_id === viewerId) : false;
    const isOwner = viewerId ? entry.author_id === viewerId : false;

    return res.json({
      ...entry,
      hasVoted,
      isOwner,
      comment_count: mockComments.filter((c) => c.entry_id === entryId).length
    });
  }

  const { data: entry, error } = await supabaseAdmin
    .from('entries_with_votes')
    .select('*')
    .eq('id', entryId)
    .single();

  if (error || !entry) return res.status(404).json({ error: 'Entry not found.' });

  let hasVoted = false;
  let isOwner = false;

  if (req.user) {
    isOwner = req.user.id === entry.author_id;
    const { data: vote } = await supabaseAdmin
      .from('votes')
      .select('id')
      .eq('entry_id', entryId)
      .eq('user_id', req.user.id)
      .maybeSingle();
    hasVoted = !!vote;
  }

  res.json({ ...entry, hasVoted, isOwner });
});

// ── POST /api/entries — create a new entry (requires sign-in) ────────────────
router.post('/', requireAuth, async (req, res) => {
  const { vault_id, title, content, resource_url } = req.body;

  if (!vault_id || !title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Vault, title, and content are required.' });
  }

  if (isDemoMode || !supabaseAdmin) {
    const newEntry = {
      id: 'e_' + Date.now(),
      vault_id,
      author_id: req.user.id,
      author_name: req.user.user_metadata?.name || 'Student Contributor',
      author_year: req.user.user_metadata?.year || '4th Year',
      author_branch: req.user.user_metadata?.branch || 'CSE',
      title: title.trim(),
      content: content.trim(),
      resource_url: resource_url?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vote_count: 0
    };
    mockEntries.unshift(newEntry);
    return res.status(201).json(newEntry);
  }

  const { data, error } = await supabaseAdmin
    .from('entries')
    .insert({
      vault_id,
      title: title.trim(),
      content: content.trim(),
      resource_url: resource_url?.trim() || null,
      author_id: req.user.id
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Return full view representation
  const { data: viewData } = await supabaseAdmin
    .from('entries_with_votes')
    .select('*')
    .eq('id', data.id)
    .single();

  res.status(201).json(viewData || data);
});

// ── PUT /api/entries/:id — edit an entry (requires author ownership) ─────────
router.put('/:id', requireAuth, async (req, res) => {
  const entryId = req.params.id;
  const { title, content, resource_url } = req.body;

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Title and content cannot be empty.' });
  }

  if (isDemoMode || !supabaseAdmin) {
    const entry = mockEntries.find((e) => e.id === entryId);
    if (!entry) return res.status(404).json({ error: 'Entry not found.' });
    if (entry.author_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to edit this entry.' });
    }

    entry.title = title.trim();
    entry.content = content.trim();
    entry.resource_url = resource_url?.trim() || null;
    entry.updated_at = new Date().toISOString();

    return res.json(entry);
  }

  // Check ownership
  const { data: existing, error: findError } = await supabaseAdmin
    .from('entries')
    .select('author_id')
    .eq('id', entryId)
    .single();

  if (findError || !existing) return res.status(404).json({ error: 'Entry not found.' });
  if (existing.author_id !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorized to edit this entry.' });
  }

  const { data, error } = await supabaseAdmin
    .from('entries')
    .update({
      title: title.trim(),
      content: content.trim(),
      resource_url: resource_url?.trim() || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const { data: viewData } = await supabaseAdmin
    .from('entries_with_votes')
    .select('*')
    .eq('id', entryId)
    .single();

  res.json(viewData || data);
});

// ── DELETE /api/entries/:id — delete an entry (requires author ownership) ─────
router.delete('/:id', requireAuth, async (req, res) => {
  const entryId = req.params.id;

  if (isDemoMode || !supabaseAdmin) {
    const index = mockEntries.findIndex((e) => e.id === entryId);
    if (index === -1) return res.status(404).json({ error: 'Entry not found.' });
    if (mockEntries[index].author_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this entry.' });
    }

    mockEntries.splice(index, 1);
    // Cleanup votes & comments
    for (let i = mockVotes.length - 1; i >= 0; i--) {
      if (mockVotes[i].entry_id === entryId) mockVotes.splice(i, 1);
    }
    for (let i = mockComments.length - 1; i >= 0; i--) {
      if (mockComments[i].entry_id === entryId) mockComments.splice(i, 1);
    }

    return res.json({ success: true, message: 'Entry deleted successfully.' });
  }

  const { data: existing, error: findError } = await supabaseAdmin
    .from('entries')
    .select('author_id')
    .eq('id', entryId)
    .single();

  if (findError || !existing) return res.status(404).json({ error: 'Entry not found.' });
  if (existing.author_id !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorized to delete this entry.' });
  }

  const { error } = await supabaseAdmin.from('entries').delete().eq('id', entryId);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, message: 'Entry deleted successfully.' });
});

// ── POST /api/entries/:id/vote — toggle upvote ────────────────────────────────
router.post('/:id/vote', requireAuth, async (req, res) => {
  const entryId = req.params.id;

  if (isDemoMode || !supabaseAdmin) {
    const entry = mockEntries.find((e) => e.id === entryId);
    if (!entry) return res.status(404).json({ error: 'Entry not found.' });

    const existingVoteIndex = mockVotes.findIndex(
      (v) => v.entry_id === entryId && v.user_id === req.user.id
    );

    let hasVoted = false;
    if (existingVoteIndex !== -1) {
      mockVotes.splice(existingVoteIndex, 1);
      entry.vote_count = Math.max(0, entry.vote_count - 1);
      hasVoted = false;
    } else {
      mockVotes.push({ entry_id: entryId, user_id: req.user.id });
      entry.vote_count += 1;
      hasVoted = true;
    }

    return res.json({ hasVoted, vote_count: entry.vote_count });
  }

  const { data: existing } = await supabaseAdmin
    .from('votes')
    .select('id')
    .eq('entry_id', entryId)
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin.from('votes').delete().eq('id', existing.id);
  } else {
    await supabaseAdmin.from('votes').insert({ entry_id: entryId, user_id: req.user.id });
  }

  const { count } = await supabaseAdmin
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('entry_id', entryId);

  res.json({ hasVoted: !existing, vote_count: count ?? 0 });
});

// ── GET /api/entries/:id/comments — list comments with author profiles ────────
router.get('/:id/comments', optionalAuth, async (req, res) => {
  const entryId = req.params.id;

  if (isDemoMode || !supabaseAdmin) {
    const comments = mockComments
      .filter((c) => c.entry_id === entryId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((c) => ({
        ...c,
        isOwner: req.user ? c.author_id === req.user.id : false
      }));
    return res.json(comments);
  }

  const { data, error } = await supabaseAdmin
    .from('comments_with_author')
    .select('*')
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const enriched = (data || []).map((c) => ({
    ...c,
    isOwner: req.user ? c.author_id === req.user.id : false
  }));

  res.json(enriched);
});

// ── POST /api/entries/:id/comments — add a comment ───────────────────────────
router.post('/:id/comments', requireAuth, async (req, res) => {
  const entryId = req.params.id;
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ error: 'Comment content cannot be empty.' });
  }

  if (isDemoMode || !supabaseAdmin) {
    const newComment = {
      id: 'c_' + Date.now(),
      entry_id: entryId,
      author_id: req.user.id,
      author_name: req.user.user_metadata?.name || 'Student',
      author_year: req.user.user_metadata?.year || '2nd Year',
      author_branch: req.user.user_metadata?.branch || 'CSE',
      content: content.trim(),
      created_at: new Date().toISOString(),
      isOwner: true
    };
    mockComments.push(newComment);
    return res.status(201).json(newComment);
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .insert({
      entry_id: entryId,
      content: content.trim(),
      author_id: req.user.id
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Get view data with author details
  const { data: viewData } = await supabaseAdmin
    .from('comments_with_author')
    .select('*')
    .eq('id', data.id)
    .single();

  res.status(201).json({ ...(viewData || data), isOwner: true });
});

// ── DELETE /api/entries/:id/comments/:commentId — delete a comment ───────────
router.delete('/:id/comments/:commentId', requireAuth, async (req, res) => {
  const { commentId } = req.params;

  if (isDemoMode || !supabaseAdmin) {
    const index = mockComments.findIndex((c) => c.id === commentId);
    if (index === -1) return res.status(404).json({ error: 'Comment not found.' });
    if (mockComments[index].author_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
    }
    mockComments.splice(index, 1);
    return res.json({ success: true, message: 'Comment deleted.' });
  }

  const { data: existing, error: findError } = await supabaseAdmin
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .single();

  if (findError || !existing) return res.status(404).json({ error: 'Comment not found.' });
  if (existing.author_id !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
  }

  const { error } = await supabaseAdmin.from('comments').delete().eq('id', commentId);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, message: 'Comment deleted.' });
});

export default router;
