// wallet.js - Lógica de la billetera
class WalletModule {
    constructor() {
        this.transactions = [];
        this.balance = 0;
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderTransactions();
        this.updateBalance();
    }
    
    loadData() {
        // Datos de ejemplo para la billetera
        this.transactions = [
            { id: 1, type: 'deposit', amount: 1000, currency: 'USD', date: '2024-01-15', status: 'completed', description: 'Depósito inicial' },
            { id: 2, type: 'deposit', amount: 500, currency: 'EUR', date: '2024-01-20', status: 'completed', description: 'Transferencia recibida' },
            { id: 3, type: 'withdrawal', amount: 200, currency: 'USD', date: '2024-01-25', status: 'completed', description: 'Retiro ATM' },
            { id: 4, type: 'transfer', amount: 150, currency: 'USD', date: '2024-02-01', status: 'pending', description: 'Envío a cuenta externa' },
            { id: 5, type: 'deposit', amount: 300, currency: 'USD', date: '2024-02-05', status: 'completed', description: 'Pago recibido' }
        ];
        
        // Calcular balance
        this.balance = this.transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => {
                if (t.type === 'deposit') return sum + t.amount;
                if (t.type === 'withdrawal' || t.type === 'transfer') return sum - t.amount;
                return sum;
            }, 0);
    }
    
    setupEventListeners() {
        // Botón de depositar
        const depositBtn = document.getElementById('depositBtn');
        if (depositBtn) {
            depositBtn.addEventListener('click', () => this.showTransactionModal('deposit'));
        }
        
        // Botón de retirar
        const withdrawBtn = document.getElementById('withdrawBtn');
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => this.showTransactionModal('withdrawal'));
        }
        
        // Botón de transferir
        const transferBtn = document.getElementById('transferBtn');
        if (transferBtn) {
            transferBtn.addEventListener('click', () => this.showTransactionModal('transfer'));
        }
        
        // Formulario de transacción
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.handleTransaction(e));
        }
        
        // Filtros
        const filterSelect = document.getElementById('filterType');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.filterTransactions());
        }
        
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterTransactions());
        }
    }
    
    renderTransactions() {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;
        
        if (this.filteredTransactions && this.filteredTransactions.length > 0) {
            this.filteredTransactions.forEach(transaction => {
                tbody.appendChild(this.createTransactionRow(transaction));
            });
        } else if (this.transactions.length > 0) {
            this.transactions.forEach(transaction => {
                tbody.appendChild(this.createTransactionRow(transaction));
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">
                        <div class="text-muted">
                            <span class="display-6">📭</span>
                            <p class="mt-2">No hay transacciones registradas</p>
                        </div>
                    </td>
                </tr>
            `;
        }
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
            <td>${Helpers.formatDate(transaction.date)}</td>
            <td>
                <span class="badge bg-${statusClass[transaction.status]}">${transaction.status}</span>
            </td>
            <td>
                <span class="${typeClass[transaction.type]}">
                    ${typeIcon[transaction.type]} ${transaction.type === 'deposit' ? 'Depósito' : transaction.type === 'withdrawal' ? 'Retiro' : 'Transferencia'}
                </span>
            </td>
            <td>${transaction.description}</td>
            <td class="${transaction.type === 'deposit' ? 'text-success' : 'text-danger'}">
                ${transaction.type === 'deposit' ? '+' : '-'} ${Helpers.formatCurrency(transaction.amount, transaction.currency)}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-info view-details" data-id="${transaction.id}">
                    Ver
                </button>
            </td>
        `;
        
        // Evento para ver detalles
        const viewBtn = tr.querySelector('.view-details');
        viewBtn.addEventListener('click', () => this.showTransactionDetails(transaction.id));
        
        return tr;
    }
    
    updateBalance() {
        const balanceElement = document.getElementById('walletBalance');
        if (balanceElement) {
            balanceElement.textContent = Helpers.formatCurrency(this.balance, 'USD');
        }
    }
    
    showTransactionModal(type) {
        const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
        const modalTitle = document.getElementById('transactionModalLabel');
        const typeInput = document.getElementById('transactionType');
        
        if (modalTitle) {
            modalTitle.textContent = type === 'deposit' ? 'Realizar Depósito' : 
                                     type === 'withdrawal' ? 'Realizar Retiro' : 'Realizar Transferencia';
        }
        
        if (typeInput) {
            typeInput.value = type;
        }
        
        // Cambiar texto del botón según tipo
        const submitBtn = document.getElementById('submitTransaction');
        if (submitBtn) {
            submitBtn.textContent = type === 'deposit' ? 'Depositar' : 
                                    type === 'withdrawal' ? 'Retirar' : 'Transferir';
        }
        
        // Mostrar/ocultar campos según tipo
        const recipientField = document.getElementById('recipientField');
        if (recipientField) {
            recipientField.style.display = type === 'transfer' ? 'block' : 'none';
        }
        
        modal.show();
    }
    
    async handleTransaction(e) {
        e.preventDefault();
        
        const type = document.getElementById('transactionType')?.value;
        const amount = parseFloat(document.getElementById('transactionAmount')?.value);
        const currency = document.getElementById('transactionCurrency')?.value || 'USD';
        const recipient = document.getElementById('recipient')?.value;
        
        // Validaciones
        if (!amount || amount <= 0) {
            Helpers.showToast('Ingresa un monto válido', 'danger');
            return;
        }
        
        if (type === 'transfer' && !recipient) {
            Helpers.showToast('Ingresa el destinatario', 'danger');
            return;
        }
        
        if ((type === 'withdrawal' || type === 'transfer') && amount > this.balance) {
            Helpers.showToast('Saldo insuficiente', 'danger');
            return;
        }
        
        Helpers.showLoading();
        
        // Simular procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Crear nueva transacción
        const newTransaction = {
            id: this.transactions.length + 1,
            type: type,
            amount: amount,
            currency: currency,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            description: type === 'deposit' ? 'Depósito realizado' :
                        type === 'withdrawal' ? 'Retiro realizado' :
                        `Transferencia a ${recipient}`
        };
        
        this.transactions.unshift(newTransaction);
        
        // Actualizar balance
        if (type === 'deposit') {
            this.balance += amount;
        } else {
            this.balance -= amount;
        }
        
        // Re-renderizar
        this.updateBalance();
        this.renderTransactions();
        
        Helpers.hideLoading();
        Helpers.showToast('Transacción realizada con éxito', 'success');
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
        modal.hide();
        
        // Limpiar formulario
        document.getElementById('transactionForm')?.reset();
    }
    
    filterTransactions() {
        const filterType = document.getElementById('filterType')?.value;
        const dateFilter = document.getElementById('dateFilter')?.value;
        
        this.filteredTransactions = this.transactions.filter(transaction => {
            let match = true;
            
            if (filterType && filterType !== 'all') {
                match = match && transaction.type === filterType;
            }
            
            if (dateFilter) {
                const transactionDate = new Date(transaction.date);
                const today = new Date();
                const filterDate = new Date(dateFilter);
                
                if (dateFilter === 'today') {
                    match = match && transactionDate.toDateString() === today.toDateString();
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today.setDate(today.getDate() - 7));
                    match = match && transactionDate >= weekAgo;
                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                    match = match && transactionDate >= monthAgo;
                }
            }
            
            return match;
        });
        
        const tbody = document.getElementById('transactionsTableBody');
        if (tbody) {
            tbody.innerHTML = '';
            if (this.filteredTransactions.length > 0) {
                this.filteredTransactions.forEach(transaction => {
                    tbody.appendChild(this.createTransactionRow(transaction));
                });
            } else {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-5">
                            <div class="text-muted">
                                <span class="display-6">🔍</span>
                                <p class="mt-2">No hay transacciones con estos filtros</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }
    }
    
    showTransactionDetails(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            alert(`
                Detalles de la transacción:
                
                ID: ${transaction.id}
                Fecha: ${Helpers.formatDate(transaction.date, 'long')}
                Tipo: ${transaction.type}
                Monto: ${Helpers.formatCurrency(transaction.amount, transaction.currency)}
                Estado: ${transaction.status}
                Descripción: ${transaction.description}
            `);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.walletModule = new WalletModule();
});