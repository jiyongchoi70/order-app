import './AdminDashboard.css';

function AdminDashboard({ stats }) {
  return (
    <section className="admin-dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">총 주문</span>
          <span className="stat-value">{stats.totalOrders || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">주문 접수</span>
          <span className="stat-value">{stats.receivedOrders || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">제조 중</span>
          <span className="stat-value">{stats.inProgressOrders || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">제조 완료</span>
          <span className="stat-value">{stats.completedOrders || 0}</span>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;

