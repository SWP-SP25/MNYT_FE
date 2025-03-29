"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "./components/admin-layout";
import { Card, CardBody } from "@nextui-org/react";
import { Tabs } from "antd";
import styles from "./page.module.css";
import { BsPersonFill, BsHeart, BsChat, BsGraphUp } from "react-icons/bs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { AccountListResponse } from "@/types/accountsView";
import { MembershipSales } from "@/types/membership-sales";
import { Blogmanage } from "@/types/blogAdmin";
import { MembershipPlans } from "@/types/membershipPlan";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Daily Statistics'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor: string | string[];
    tension?: number;
  }[];
}

interface Account {
  id: number;
  createDate?: string;
  role: string;
}

interface MembershipSale {
  startDate?: string;
  amount: number;
}

interface BlogPost {
  createDate?: string;
  likeCount: number;
  commentCount: number;
}

interface ExtendedMembershipSales extends MembershipSales {
  startDate?: string;
}

interface ExtendedBlogManage extends Blogmanage {
  createDate?: string;
}

interface MembershipDistribution {
  membershipId: number;
  count: number;
}

const AdminDashboard = () => {
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [salesLoading, setSalesLoading] = useState<boolean>(true);
  const [blogStatsLoading, setBlogStatsLoading] = useState<boolean>(true);
  const [registrationPeriod, setRegistrationPeriod] = useState<'day' | 'month' | 'year'>('month');
  const [salesPeriod, setSalesPeriod] = useState<'day' | 'month' | 'year'>('month');
  const [blogPeriod, setBlogPeriod] = useState<'day' | 'month' | 'year'>('day');
  const [membershipChartData, setMembershipChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Membership Sales',
        data: [],
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136, 132, 216, 0.5)',
        tension: 0.4,
      },
    ],
  });
  const [blogChartData, setBlogChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Blog Posts Created',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  });
  const [registrationChartData, setRegistrationChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'User Registrations',
        data: [],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.5)',
        tension: 0.4,
      },
    ],
  });
  const [membershipTypeDistribution, setMembershipTypeDistribution] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Membership Distribution',
        data: [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      }
    ],
  });

  const items = [
    {
      key: 'day',
      label: 'Daily',
    },
    {
      key: 'month',
      label: 'Monthly',
    },
    {
      key: 'year',
      label: 'Yearly',
    },
  ];

  // Format date to DD/MM/YYYY - Updated to be consistent across server/client
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
  };

  const formatDateByPeriod = (dateString: string, period: 'day' | 'month' | 'year') => {
    const date = new Date(dateString);
    // Ensure we're working with UTC dates
    const utcDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ));

    switch (period) {
      case 'day':
        return `${utcDate.getUTCDate().toString().padStart(2, '0')}/${(utcDate.getUTCMonth() + 1).toString().padStart(2, '0')}/${utcDate.getUTCFullYear()}`;
      case 'month':
        return `${(utcDate.getUTCMonth() + 1).toString().padStart(2, '0')}/${utcDate.getUTCFullYear()}`;
      case 'year':
        return utcDate.getUTCFullYear().toString();
      default:
        return formatDate(dateString);
    }
  };

  // Move chart options outside of render to prevent recreation
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Statistics'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  useEffect(() => {
    const fetchTotalMembers = async () => {
      try {
        const response = await fetch('https://api-mnyt.purintech.id.vn/api/Accounts');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json() as { data: Account[] };

        const memberCount = data.data.filter(account => account.role.toLowerCase() === 'member').length;
        setTotalMembers(memberCount);

        const registrationsByPeriod = new Map<string, number>();

        data.data.forEach(account => {
          if (account.createDate) {
            const periodKey = formatDateByPeriod(account.createDate, registrationPeriod);
            registrationsByPeriod.set(periodKey, (registrationsByPeriod.get(periodKey) || 0) + 1);
          }
        });

        const sortedPeriods = Array.from(registrationsByPeriod.keys()).sort((a, b) => {
          const getDateParts = (str: string) => {
            if (registrationPeriod === 'day') {
              const [day, month, year] = str.split('/').map(Number);
              return new Date(Date.UTC(year, month - 1, day));
            } else if (registrationPeriod === 'month') {
              const [month, year] = str.split('/').map(Number);
              return new Date(Date.UTC(year, month - 1, 1));
            }
            return new Date(Date.UTC(parseInt(str), 0, 1));
          };

          return getDateParts(a).getTime() - getDateParts(b).getTime();
        });

        setRegistrationChartData({
          labels: sortedPeriods,
          datasets: [
            {
              label: 'User Registrations',
              data: sortedPeriods.map(period => registrationsByPeriod.get(period) || 0),
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46, 204, 113, 0.5)',
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalSales = async () => {
      try {
        const response = await fetch('https://api-mnyt.purintech.id.vn/api/AccountMembership/all');
        if (!response.ok) {
          throw new Error('Failed to fetch sales data');
        }
        const data = await response.json() as { data: MembershipSale[] };

        const totalAmount = data.data.reduce((sum, sale) => sum + sale.amount, 0);
        setTotalSales(totalAmount);

        const salesByPeriod = new Map<string, number>();

        data.data.forEach(sale => {
          if (sale.startDate) {
            const periodKey = formatDateByPeriod(sale.startDate, salesPeriod);
            salesByPeriod.set(periodKey, (salesByPeriod.get(periodKey) || 0) + sale.amount);
          }
        });

        const sortedPeriods = Array.from(salesByPeriod.keys()).sort((a, b) => {
          const getDateParts = (str: string) => {
            if (salesPeriod === 'day') {
              const [day, month, year] = str.split('/').map(Number);
              return new Date(Date.UTC(year, month - 1, day));
            } else if (salesPeriod === 'month') {
              const [month, year] = str.split('/').map(Number);
              return new Date(Date.UTC(year, month - 1, 1));
            }
            return new Date(Date.UTC(parseInt(str), 0, 1));
          };

          return getDateParts(a).getTime() - getDateParts(b).getTime();
        });

        setMembershipChartData({
          labels: sortedPeriods,
          datasets: [
            {
              label: 'Membership Sales',
              data: sortedPeriods.map(period => salesByPeriod.get(period) || 0),
              borderColor: '#8884d8',
              backgroundColor: 'rgba(136, 132, 216, 0.5)',
              tension: 0.4,
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setSalesLoading(false);
      }
    };

    const fetchBlogStats = async () => {
      try {
        const response = await fetch('https://api-mnyt.purintech.id.vn/api/Posts/forums');
        if (!response.ok) {
          throw new Error('Failed to fetch blog stats');
        }
        const data = await response.json() as { data: BlogPost[] };

        const likes = data.data.reduce((sum, blog) => sum + blog.likeCount, 0);
        const comments = data.data.reduce((sum, blog) => sum + blog.commentCount, 0);

        setTotalLikes(likes);
        setTotalComments(comments);

        const blogsByPeriod = new Map<string, number>();

        data.data.forEach(blog => {
          if (blog.createDate) {
            const periodKey = formatDateByPeriod(blog.createDate, blogPeriod);
            blogsByPeriod.set(periodKey, (blogsByPeriod.get(periodKey) || 0) + 1);
          }
        });

        const sortedPeriods = Array.from(blogsByPeriod.keys()).sort((a, b) => {
          const getDateParts = (str: string) => {
            if (blogPeriod === 'day') {
              const [day, month, year] = str.split('/').map(Number);
              return new Date(Date.UTC(year, month - 1, day));
            } else if (blogPeriod === 'month') {
              const [month, year] = str.split('/').map(Number);
              return new Date(Date.UTC(year, month - 1, 1));
            }
            return new Date(Date.UTC(parseInt(str), 0, 1));
          };

          return getDateParts(a).getTime() - getDateParts(b).getTime();
        });

        setBlogChartData({
          labels: sortedPeriods,
          datasets: [
            {
              label: 'Blogs Created',
              data: sortedPeriods.map(period => blogsByPeriod.get(period) || 0),
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
          ],
        });

      } catch (error) {
        console.error('Error fetching blog stats:', error);
      } finally {
        setBlogStatsLoading(false);
      }
    };

    const fetchMembershipDistribution = async () => {
      try {
        // Fetch membership plans
        const plansResponse = await fetch('https://api-mnyt.purintech.id.vn/api/MembershipPlan');
        if (!plansResponse.ok) {
          throw new Error('Failed to fetch membership plans');
        }
        const plansData: MembershipPlans = await plansResponse.json();

        // Fetch account memberships
        const membershipsResponse = await fetch('https://api-mnyt.purintech.id.vn/api/AccountMembership/all');
        if (!membershipsResponse.ok) {
          throw new Error('Failed to fetch account memberships');
        }
        const membershipsData = await membershipsResponse.json();

        // Fetch accounts to get member status
        const accountsResponse = await fetch('https://api-mnyt.purintech.id.vn/api/Accounts');
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const accountsData = await accountsResponse.json();

        // Create a map of account IDs to their active membership IDs
        const accountMembershipMap = new Map<number, number>();
        membershipsData.data.forEach((membership: any) => {
          if (membership.accountId && membership.membershipPlanId) {
            const endDate = new Date(membership.endDate);
            const currentDate = new Date();

            // Convert dates to UTC for comparison
            const utcEndDate = new Date(Date.UTC(
              endDate.getUTCFullYear(),
              endDate.getUTCMonth(),
              endDate.getUTCDate()
            ));
            const utcCurrentDate = new Date(Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              currentDate.getUTCDate()
            ));

            // Check if membership is active and not expired
            if (membership.status === 'Active' && utcEndDate > utcCurrentDate) {
              accountMembershipMap.set(membership.accountId, membership.membershipPlanId);
            }
          }
        });

        // Count memberships by type, excluding non-members
        const membershipCounts = new Map<number, number>();
        (accountsData.data as Account[]).forEach((account: Account) => {
          if (account.role.toLowerCase() === 'member') {
            const membershipId = accountMembershipMap.get(account.id);
            if (membershipId) {
              const currentCount = membershipCounts.get(membershipId) || 0;
              membershipCounts.set(membershipId, currentCount + 1);
            }
          }
        });

        // Create labels and data arrays
        const labels = plansData.data.map(plan => plan.name);
        const data = plansData.data.map(plan => membershipCounts.get(plan.id) || 0);

        // Calculate total members and non-members
        const totalMembers = (accountsData.data as Account[]).filter(account => account.role.toLowerCase() === 'member').length;
        const membersWithMembership = data.reduce((sum: number, count: number) => sum + count, 0);
        const nonMembers = totalMembers - membersWithMembership;

        // Add non-members to the chart
        labels.push('No Active Membership');
        data.push(nonMembers);

        setMembershipTypeDistribution({
          labels,
          datasets: [
            {
              label: 'Membership Distribution',
              data,
              backgroundColor: [
                'rgba(54, 162, 235, 0.8)',  // Blue for membership types
                'rgba(255, 99, 132, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(128, 128, 128, 0.8)',  // Gray for non-members
              ],
            }
          ],
        });
      } catch (error) {
        console.error('Error fetching membership distribution:', error);
      }
    };

    fetchTotalMembers();
    fetchTotalSales();
    fetchBlogStats();
    fetchMembershipDistribution();
  }, [registrationPeriod, salesPeriod, blogPeriod]);

  // Format number to currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className={styles.statsGrid}>
        {/* Total Membership */}
        <Card>
          <CardBody>
            <h3>Total Member</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsPersonFill size={24} />
              </div>
              <span>{loading ? "Loading..." : totalMembers}</span>
            </div>
          </CardBody>
        </Card>

        {/* Total amount of sales */}
        <Card>
          <CardBody>
            <h3>Total amount of sale</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsGraphUp size={24} />
              </div>
              <span>{salesLoading ? "Loading..." : formatCurrency(totalSales)}</span>
            </div>
          </CardBody>
        </Card>

        {/*Total Like */}
        <Card>
          <CardBody>
            <h3>Total Like</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsHeart size={24} />
              </div>
              <span>{blogStatsLoading ? "Loading..." : totalLikes}</span>
            </div>
          </CardBody>
        </Card>

        {/* Total Comment */}
        <Card>
          <CardBody>
            <h3>Total Comment</h3>
            <div className={styles.statValue}>
              <div className={styles.statIcon}>
                <BsChat size={24} />
              </div>
              <span>{blogStatsLoading ? "Loading..." : totalComments}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Membership Sales Chart */}
        <Card className={styles.chartCard}>
          <CardBody>
            <div className={styles.chartHeader}>
              <h3>Membership Sales</h3>
              <Tabs
                items={items}
                defaultActiveKey="month"
                onChange={(key) => setSalesPeriod(key as 'day' | 'month' | 'year')}
                size="small"
                className={styles.periodTabs}
              />
            </div>
            <div className={styles.chart}>
              <Line options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  title: {
                    display: true,
                    text: `Membership Sales by ${salesPeriod}`
                  }
                }
              }} data={membershipChartData} />
            </div>
          </CardBody>
        </Card>

        {/* Blog Stats Chart */}
        <Card className={styles.chartCard}>
          <CardBody>
            <div className={styles.chartHeader}>
              <h3>Blog Posts Created</h3>
              <Tabs
                items={items}
                defaultActiveKey="day"
                onChange={(key) => setBlogPeriod(key as 'day' | 'month' | 'year')}
                size="small"
                className={styles.periodTabs}
              />
            </div>
            <div className={styles.chart}>
              <Bar options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  title: {
                    display: true,
                    text: `Blog Posts Created by ${blogPeriod}`
                  }
                }
              }} data={blogChartData} />
            </div>
          </CardBody>
        </Card>

        {/* Registration Chart */}
        <Card className={styles.chartCard}>
          <CardBody>
            <div className={styles.chartHeader}>
              <h3>User Registrations</h3>
              <Tabs
                items={items}
                defaultActiveKey="month"
                onChange={(key) => setRegistrationPeriod(key as 'day' | 'month' | 'year')}
                size="small"
                className={styles.periodTabs}
              />
            </div>
            <div className={styles.chart}>
              <Line
                options={{
                  ...options,
                  plugins: {
                    ...options.plugins,
                    title: {
                      display: true,
                      text: `User Registrations by ${registrationPeriod}`
                    }
                  }
                }}
                data={registrationChartData}
              />
            </div>
          </CardBody>
        </Card>

        {/* Membership Type Distribution Chart */}
        <Card className={styles.chartCard}>
          <CardBody>
            <h3>Membership Distribution</h3>
            <div className={styles.chart}>
              <Doughnut
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Distribution of Membership Types'
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context: any) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                }}
                data={membershipTypeDistribution}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
