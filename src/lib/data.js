/**
 * Élour Pay — Data Layer
 * Calls real API. Falls back to mock data when database is empty.
 * Once real data exists, mock data disappears automatically.
 */

import { apiFetch } from './supabase';
import * as Mock from './mock';

// ── Transactions ──────────────────────────────────────────────────────────────
export async function getTransactions({ search = '', status = 'all', page = 1, limit = 20 } = {}) {
  try {
    const params = new URLSearchParams({ page, limit });
    if (search)           params.set('search', search);
    if (status !== 'all') params.set('status', status);

    const res = await apiFetch(`/api/transactions?${params}`);
    const data = res.data || [];

    // Fall back to filtered mock if DB empty
    if (data.length === 0) {
      const filtered = Mock.TRANSACTIONS.filter(t => {
        const matchSearch = !search ||
          t.customer.toLowerCase().includes(search.toLowerCase()) ||
          t.id.includes(search) || t.email.includes(search);
        return matchSearch && (status === 'all' || t.status === status);
      });
      return { data: filtered, meta: { total: filtered.length, page, limit }, isMock: true };
    }

    return { data, meta: res.meta || { total: data.length, page, limit }, isMock: false };
  } catch {
    // Network error — use mock
    const filtered = Mock.TRANSACTIONS.filter(t => {
      const matchSearch = !search ||
        t.customer.toLowerCase().includes(search.toLowerCase()) ||
        t.id.includes(search);
      return matchSearch && (status === 'all' || t.status === status);
    });
    return { data: filtered, meta: { total: filtered.length, page, limit }, isMock: true };
  }
}

// ── Orders ────────────────────────────────────────────────────────────────────
export async function getOrders({ search = '', status = 'all', page = 1, limit = 20 } = {}) {
  try {
    const params = new URLSearchParams({ page, limit });
    if (search)           params.set('search', search);
    if (status !== 'all') params.set('status', status);

    const res = await apiFetch(`/api/orders?${params}`);
    const data = res.data || [];

    if (data.length === 0) {
      const filtered = Mock.ORDERS.filter(o => {
        const ok = !search ||
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          o.orderId.includes(search) ||
          o.city.toLowerCase().includes(search.toLowerCase());
        return ok && (status === 'all' || o.status === status);
      });
      return { data: filtered, meta: { total: filtered.length }, isMock: true };
    }

    return { data, meta: res.meta || { total: data.length }, isMock: false };
  } catch {
    return { data: Mock.ORDERS, meta: { total: Mock.ORDERS.length }, isMock: true };
  }
}

// ── Analytics summary ─────────────────────────────────────────────────────────
export async function getSummary() {
  try {
    const res = await apiFetch('/api/analytics/summary');
    const today = res.data?.today || {};

    // If all zeros, use mock
    if (!today.revenue && !today.orders) {
      return { data: getMockSummary(), isMock: true };
    }

    return { data: res.data, isMock: false };
  } catch {
    return { data: getMockSummary(), isMock: true };
  }
}

function getMockSummary() {
  return {
    today: {
      revenue:         167000,
      orders:          42,
      successful_txns: 38,
      failed_txns:     2,
      refund_amount:   15600,
      pending:         2,
    },
    yesterday: { revenue: 148200, orders: 37 },
  };
}

// ── Analytics revenue chart ───────────────────────────────────────────────────
export async function getRevenue(days = 14) {
  try {
    const res = await apiFetch(`/api/analytics/revenue?days=${days}`);
    const data = res.data || [];

    if (data.length === 0) {
      return { data: Mock.REVENUE.slice(-days), labels: Mock.DAYS.slice(-days), isMock: true };
    }

    return {
      data:   data.map(d => parseFloat(d.total_revenue || 0)),
      labels: data.map(d => new Date(d.stat_date).toLocaleDateString('en-PK', { month:'short', day:'numeric' })),
      isMock: false,
    };
  } catch {
    return { data: Mock.REVENUE.slice(-days), labels: Mock.DAYS.slice(-days), isMock: true };
  }
}

// ── Analytics banks ───────────────────────────────────────────────────────────
export async function getBanks() {
  try {
    const res = await apiFetch('/api/analytics/banks');
    const data = res.data || [];

    if (data.length === 0) {
      return { data: Mock.BANKS, isMock: true };
    }

    return { data, isMock: false };
  } catch {
    return { data: Mock.BANKS, isMock: true };
  }
}

// ── Refunds ───────────────────────────────────────────────────────────────────
export async function getRefunds() {
  try {
    const res = await apiFetch('/api/refunds');
    const data = res.data || [];

    if (data.length === 0) {
      return { data: Mock.REFUNDS, isMock: true };
    }

    return { data, isMock: false };
  } catch {
    return { data: Mock.REFUNDS, isMock: true };
  }
}

export async function createRefund({ transaction_id, amount, reason }) {
  return apiFetch('/api/refunds', {
    method: 'POST',
    body: JSON.stringify({ transaction_id, amount, reason }),
  });
}
