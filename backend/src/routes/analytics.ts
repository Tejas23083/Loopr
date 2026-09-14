import { Router, Response } from 'express';
import Transaction from '../models/Transaction';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/analytics/summary
// Returns: totalRevenue, totalExpenses, balance, savings, transactionCount
router.get('/summary', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [revenueResult, expenseResult, totalCount] = await Promise.all([
      Transaction.aggregate([
        { $match: { category: 'Revenue' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { category: 'Expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.countDocuments(),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const totalExpenses = expenseResult[0]?.total || 0;
    const balance = totalRevenue - totalExpenses;
    const savings = balance > 0 ? balance * 0.3 : 0; // 30% of balance as savings

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        savings: Math.round(savings * 100) / 100,
        transactionCount: totalCount,
      },
    });
  } catch (error) {
    console.error('Summary analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/analytics/monthly
// Returns monthly revenue and expenses for the current year
router.get('/monthly', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = parseInt((req.query.year as string) || new Date().getFullYear().toString());

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31T23:59:59`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            category: '$category',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    // Build 12-month array
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map((month, index) => {
      const monthNum = index + 1;
      const revenue = monthlyData.find(
        (d) => d._id.month === monthNum && d._id.category === 'Revenue'
      )?.total || 0;
      const expenses = monthlyData.find(
        (d) => d._id.month === monthNum && d._id.category === 'Expense'
      )?.total || 0;
      return { month, revenue: Math.round(revenue), expenses: Math.round(expenses) };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Monthly analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/analytics/category-breakdown
router.get('/category-breakdown', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const breakdown = await Transaction.aggregate([
      {
        $group: {
          _id: { category: '$category', status: '$status' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const revenue = breakdown
      .filter((b) => b._id.category === 'Revenue')
      .reduce((acc, b) => ({ ...acc, [b._id.status]: b.total, count: (acc.count || 0) + b.count }), {} as Record<string, number>);
    const expense = breakdown
      .filter((b) => b._id.category === 'Expense')
      .reduce((acc, b) => ({ ...acc, [b._id.status]: b.total, count: (acc.count || 0) + b.count }), {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        revenue,
        expense,
        raw: breakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/analytics/recent
router.get('/recent', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recent = await Transaction.find()
      .sort({ date: -1 })
      .limit(5)
      .lean();
    res.json({ success: true, data: recent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
