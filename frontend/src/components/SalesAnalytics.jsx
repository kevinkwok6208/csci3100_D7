import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SalesAnalytics.css';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const SalesAnalytics = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [dateFilterActive, setDateFilterActive] = useState(false);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://localhost:5443/api/orderhistories/all');
                setOrders(response.data);
                setFilteredOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders');
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, []);
    
    // Apply date filter to orders
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Set to end of day
            
            const filtered = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= start && orderDate <= end;
            });
            
            setFilteredOrders(filtered);
            setDateFilterActive(true);
        } else {
            setFilteredOrders(orders);
            setDateFilterActive(false);
        }
    }, [startDate, endDate, orders]);
    
    const downloadAllExcel = () => {
        window.location.href = 'https://localhost:5443/api/orderhistories/export';
    };
    
    const downloadFilteredExcel = () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
        
        window.location.href = `https://localhost:5443/api/orderhistories/export-by-date?startDate=${startDate}&endDate=${endDate}`;
    };

    
    
    const clearDateFilter = () => {
        setStartDate('');
        setEndDate('');
        setDateFilterActive(false);
    };
    
    // Calculate analytics data for charts
    const calculateAnalyticsData = () => {
        const displayedOrders = dateFilterActive ? filteredOrders : orders;
        
        // 1. Top Products by Units Sold
        const productSales = {};
        displayedOrders.forEach(order => {
            order.products.forEach(product => {
                const productName = product.productId?.productName || 'Unknown Product';
                if (!productSales[productName]) {
                    productSales[productName] = 0;
                }
                productSales[productName] += product.quantity;
            });
        });

        // Sort products by quantity sold and get top 5
        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // 2. Average Order Value (AOV)
        const orderValues = displayedOrders.map(order => order.totalPrice);
        const averageOrderValue = orderValues.length > 0 
            ? orderValues.reduce((sum, value) => sum + value, 0) / orderValues.length 
            : 0;

        // 3. Total Sales Revenue
        const totalRevenue = displayedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // 4. Sales Trend (by date)
        const salesByDate = {};
        displayedOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            if (!salesByDate[date]) {
                salesByDate[date] = 0;
            }
            salesByDate[date] += order.totalPrice;
        });

        // Sort dates chronologically
        const sortedDates = Object.keys(salesByDate).sort((a, b) => new Date(a) - new Date(b));
        const salesTrendData = sortedDates.map(date => salesByDate[date]);

        return {
            topProducts,
            averageOrderValue,
            totalRevenue,
            salesByDate: {
                labels: sortedDates,
                data: salesTrendData
            }
        };
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    
    // Calculate analytics data
    const analyticsData = calculateAnalyticsData();
    const displayedOrders = dateFilterActive ? filteredOrders : orders;
    
    // Chart configurations
    const topProductsChartData = {
        labels: analyticsData.topProducts.map(product => product[0]),
        datasets: [
            {
                label: 'Units Sold',
                data: analyticsData.topProducts.map(product => product[1]),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const salesTrendChartData = {
        labels: analyticsData.salesByDate.labels,
        datasets: [
            {
                label: 'Daily Sales Revenue',
                data: analyticsData.salesByDate.data,
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.1,
            },
        ],
    };

    // Calculate order counts by month (for yearly trend)
    const getMonthlyData = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlySales = Array(12).fill(0);
        
        displayedOrders.forEach(order => {
            const date = new Date(order.createdAt);
            const month = date.getMonth();
            monthlySales[month] += order.totalPrice;
        });
        
        return {
            labels: monthNames,
            data: monthlySales
        };
    };

    const monthlyData = getMonthlyData();
    
    const monthlySalesChartData = {
        labels: monthlyData.labels,
        datasets: [
            {
                label: 'Monthly Sales Revenue',
                data: monthlyData.data,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Average Order Value chart (single value displayed as gauge/pie)
    const aovChartData = {
        labels: ['Average Order Value', 'Remaining'],
        datasets: [
            {
                data: [analyticsData.averageOrderValue, 100 - analyticsData.averageOrderValue],
                backgroundColor: [
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(201, 203, 207, 0.3)',
                ],
                borderWidth: 0,
            },
        ],
    };


    // Add this function at the top of your component
      const getResponsiveChartOptions = (title) => {
        const isMobile = window.innerWidth < 768;
        
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: {
                boxWidth: isMobile ? 10 : 40,
                font: {
                  size: isMobile ? 10 : 12
                }
              }
            },
            title: {
              display: true,
              text: title,
              font: {
                size: isMobile ? 14 : 16
              }
            },
          },
          scales: {
            x: {
              ticks: {
                maxRotation: isMobile ? 90 : 0,
                minRotation: isMobile ? 90 : 0,
                font: {
                  size: isMobile ? 8 : 12
                }
              }
            },
            y: {
              ticks: {
                font: {
                  size: isMobile ? 8 : 12
                }
              }
            }
          }
        };
      };

    
    return (
        <div className="sales-analytics-container">
            <section className="spacing"></section>
            <h1>Sales Analytics</h1>
            
            <div className="date-filter-container">
                <h2>Filter Orders by Date</h2>
                <div className="date-inputs">
                    <div className="date-input-group">
                        <label>Start Date:</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="date-input-group">
                        <label>End Date:</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    {dateFilterActive && (
                        <button className="clear-filter-btn" onClick={clearDateFilter}>
                            Clear Filter
                        </button>
                    )}
                </div>
            </div>
            
            <div className="analytics-summary">
                <div className="summary-card">
                    <h3>{dateFilterActive ? 'Filtered Orders' : 'Total Orders'}</h3>
                    <p>{displayedOrders.length}</p>
                </div>
                <div className="summary-card">
                    <h3>{dateFilterActive ? 'Filtered Revenue' : 'Total Revenue'}</h3>
                    <p>${analyticsData.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>Average Order Value</h3>
                    <p>${analyticsData.averageOrderValue.toFixed(2)}</p>
                </div>
            </div>

            <div className="analytics-charts">
                <div className="chart-container">
                    <h2>Top Products by Units Sold</h2>
                    {analyticsData.topProducts.length > 0 ? (
                        <Bar 
                            data={topProductsChartData} 
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Top 5 Products by Units Sold',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p>No product data available for the selected period</p>
                    )}
                </div>

                <div className="chart-container">
                    <h2>Sales Trend</h2>
                    {analyticsData.salesByDate.labels.length > 0 ? (
                        <Line 
                            data={salesTrendChartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Daily Sales Trend',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p>No sales data available for the selected period</p>
                    )}
                </div>

                <div className="chart-container">
                    <h2>Monthly Sales Distribution</h2>
                    <Bar 
                        data={monthlySalesChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Sales by Month',
                                },
                            },
                        }}
                    />
                </div>

                <div className="chart-container aov-chart">
                    <h2>Average Order Value (AOV)</h2>
                    <div className="aov-display">
                        <Pie 
                            data={aovChartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                if (context.dataIndex === 0) {
                                                    return `$${analyticsData.averageOrderValue.toFixed(2)}`;
                                                }
                                                return '';
                                            }
                                        }
                                    }
                                },
                                cutout: '70%',
                            }}
                        />
                        <div className="aov-center-text">
                            <span className="aov-value">${analyticsData.averageOrderValue.toFixed(2)}</span>
                            <span className="aov-label">Avg. Order</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="download-options">
                <button className="download-btn" onClick={downloadAllExcel}>
                    Download All Orders
                </button>
                
                <button 
                    className="download-btn" 
                    onClick={downloadFilteredExcel}
                    disabled={!startDate || !endDate}
                >
                    Download {dateFilterActive ? 'Filtered' : 'Selected Date Range'} Orders
                </button>
            </div>
            
            <div className="orders-table">
                <h2>{dateFilterActive ? 'Filtered Orders' : 'Recent Orders'}</h2>
                {displayedOrders.length === 0 ? (
                    <p>No orders found for the selected date range</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedOrders.slice(0, 10).map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.Name}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>${order.totalPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SalesAnalytics;
