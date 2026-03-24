// history.js - Lógica del historial completo
class HistoryModule {
    constructor() {
        this.transactions = [];
        this.filteredTransactions = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderTable();
    }
    
    loadData() {
        // Datos de ejemplo para el historial (más datos que en wallet)
        this.transactions = [
            { id: 1, type: 'deposit', amount: 1000, currency: 'USD', date: '2024-01-15 10:30:00', status: 'completed', description: 'Depósito inicial', reference: 'DEP-001' },
            { id: 2, type: 'deposit', amount: 500, currency: 'EUR', date: '2024-01-20 14:15:00', status: 'completed', description: 'Transferencia recibida', reference: 'DEP-002' },
            { id: 3, type: 'withdrawal', amount: 200, currency: 'USD', date: '2024-01-25 09:45:00', status: 'completed', description: 'Retiro ATM', reference: 'WTH-001' },
            { id: 4, type: 'transfer', amount: 150, currency: 'USD', date: '2024-02-01 16:20:00', status: 'pending', description: 'Envío a cuenta externa', reference: 'TRF-001' },
            { id: 5, type: 'deposit', amount: 300, currency: 'USD', date: '2024-02-05 11:00:00', status: 'completed', description: 'Pago recibido', reference: 'DEP-003' },
            { id: 6, type: 'transfer', amount: 75, currency: 'USD', date: '2024-02-10 13:30:00', status: 'completed', description: 'Pago a proveedor', reference: 'TRF-002' },
            { id: 7, type: 'withdrawal', amount: 500, currency: 'USD', date: '2024-02-15 08:45:00', status: 'failed', description: 'Retiro rechazado', reference: 'WTH-002' },
            { id: 8, type: 'deposit', amount: 2000, currency: 'USD', date: '2024-02-20 15:30:00', status: 'completed', description: 'Depósito por transferencia', reference: 'DEP-004' },
            { id: 9, type: 'transfer', amount: 100, currency: 'EUR', date: '2024-02-25 10:15:00', status: 'completed', description: 'Envío internacional', reference: 'TRF-003' },
            { id: 10, type: 'withdrawal', amount: 300, currency: 'USD', date: '2024-03-01 12:00:00', status: 'completed', description: 'Retiro cajero', reference: 'WTH-003' },
            { id: 11, type: 'deposit', amount: 1500, currency: 'USD', date: '2024-03-05 09:30:00', status: 'completed', description: 'Depósito en efectivo', reference: 'DEP-005' },
            { id: 12, type: 'transfer', amount: 250, currency: 'USD', date: '2024-03-10 14:45:00', status: 'pending', description: 'Transferencia en proceso', reference: 'TRF-004' }
        ];
        
        this.filteredTransactions = [...this.transactions];
    }
    
    setupEventListeners() {
        document.getElementById('applyFilters')?.addEventListener('click', () => this.applyFilters());
        document.getElementById('resetFilters')?.addEventListener('click', () => this.resetFilters());
        document.getElementById('exportHistory')?.addEventListener('click', () => this.exportHistory());
    }
    
    renderTable() {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageTransactions = this.filteredTransactions.slice(start, end);
        
        if (pageTransactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">
                        <div class="text-muted">
                            <span class="display-6">📭</span>
                            <p class="mt-2">No hay transacciones que coincidan con los filtros</p>
                        </div>
                    </td>
                </tr>
            `;
            this.renderPagination();
            return;
        }
        
        tbody.innerHTML = '';
        pageTransactions.forEach(transaction => {
            tbody.appendChild(this.createTransactionRow(transaction));
        });
        
        this.renderPagination();
    }
    
    createTransactionRow(transaction) {
        const tr = document.createElement('tr');
        
        const typeIcon = {
            deposit: '↓',
            withdrawal: '↑',
            transfer: '↗'
        };
        
        const typeClass = {
            deposit: 'text-success',
            withdrawal: 'text-danger',
            transfer: 'text-warning'
        };
        
        const statusClass = {
            completed: 'success',
            pending: 'warning',
            failed: 'danger'
        };
        
        tr.innerHTML = `
            <td>${Helpers.formatDate(transaction.date, 'datetime')}</td>
            <td><span class="badge bg-${statusClass[transaction.status]}">${transaction.status}</span></td>
            <td>
                <span class="${typeClass[transaction.type]}">
                    ${typeIcon[transaction.type]} ${this.getTypeText(transaction.type)}
                </span>
            </td>
            <td>${Helpers.escapeHtml(transaction.description)}</td>
            <td class="${transaction.type === 'deposit' ? 'text-success' : 'text-danger'}">
                ${transaction.type === 'deposit' ? '+' : '-'} ${Helpers.formatCurrency(transaction.amount, transaction.currency)}
            </td>
            <td><code>${transaction.reference}</code></td>
        `;
        
        return tr;
    }
    
    getTypeText(type) {
        const types = {
            deposit: 'Depósito',
            withdrawal: 'Retiro',
            transfer: 'Transferencia'
        };
        return types[type] || type;
    }
    
    applyFilters() {
        const dateFrom = document.getElementById('dateFrom')?.value;
        const dateTo = document.getElementById('dateTo')?.value;
        const type = document.getElementById('historyFilterType')?.value;
        const status = document.getElementById('historyFilterStatus')?.value;
        
        this.filteredTransactions = this.transactions.filter(transaction => {
            let match = true;
            
            // Filtro por fecha desde
            if (dateFrom) {
                const transactionDate = new Date(transaction.date);
                const fromDate = new Date(dateFrom);
                match = match && transactionDate >= fromDate;
            }
            
            // Filtro por fecha hasta
            if (dateTo) {
                const transactionDate = new Date(transaction.date);
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59);
                match = match && transactionDate <= toDate;
            }
            
            // Filtro por tipo
            if (type && type !== 'all') {
                match = match && transaction.type === type;
            }
            
            // Filtro por estado
            if (status && status !== 'all') {
                match = match && transaction.status === status;
            }
            
            return match;
        });
        
        this.currentPage = 1;
        this.renderTable();
        
        const count = this.filteredTransactions.length;
        Helpers.showToast(`Se encontraron ${count} transacciones`, 'info');
    }
    
    resetFilters() {
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('historyFilterType').value = 'all';
        document.getElementById('historyFilterStatus').value = 'all';
        
        this.filteredTransactions = [...this.transactions];
        this.currentPage = 1;
        this.renderTable();
        
        Helpers.showToast('Filtros eliminados', 'info');
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Botón anterior
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">Anterior</a>
            </li>
        `;
        
        // Números de página
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Botón siguiente
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">Siguiente</a>
            </li>
        `;
        
        pagination.innerHTML = html;
        
        // Eventos de paginación
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page);
                if (page && !isNaN(page) && page >= 1 && page <= totalPages) {
                    this.currentPage = page;
                    this.renderTable();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }
    
    exportHistory() {
        const data = this.filteredTransactions.map(t => ({
            fecha: t.date,
            tipo: this.getTypeText(t.type),
            estado: t.status,
            descripcion: t.description,
            monto: `${t.amount} ${t.currency}`,
            referencia: t.reference
        }));
        
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historial_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        Helpers.showToast('Historial exportado correctamente', 'success');
    }
    
    convertToCSV(data) {
        const headers = Object.keys(data[0] || {});
        const csvRows = [];
        
        csvRows.push(headers.join(','));
        
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.historyModule = new HistoryModule();
});