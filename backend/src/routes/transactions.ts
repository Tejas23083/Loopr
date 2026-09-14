import { Router, Response } from 'express';
import { Parser } from 'json2csv';
import Transaction from '../models/Transaction';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// All transaction routes require authentication
router.use(authenticate);

// GET /api/transactions
// Supports: search, category, status, user_id, dateFrom, dateTo, minAmount, maxAmount,
//           sortBy, sortOrder, page, limit
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      status,
      user_id,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount,
      sortBy = 'date',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (user_id) filter.user_id = user_id;

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) (filter.date as Record<string, Date>)['$gte'] = new Date(dateFrom);
      if (dateTo) (filter.date as Record<string, Date>)['$lte'] = new Date(dateTo);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) (filter.amount as Record<string, number>)['$gte'] = parseFloat(minAmount);
      if (maxAmount) (filter.amount as Record<string, number>)['$lte'] = parseFloat(maxAmount);
    }

    if (search) {
      filter['$or'] = [
        { user_id: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const sortObj: Record<string, 1 | -1> = {};
    const validSortFields = ['date', 'amount', 'category', 'status', 'user_id', 'id'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';
    sortObj[sortField] = sortOrder === 'asc' ? 1 : -1;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/transactions/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOne({ id: parseInt(req.params.id as string) }).lean();
    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/transactions/export/csv
// Body: { columns: string[], filters: {...} }
router.post('/export/csv', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { columns, filters = {} } = req.body as {
      columns: string[];
      filters?: Record<string, unknown>;
    };

    const allowedColumns = ['id', 'date', 'amount', 'category', 'status', 'user_id'];
    const selectedColumns = (columns && columns.length > 0)
      ? columns.filter((c) => allowedColumns.includes(c))
      : allowedColumns;

    if (selectedColumns.length === 0) {
      res.status(400).json({ success: false, message: 'No valid columns selected' });
      return;
    }

    // Build same filter as list endpoint
    const filter: Record<string, unknown> = {};
    const f = filters as Record<string, string>;

    if (f.category) filter.category = f.category;
    if (f.status) filter.status = f.status;
    if (f.user_id) filter.user_id = f.user_id;

    if (f.dateFrom || f.dateTo) {
      filter.date = {};
      if (f.dateFrom) (filter.date as Record<string, Date>)['$gte'] = new Date(f.dateFrom);
      if (f.dateTo) (filter.date as Record<string, Date>)['$lte'] = new Date(f.dateTo);
    }

    if (f.minAmount || f.maxAmount) {
      filter.amount = {};
      if (f.minAmount) (filter.amount as Record<string, number>)['$gte'] = parseFloat(f.minAmount);
      if (f.maxAmount) (filter.amount as Record<string, number>)['$lte'] = parseFloat(f.maxAmount);
    }

    if (f.search) {
      filter['$or'] = [
        { user_id: { $regex: f.search, $options: 'i' } },
        { category: { $regex: f.search, $options: 'i' } },
        { status: { $regex: f.search, $options: 'i' } },
      ];
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 }).lean();

    // Format data for CSV
    const data = transactions.map((t) => {
      const row: Record<string, unknown> = {};
      selectedColumns.forEach((col) => {
        if (col === 'date') {
          row[col] = new Date(t.date).toISOString().split('T')[0];
        } else if (col === 'amount') {
          row[col] = `$${(t.amount as number).toFixed(2)}`;
        } else {
          row[col] = (t as unknown as Record<string, unknown>)[col];
        }
      });
      return row;
    });

    const fieldLabels: Record<string, string> = {
      id: 'ID',
      date: 'Date',
      amount: 'Amount',
      category: 'Category',
      status: 'Status',
      user_id: 'User ID',
    };

    const fields = selectedColumns.map((col) => ({
      label: fieldLabels[col] || col,
      value: col,
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ success: false, message: 'Server error during CSV export' });
  }
});

export default router;
