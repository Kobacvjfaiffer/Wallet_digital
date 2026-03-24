// dashboard.js - Lógica del dashboard
class Dashboard {
    constructor() {
        this.assetsData = [
            { id: 1, name: "Dólar", balance: 2500, value: 1.00, symbol: "$", change: "+2.5%" },
            { id: 2, name: "Euro", balance: 2000, value: 1.04, symbol: "€", change: "+1.2%" },
            { id: 3, name: "PMEX", balance: 2000, value: 0.30, symbol: "MX$", change: "-0.5%" },
            { id: 4, name: "Yuan", balance: 2000, value: 0.52, symbol: "¥", change: "+0.8%" },
            { id: 5, name: "Libra", balance: 2080, value: 1.14, symbol: "£", change: "+1.5%" }
        ];
        
        this.sortColumn = 'id';
        this.sortDirection = 'asc';
        
        this.init();
    }
    
    init() {
        this.renderTable();
        this.setupEventListeners();
        this.loadStats();
    }
    
    renderTable() {
        const tbody = document.getElementById('assetsTableBody');
        if (!tbody) return;
        
        const sorted = [...this.assetsData].sort((a, b) => {
            let aVal, bVal;
            switch(this.sortColumn) {
                case 'name': aVal = a.name; bVal = b.name; break;
                case 'balance': aVal = a.balance; bVal = b.balance; break;
                case 'value': aVal = a.value; bVal = b.value; break;
                default: aVal = a.id; bVal = b.id;
            }
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        tbody.innerHTML = sorted.map(asset => `
            <tr class="table-row">
                <th scope="row">${asset.id}</th>
                <td>
                    <strong>${asset.name}</strong>
                    <span class="text-muted ms-1">${asset.symbol}</span>
                </td>
                <td>${Helpers.formatNumber(asset.balance)}</td>
                <td>${Helpers.formatCurrency(asset.balance * asset.value)}</td>
                <td class="${asset.change.startsWith('+') ? 'text-success' : 'text-danger'}">
                    ${asset.change}
                </td>
            </tr>
        `).join('');
    }
    
    loadStats() {
        const totalValue = this.assetsData.reduce((sum, asset) => sum + (asset.balance * asset.value), 0);
        const totalAssets = this.assetsData.length;
        
        const totalValueEl = document.getElementById('totalValue');
        const totalAssetsEl = document.getElementById('totalAssets');
        
        if (totalValueEl) totalValueEl.textContent = Helpers.formatCurrency(totalValue);
        if (totalAssetsEl) totalAssetsEl.textContent = totalAssets;
    }
    
    setupEventListeners() {
        // Ordenar tabla
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const column = btn.dataset.sort;
                if (this.sortColumn === column) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = column;
                    this.sortDirection = 'asc';
                }
                this.renderTable();
            });
        });
        
        // Refrescar datos
        const refreshBtn = document.getElementById('refreshAssets');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
        
        // Exportar datos
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    }
    
    async refreshData() {
        Helpers.showLoading();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular actualización de datos
        this.assetsData = this.assetsData.map(asset => ({
            ...asset,
            balance: asset.balance + Math.floor(Math.random() * 100) - 50
        }));
        
        this.renderTable();
        this.loadStats();
        Helpers.hideLoading();
        Helpers.showToast('Datos actualizados correctamente', 'success');
    }
    
    exportData() {
        const data = JSON.stringify(this.assetsData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assets_${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Helpers.showToast('Exportación completada', 'success');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});