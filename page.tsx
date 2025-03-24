// Phần hiển thị thông tin người dùng
<div>
    <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '1.2rem' }}>
        {userData.fullName || userData.userName || 'Người dùng'}
    </h4>
    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
        @{userData.userName || 'username'}
    </p>
    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
        {userData.email || 'Chưa cập nhật email'}
    </p>
    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
        Thành viên từ: {formatDate(userData.createDate)}
    </p>
    <p style={{ margin: '0', color: '#4caf50', fontWeight: 500 }}>
        {userData.role || 'User'} - {userData.status || 'N/A'}
    </p>
</div>