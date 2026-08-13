import { TeamMember, EmailLogEntry } from '../types';
import { MONTH_NAMES, getBirthMonth } from '../utils/dateUtils';
import { MonthData } from '../components/BirthdayDistributionChart';
import { MonthlyEmailStats, DomainStats, DesignationStats } from '../components/MailAnalyticsGraph';

export interface DerivedAnalyticsData {
  // Birthday Distribution
  monthlyBirthdayData: MonthData[];
  totalWithBirthdays: number;
  peakMonth: MonthData | null;
  currentMonthCelebrants: TeamMember[];
  todayCelebrants: TeamMember[];

  // Mail Analytics
  monthlyEmailStats: MonthlyEmailStats[];
  domainStats: DomainStats[];
  designationStats: DesignationStats[];
  totalMembers: number;
  totalWithEmail: number;
  totalMissingEmail: number;
  overallCoveragePercent: number;

  // Delivery Health Metrics
  deliverySuccessCount: number;
  deliveryFailedCount: number;
  deliverySkippedCount: number;
  deliveryHealthRate: number;
  deliveryHealthPercent: string;
}

export function computeDerivedAnalytics(
  members: TeamMember[],
  emailLogs: EmailLogEntry[] = []
): DerivedAnalyticsData {
  const currentMonthIndex = new Date().getMonth();

  // 1. Compute Monthly Birthday Distribution (all 12 calendar months)
  const monthlyBirthdayData: MonthData[] = MONTH_NAMES.map((m, idx) => ({
    monthIndex: idx,
    shortName: m.short,
    fullName: m.full,
    count: 0,
    members: [],
    isCurrentMonth: idx === currentMonthIndex,
  }));

  const currentMonthCelebrants: TeamMember[] = [];
  const todayCelebrants: TeamMember[] = [];

  members.forEach((member) => {
    if (member.isBirthdayToday) {
      todayCelebrants.push(member);
    }
    const monthIdx = getBirthMonth(member.birthday);
    if (monthIdx !== null && monthIdx >= 0 && monthIdx <= 11) {
      monthlyBirthdayData[monthIdx].count += 1;
      monthlyBirthdayData[monthIdx].members.push(member);
      if (monthIdx === currentMonthIndex) {
        currentMonthCelebrants.push(member);
      }
    }
  });

  const totalWithBirthdays = monthlyBirthdayData.reduce((acc, curr) => acc + curr.count, 0);

  let maxCount = 0;
  let peakMonth: MonthData | null = null;
  monthlyBirthdayData.forEach((m) => {
    if (m.count > maxCount) {
      maxCount = m.count;
      peakMonth = m;
    }
  });

  // 2. Mail Analytics & Email Coverage Stats
  const monthlyEmailStats: MonthlyEmailStats[] = MONTH_NAMES.map((m, idx) => ({
    monthIndex: idx,
    shortName: m.short,
    fullName: m.full,
    totalBirthdays: 0,
    withEmail: 0,
    missingEmail: 0,
    coveragePercent: 0,
    members: [],
    isCurrentMonth: idx === currentMonthIndex,
  }));

  let totalWithEmail = 0;
  const domainCounts: Record<string, number> = {};
  let noEmailCount = 0;
  const desigMap: Record<string, { total: number; withEmail: number }> = {};

  members.forEach((member) => {
    const hasEmail = Boolean(member.email && member.email.trim().length > 0 && member.email.includes('@'));
    if (hasEmail) {
      totalWithEmail += 1;
      const parts = member.email.split('@');
      const dom = parts[1]?.toLowerCase().trim() || 'other';
      domainCounts[dom] = (domainCounts[dom] || 0) + 1;
    } else {
      noEmailCount += 1;
    }

    // Designation stats
    const desig = member.designation?.trim() || 'Unassigned';
    if (!desigMap[desig]) {
      desigMap[desig] = { total: 0, withEmail: 0 };
    }
    desigMap[desig].total += 1;
    if (hasEmail) {
      desigMap[desig].withEmail += 1;
    }

    // Monthly breakdown
    const monthIdx = getBirthMonth(member.birthday);
    if (monthIdx !== null && monthIdx >= 0 && monthIdx <= 11) {
      monthlyEmailStats[monthIdx].totalBirthdays += 1;
      monthlyEmailStats[monthIdx].members.push(member);
      if (hasEmail) {
        monthlyEmailStats[monthIdx].withEmail += 1;
      } else {
        monthlyEmailStats[monthIdx].missingEmail += 1;
      }
    }
  });

  monthlyEmailStats.forEach((item) => {
    item.coveragePercent = item.totalBirthdays > 0 
      ? Math.round((item.withEmail / item.totalBirthdays) * 100) 
      : 100;
  });

  const totalMembers = members.length;
  const totalMissingEmail = totalMembers - totalWithEmail;
  const overallCoveragePercent = totalMembers > 0 ? Math.round((totalWithEmail / totalMembers) * 100) : 0;

  // Domain stats
  const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  let colorIdx = 0;
  const domainStats: DomainStats[] = Object.entries(domainCounts).map(([dom, count]) => {
    const percentage = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
    const color = colors[colorIdx % colors.length];
    colorIdx++;
    return {
      domain: `@${dom}`,
      count,
      percentage,
      color,
    };
  });

  if (noEmailCount > 0) {
    domainStats.push({
      domain: 'Missing / Unset',
      count: noEmailCount,
      percentage: totalMembers > 0 ? Math.round((noEmailCount / totalMembers) * 100) : 0,
      color: '#94a3b8',
    });
  }
  domainStats.sort((a, b) => b.count - a.count);

  // Designation stats
  const designationStats: DesignationStats[] = Object.entries(desigMap).map(([designation, stats]) => ({
    designation,
    total: stats.total,
    withEmail: stats.withEmail,
    coveragePercent: stats.total > 0 ? Math.round((stats.withEmail / stats.total) * 100) : 0,
  })).sort((a, b) => b.total - a.total);

  // 3. Delivery Health Metrics from Logs
  const deliverySuccessCount = emailLogs.filter((l) => l.status === 'SUCCESS').length;
  const deliveryFailedCount = emailLogs.filter((l) => l.status === 'FAILED').length;
  const deliverySkippedCount = emailLogs.filter((l) => l.status === 'SKIPPED').length;
  const totalAttempts = deliverySuccessCount + deliveryFailedCount;
  const deliveryHealthRate = totalAttempts > 0 
    ? (deliverySuccessCount / totalAttempts) * 100 
    : 100.0;
  const deliveryHealthPercent = deliveryHealthRate.toFixed(1);

  return {
    monthlyBirthdayData,
    totalWithBirthdays,
    peakMonth,
    currentMonthCelebrants,
    todayCelebrants,
    monthlyEmailStats,
    domainStats,
    designationStats,
    totalMembers,
    totalWithEmail,
    totalMissingEmail,
    overallCoveragePercent,
    deliverySuccessCount,
    deliveryFailedCount,
    deliverySkippedCount,
    deliveryHealthRate,
    deliveryHealthPercent,
  };
}
