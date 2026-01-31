// Admin Analytics Dashboard
// ==========================
// Chart.js visualizations for booking trends, revenue, and insights

let charts = {
    bookingTrends: null,
    revenue: null,
    timeSlots: null,
    city: null
};

// Render all charts
function renderCharts(bookings) {
    if (!bookings || bookings.length === 0) {
        console.log('No bookings data for charts');
        return;
    }

    renderBookingTrendsChart(bookings);
    renderRevenueChart(bookings);
    renderTimeSlotsChart(bookings);
    renderCityChart(bookings);
}

// 1. Booking Trends Chart (Last 30 Days)
function renderBookingTrendsChart(bookings) {
    const ctx = document.getElementById('bookingTrendsChart');
    if (!ctx) return;

    // Get last 30 days
    const last30Days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last30Days.push(date.toISOString().split('T')[0]);
    }

    // Count bookings per day
    const bookingCounts = last30Days.map(date => {
        return bookings.filter(b => b.date === date && b.status === 'confirmed').length;
    });

    // Format labels (show only every 5th day for readability)
    const labels = last30Days.map((date, index) => {
        if (index % 5 === 0 || index === last30Days.length - 1) {
            const d = new Date(date);
            return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        }
        return '';
    });

    // Destroy existing chart
    if (charts.bookingTrends) {
        charts.bookingTrends.destroy();
    }

    // Create chart
    charts.bookingTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bookings',
                data: bookingCounts,
                borderColor: '#d4a95d',
                backgroundColor: 'rgba(212, 169, 93, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#d4a95d',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.9)',
                    titleColor: '#d4a95d',
                    bodyColor: '#f5f5f5',
                    borderColor: '#d4a95d',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            const date = new Date(last30Days[index]);
                            return date.toLocaleDateString('en-IN', { 
                                weekday: 'short',
                                month: 'short', 
                                day: 'numeric' 
                            });
                        },
                        label: function(context) {
                            return `${context.parsed.y} booking${context.parsed.y !== 1 ? 's' : ''}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#a3a3a3'
                    },
                    grid: {
                        color: 'rgba(212, 169, 93, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#a3a3a3'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 2. Revenue by Service Chart
function renderRevenueChart(bookings) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    // Calculate revenue by service
    const revenueByService = {};
    bookings.filter(b => b.status === 'confirmed' && b.paymentStatus === 'Y').forEach(booking => {
        const service = booking.serviceName || 'Unknown';
        revenueByService[service] = (revenueByService[service] || 0) + (booking.price || 0);
    });

    // Sort by revenue
    const sortedServices = Object.entries(revenueByService)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6); // Top 6 services

    const labels = sortedServices.map(([name]) => name);
    const data = sortedServices.map(([, revenue]) => revenue);

    // Color palette
    const colors = [
        '#d4a95d',
        '#c9a227',
        '#db7093',
        '#a37782',
        '#8b7355',
        '#6b5d4f'
    ];

    // Destroy existing chart
    if (charts.revenue) {
        charts.revenue.destroy();
    }

    // Create chart
    charts.revenue = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#0a0a0a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f5f5f5',
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.9)',
                    titleColor: '#d4a95d',
                    bodyColor: '#f5f5f5',
                    borderColor: '#d4a95d',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: Rs. ${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 3. Popular Time Slots Chart
function renderTimeSlotsChart(bookings) {
    const ctx = document.getElementById('timeSlotsChart');
    if (!ctx) return;

    // Count bookings by time slot
    const timeSlotCounts = {};
    bookings.filter(b => b.status === 'confirmed').forEach(booking => {
        const time = booking.time || 'Unknown';
        timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
    });

    // Sort by count and get top 10
    const sortedSlots = Object.entries(timeSlotCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const labels = sortedSlots.map(([time]) => time);
    const data = sortedSlots.map(([, count]) => count);

    // Destroy existing chart
    if (charts.timeSlots) {
        charts.timeSlots.destroy();
    }

    // Create chart
    charts.timeSlots = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bookings',
                data: data,
                backgroundColor: 'rgba(212, 169, 93, 0.8)',
                borderColor: '#d4a95d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.9)',
                    titleColor: '#d4a95d',
                    bodyColor: '#f5f5f5',
                    borderColor: '#d4a95d',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} booking${context.parsed.y !== 1 ? 's' : ''}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#a3a3a3'
                    },
                    grid: {
                        color: 'rgba(212, 169, 93, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#a3a3a3'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 4. Bookings by City Chart
function renderCityChart(bookings) {
    const ctx = document.getElementById('cityChart');
    if (!ctx) return;

    // Count bookings by city (from user profile data)
    const cityCounts = {};
    
    // We need to fetch user data to get cities
    // For now, use a placeholder or extract from notes/email
    bookings.filter(b => b.status === 'confirmed').forEach(booking => {
        // Try to extract city from user data if available
        const city = booking.userCity || 'Unknown';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    // Sort by count and get top 8
    const sortedCities = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    const labels = sortedCities.map(([city]) => city);
    const data = sortedCities.map(([, count]) => count);

    // Destroy existing chart
    if (charts.city) {
        charts.city.destroy();
    }

    // Create chart
    charts.city = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bookings',
                data: data,
                backgroundColor: 'rgba(219, 112, 147, 0.8)',
                borderColor: '#db7093',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.9)',
                    titleColor: '#db7093',
                    bodyColor: '#f5f5f5',
                    borderColor: '#db7093',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.x} booking${context.parsed.x !== 1 ? 's' : ''}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#a3a3a3'
                    },
                    grid: {
                        color: 'rgba(219, 112, 147, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#a3a3a3'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Render popular services list
function renderPopularServices(bookings) {
    const container = document.getElementById('popularServices');
    if (!container) return;

    // Count bookings by service
    const serviceCounts = {};
    bookings.forEach(booking => {
        const service = booking.serviceName || 'Unknown';
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });

    // Sort and get top 5
    const sortedServices = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sortedServices.length === 0) {
        container.innerHTML = '<p class="text-muted">No bookings yet</p>';
        return;
    }

    container.innerHTML = `
        <div style="display: grid; gap: 1rem;">
            ${sortedServices.map(([service, count], index) => `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--color-card); border-radius: 0.5rem; border: 1px solid var(--color-border);">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--color-primary); min-width: 40px;">
                        ${index + 1}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--color-text); margin-bottom: 0.25rem;">
                            ${service}
                        </div>
                        <div style="color: var(--color-text-muted); font-size: 0.875rem;">
                            ${count} booking${count !== 1 ? 's' : ''}
                        </div>
                    </div>
                    <div style="width: 100px; height: 8px; background: var(--color-background); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${(count / sortedServices[0][1]) * 100}%; height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-accent));"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Export functions
window.renderCharts = renderCharts;
window.renderBookingTrendsChart = renderBookingTrendsChart;
window.renderRevenueChart = renderRevenueChart;
window.renderTimeSlotsChart = renderTimeSlotsChart;
window.renderCityChart = renderCityChart;
window.renderPopularServices = renderPopularServices;
