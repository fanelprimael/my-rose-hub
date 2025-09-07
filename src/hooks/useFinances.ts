import { useState, useMemo } from "react";

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  studentId?: string;
}

export const useFinances = () => {
  const [records] = useState<FinanceRecord[]>([]);

  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear;
    });

    const monthly_income = monthlyRecords
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.amount, 0);

    const monthly_expenses = monthlyRecords
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + record.amount, 0);

    const total_income = records
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.amount, 0);

    const total_expenses = records
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + record.amount, 0);

    return {
      monthly_income,
      monthly_expenses,
      monthly_profit: monthly_income - monthly_expenses,
      total_income,
      total_expenses,
      total_profit: total_income - total_expenses,
    };
  }, [records]);

  return {
    records,
    stats,
  };
};