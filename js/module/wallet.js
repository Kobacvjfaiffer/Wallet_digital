// wallet.js - Gestión de billetera con persistencia de datos
class WalletModule {
    constructor() {
        this.transactions = [];
        this.balance = 0;
        this.filteredTransactions = [];
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderTransactions();
        this.updateBalance();
    }
    
    loadData() {
        // Cargar transacciones guardadas
        const saved = localStorage.getItem('guardpal_transactions');
        
        if (saved) {
            try {
                this.transactions = JSON.parse(saved);
                console.log('📦 Transacciones cargadas:', this.transactions.length);
            } catch(e) {
                console.error('Error cargando transacciones:', e);
                this.loadDefaultTransactions();
            }
        } else {
            this.loadDefaultTransactions();
        }
        
        this.filteredTransactions = [...this.transactions];
    }
    
    loadDefaultTransactions() {
        // Transacciones de ejemplo
        this.transactions = [
            { id: 1, type: 'deposit', amount: 1000, currency: 'USD', date: '2024-01-15', status: 'completed', description: 'Depósito inicial' },
            { id: 2, type: 'deposit', amount: 500, currency: 'USD', date: '2024-01-20', status: 'completed', description: 'Transferencia recibida' },
            { id: 3, type: 'withdrawal', amount: 200, currency: 'USD', date: '2024-01-25', status: 'completed', description: 'Retiro ATM' },
            { id: 4, type: 'transfer', amount: 150, currency: 'USD', date: '2024-02-01', status: 'pending', description: 'Envío a cuenta externa' },
            { id: 5, type: 'deposit', amount: 300, currency: 'USD', date: '2024-02-05', status: 'completed', description: 'Pago recibido' }
        ];
        this.saveTransactions();
    }
    
    saveTransactions() {
        localStorage.setItem('guardpal_transactions', JSON.stringify(this.transactions));
        console.log('💾 Transacciones guardadas:', this.transactions.length);
    }
    
    setupEventListeners() {
        // Botones principales
        const depositBtn = document.getElementById('depositBtn');
        const withdrawBtn = document.getElementById('withdrawBtn');
        const transferBtn = document.getElementById('transferBtn');
        
        if (depositBtn) {
            depositBtn.addEventListener('click', () => this.showTransactionModal('deposit'));
        }
        
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => this.showTransactionModal('withdrawal'));
        }
        
        if (transferBtn) {
            transferBtn.addEventListener('click', () => this.showTransactionModal('transfer'));
        }
        
        // Confirmar transacción
        const confirmBtn = document.getElementById('confirmTransactionBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmTransaction());
        }
        
        // Filtros
        const filterType = document.getElementById('filterType');
        const dateFilter = document.getElementById('dateFilter');
        
        if (filterType) {
            filterType.addEventListener('change', () => this.filterTransactions());
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterTransactions());
        }
    }
    
    showTransactionModal(type) {
        currentTransactionType = type;
        
        const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
        const modalTitle = document.getElementById('transactionModalLabel');
        
        if (modalTitle) {
            const titles = {
                deposit: '💰 Realizar Depósito',
                withdrawal: '💸 Realizar Retiro',
                transfer: '🔄 Realizar Transferencia'
            };
            modalTitle.textContent = titles[type];
        }
        
        // Mostrar/ocultar campo de destinatario
        const recipientField = document.getElementById('recipientField');
        if (recipientField) {
            recipientField.style.display = type === 'transfer' ? 'block' : 'none';
        }
        
        // Limpiar campos
        const amountInput = document.getElementById('transactionAmount');
        const descriptionInput = document.getElementById('transactionDescription');
        const recipientInput = document.getElementById('transactionRecipient');
        
        if (amountInput) amountInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        if (recipientInput) recipientInput.value = '';
        
        modal.show();
    }
    
    confirmTransaction() {
        const type = currentTransactionType;
        const amount = parseFloat(document.getElementById('transactionAmount')?.value);
        const description = document.getElementById('transactionDescription')?.value || '';
        const recipient = document.getElementById('transactionRecipient')?.value || '';
        
        // Validaciones
        if (!amount || amount <= 0) {
            this.showMessage('Por favor ingresa un monto válido', 'danger');
            return;
        }
        
        if (type === 'withdrawal' && amount > this.balance) {
            this.showMessage('Saldo insuficiente para este retiro', 'danger');
            return;
        }
        
        if (type === 'transfer' && amount > this.balance) {
            this.showMessage('Saldo insuficiente para esta transferencia', 'danger');
            return;
        }
        
        // Crear descripción si está vacía
        let finalDescription = description;
        if (!finalDescription) {
            if (type === 'deposit') finalDescription = 'Depósito realizado';
            else if (type === 'withdrawal') finalDescription = 'Retiro realizado';
            else finalDescription = `Transferencia a ${recipient || 'destinatario'}`;
        }
        
        // Crear nueva transacción
        const newTransaction = {
            id: Date.now(), // ID único basado en timestamp
            type: type,
            amount: amount,
            currency: 'USD',
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            description: finalDescription
        };
        
        // Agregar destinatario si es transferencia
        if (type === 'transfer' && recipient) {
            newTransaction.recipient = recipient;
        }
        
        // Agregar a la lista
        this.transactions.unshift(newTransaction);
        this.saveTransactions();
        
        // Actualizar vista
        this.filterTransactions();
        this.updateBalance();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
        if (modal) modal.hide();
        
        // Mostrar mensaje de éxito
        this.showMessage('✅ Transacción realizada con éxito', 'success');
        
        console.log('✅ Nueva transacción:', newTransaction);
    }
    
    updateBalance() {
        // Calcular balance solo con transacciones completadas
        this.balance = this.transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => {
                if (t.type === 'deposit') return sum + t.amount;
                if (t.type === 'withdrawal' || t.type === 'transfer') return sum - t.amount;
                return sum;
            }, 0);
        
        const balanceElement = document.getElementById('walletBalance');
        if (balanceElement) {
            balanceElement.textContent = this.formatCurrency(this.balance);
        }
    }
    
    renderTransactions() {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;
        
        const transactionsToShow = this.filteredTransactions || this.transactions;
        
        if (!transactionsToShow || transactionsToShow.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">
                        <div class="text-muted">
                            <span class="display-6">📭</span>
                            <p class="mt-2 mb-0">No hay transacciones registradas</p>
                            <small class="text-muted">Haz clic en "Depositar" para comenzar</small>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        
        // Mostrar más recientes primero
        [...transactionsToShow].reverse().forEach(transaction => {
            const row = this.createTransactionRow(transaction);
            tbody.appendChild(row);
        });
    }
    
    createTransactionRow(transaction) {
        const tr = document.createElement('tr');
        tr.className = 'transaction-row';
        
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
        
        const typeText = {
            deposit: 'Depósito',
            withdrawal: 'Retiro',
            transfer: 'Transferencia'
        };
        
        const statusClass = {
            completed: 'success',
            pending: 'warning',
            failed: 'danger'
        };
        
        const amountClass = transaction.type === 'deposit' ? 'text-success' : 'text-danger';
        const amountSign = transaction.type === 'deposit' ? '+' : '-';
        
        tr.innerHTML = `
            <td><small>${this.formatDate(transaction.date)}</small></td>
            <td><span class="badge bg-${statusClass[transaction.status]}">${transaction.status}</span></td>
            <td><span class="${typeClass[transaction.type]}">${typeIcon[transaction.type]} ${typeText[transaction.type]}</span></td>
            <td>${this.escapeHtml(transaction.description)}</td>
            <td class="${amountClass} fw-bold">${amountSign} ${this.formatCurrency(transaction.amount)}</td>
        `;
        
        return tr;
    }
    
    filterTransactions() {
        const filterType = document.getElementById('filterType')?.value;
        const dateFilter = document.getElementById('dateFilter')?.value;
        
        this.filteredTransactions = this.transactions.filter(transaction => {
            let match = true;
            
            // Filtrar por tipo
            if (filterType && filterType !== 'all') {
                match = match && transaction.type === filterType;
            }
            
            // Filtrar por fecha
            if (dateFilter && dateFilter !== 'all') {
                const transactionDate = new Date(transaction.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (dateFilter === 'today') {
                    match = match && transactionDate.toDateString() === today.toDateString();
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    match = match && transactionDate >= weekAgo;
                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(today.getMonth() - 1);
                    match = match && transactionDate >= monthAgo;
                }
            }
            
            return match;
        });
        
        this.renderTransactions();
        
        const count = this.filteredTransactions.length;
        if (filterType !== 'all' || dateFilter !== 'all') {
            console.log(`🔍 Filtro aplicado: ${count} transacciones`);
        }
    }
    
    showMessage(message, type) {
        const messageDiv = document.getElementById('walletMessage');
        if (messageDiv) {
            const alertClass = type === 'danger' ? 'alert-danger' : 
                              type === 'success' ? 'alert-success' : 'alert-info';
            
            messageDiv.innerHTML = `
                <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            
            setTimeout(() => {
                if (messageDiv.innerHTML) messageDiv.innerHTML = '';
            }, 3000);
        }
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('es-ES');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Variable global para tipo de transacción actual
let currentTransactionType = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.walletModule = new WalletModule();
});