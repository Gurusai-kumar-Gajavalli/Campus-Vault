import { Router } from 'express';
import { supabaseAdmin, isDemoMode } from '../lib/supabaseAdmin.js';
import { mockVaults, mockEntries } from '../lib/mockStore.js';

const router = Router();

// GET /api/vaults — list all vaults with entry count
router.get('/', async (req, res) => {
  if (isDemoMode || !supabaseAdmin) {
    const vaultsWithCounts = mockVaults.map((v) => ({
      ...v,
      entry_count: mockEntries.filter((e) => e.vault_id === v.id).length
    }));
    return res.json(vaultsWithCounts);
  }

  const { data: vaults, error } = await supabaseAdmin.from('vaults').select('*');
  if (error) return res.status(500).json({ error: error.message });

  // Get entry counts per vault
  const { data: entries } = await supabaseAdmin.from('entries').select('vault_id');
  const counts = (entries || []).reduce((acc, curr) => {
    acc[curr.vault_id] = (acc[curr.vault_id] || 0) + 1;
    return acc;
  }, {});

  const enrichedVaults = vaults.map((v) => ({
    ...v,
    entry_count: counts[v.id] || 0
  }));

  res.json(enrichedVaults);
});

// GET /api/vaults/:slug — single vault metadata
router.get('/:slug', async (req, res) => {
  if (isDemoMode || !supabaseAdmin) {
    const vault = mockVaults.find((v) => v.slug === req.params.slug);
    if (!vault) return res.status(404).json({ error: 'Vault not found.' });
    return res.json({
      ...vault,
      entry_count: mockEntries.filter((e) => e.vault_id === vault.id).length
    });
  }

  const { data, error } = await supabaseAdmin
    .from('vaults')
    .select('*')
    .eq('slug', req.params.slug)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Vault not found.' });

  const { count } = await supabaseAdmin
    .from('entries')
    .select('id', { count: 'exact', head: true })
    .eq('vault_id', data.id);

  res.json({ ...data, entry_count: count ?? 0 });
});

export default router;
