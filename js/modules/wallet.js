// wallet.js - Versión con transferencias entre usuarios
let currentTransactionType = null;

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
        const saved = localStorage.getItem('guardpal_transactions');
        if (saved) {
            this.transactions = JSON.parse(saved);
        } else {
            this.transactions = [];
        }
        this.filteredTransactions = [...this.transactions];
    }
    
    saveTransactions() {
        localStorage.setItem('guardpal_transactions', JSON.stringify(this.transactions));
    }
    
    setupEventListeners() {
        const depositBtn = document.getElementById('depositBtn');
        const withdrawBtn = document.getElementById('withdrawBtn');
        const transferBtn = document.getElementById('transferBtn');
        
        if (depositBtn) depositBtn.addEventListener('click', () => this.showTransactionModal('deposit'));
        if (withdrawBtn) withdrawBtn.addEventListener('click', () => this.showTransactionModal('withdrawal'));
        if (transferBtn) transferBtn.addEventListener('click', () => this.showTransactionModal('transfer'));
        
        const confirmBtn = document.getElementById('confirmTransactionBtn');
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirmTransaction());
        
        const filterType = document.getElementById('filterType');
        const dateFilter = document.getElementById('dateFilter');
        if (filterType) filterType.addEventListener('change', () => this.filterTransactions());
        if (dateFilter) dateFilter.addEventListener('change', () => this.filterTransactions());
    }
    
    showTransactionModal(type) {
        currentTransactionType = type;
        const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
        
        const titles = {
            deposit: '💰 Realizar Depósito',
            withdrawal: '💸 Realizar Retiro',
            transfer: '🔄 Realizar Transferencia'
        };
        document.getElementById('transactionModalLabel').textContent = titles[type];
        
        // Mostrar/ocultar campos según tipo
        const recipientField = document.getElementById('recipientField');
        if (recipientField) {
            recipientField.style.display = type === 'transfer' ? 'block' : 'none';
        }
        
        // Limpiar campos
        document.getElementById('transactionAmount').value = '';
        document.getElementById('transactionDescription').value = '';
        if (document.getElementById('transactionRecipient')) {
            document.getElementById('transactionRecipient').value = '';
        }
        
        modal.show();
    }
    
    async confirmTransaction() {
        const type = currentTransactionType;
        const amount = parseFloat(document.getElementById('transactionAmount')?.value);
        const description = document.getElementById('transactionDescription')?.value || '';
        const recipientEmail = document.getElementById('transactionRecipient')?.value?.trim().toLowerCase();
        
        // Validaciones básicas
        if (!amount || amount <= 0) {
            this.showMessage('❌ Ingresa un monto válido', 'danger');
            return;
        }
        
        if (type === 'withdrawal' && amount > this.balance) {
            this.showMessage('❌ Saldo insuficiente para este retiro', 'danger');
            return;
        }
        
        if (type === 'transfer') {
            if (!recipientEmail) {
                this.showMessage('❌ Ingresa el email del destinatario', 'danger');
                return;
            }
            
            if (recipientEmail === this.getCurrentUserEmail()) {
                this.showMessage('❌ No puedes transferirte a ti mismo', 'danger');
                return;
            }
            
            if (amount > this.balance) {
                this.showMessage('❌ Saldo insuficiente para esta transferencia', 'danger');
                return;
            }
            
            // Buscar destinatario
            const recipient = await this.findUserByEmail(recipientEmail);
            if (!recipient) {
                this.showMessage('❌ Destinatario no encontrado. Verifica el email.', 'danger');
                return;
            }
            
            // Realizar transferencia entre usuarios
            const success = await this.processTransfer(amount, recipientEmail, description);
            if (!success) {
                this.showMessage('❌ Error al procesar la transferencia', 'danger');
                return;
            }
        }
        
        // Crear transacción local (para depósito, retiro o transferencia)
        const newTransaction = {
            id: Date.now(),
            type: type,
            amount: amount,
            currency: 'USD',
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            description: description || this.getDefaultDescription(type, recipientEmail)
        };
        
        this.transactions.unshift(newTransaction);
        this.saveTransactions();
        
        // Actualizar balance local
        if (type === 'deposit') {
            this.balance += amount;
        } else if (type === 'withdrawal' || type === 'transfer') {
            this.balance -= amount;
        }
        
        this.filterTransactions();
        this.updateBalance();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
        if (modal) modal.hide();
        
        const successMsg = type === 'transfer' ? 
            `✅ Transferencia de $${amount} enviada a ${recipientEmail}` : 
            `✅ ${type === 'deposit' ? 'Depósito' : 'Retiro'} realizado con éxito`;
        this.showMessage(successMsg, 'success');
        
        // Recargar para ver cambios
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
    async processTransfer(amount, recipientEmail, description) {
        // Obtener usuarios
        let users = JSON.parse(localStorage.getItem('guardpal_users') || '[]');
        const currentUser = this.getCurrentUser();
        
        const senderIndex = users.findIndex(u => u.email === currentUser.email);
        const recipientIndex = users.findIndex(u => u.email === recipientEmail);
        
        if (senderIndex === -1 || recipientIndex === -1) return false;
        
        // Actualizar contraseñas (simulación, en realidad no deberías guardar así)
        // En un sistema real, esto sería con API y base de datos
        
        // Registrar transferencia en el destinatario
        const recipientTransactionsKey = `guardpal_transactions_${users[recipientIndex].id}`;
        let recipientTransactions = JSON.parse(localStorage.getItem(recipientTransactionsKey) || '[]');
        
        const recipientTransaction = {
            id: Date.now() + 1,
            type: 'deposit',
            amount: amount,
            currency: 'USD',
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            description: `Transferencia recibida de ${currentUser.email}${description ? ': ' + description : ''}`
        };
        
        recipientTransactions.unshift(recipientTransaction);
        localStorage.setItem(recipientTransactionsKey, JSON.stringify(recipientTransactions));
        
        // También actualizar transacciones globales del destinatario si es el usuario activo
        if (recipientEmail === currentUser.email) {
            // Esto no debería pasar porque ya validamos que no sea el mismo
        } else {
            // Para el destinatario, también guardar en su sesión si está activa
            // En un sistema real, esto se manejaría con backend
        }
        
        console.log(`✅ Transferencia: $${amount} de ${currentUser.email} a ${recipientEmail}`);
        return true;
    }
    
    async findUserByEmail(email) {
        const users = JSON.parse(localStorage.getItem('guardpal_users') || '[]');
        return users.find(u => u.email === email);
    }
    
    getCurrentUser() {
        const sesion = sessionStorage.getItem('guardpal_auth');
        if (!sesion) return null;
        try {
            const data = JSON.parse(sesion);
            return data.user;
        } catch(e) {
            return null;
        }
    }
    
    getCurrentUserEmail() {
        const user = this.getCurrentUser();
        return user ? user.email : null;
    }
    
    getDefaultDescription(type, recipientEmail) {
        if (type === 'deposit') return 'Depósito realizado';
        if (type === 'withdrawal') return 'Retiro realizado';
        if (type === 'transfer') return `Transferencia a ${recipientEmail}`;
        return '';
    }
    
    updateBalance() {
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
                <tr><td colspan="5" class="text-center py-5">
                    <div class="text-muted">
                        <span class="display-6">📭</span>
                        <p class="mt-2">No hay transacciones registradas</p>
                        <small>Haz clic en "Depositar" para comenzar</small>
                    </div>
                </td></tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        [...transactionsToShow].reverse().forEach(t => {
            tbody.appendChild(this.createTransactionRow(t));
        });
    }
    
    createTransactionRow(t) {
        const tr = document.createElement('tr');
        const typeIcon = { deposit: '↓', withdrawal: '↑', transfer: '↗' };
        const typeClass = { deposit: 'text-success', withdrawal: 'text-danger', transfer: 'text-warning' };
        const typeText = { deposit: 'Depósito', withdrawal: 'Retiro', transfer: 'Transferencia' };
        const statusClass = { completed: 'success', pending: 'warning', failed: 'danger' };
        const amountClass = t.type === 'deposit' ? 'text-success' : 'text-danger';
        const amountSign = t.type === 'deposit' ? '+' : '-';
        
        tr.innerHTML = `
            <td><small>${this.formatDate(t.date)}</small></td>
            <td><span class="badge bg-${statusClass[t.status]}">${t.status}</span></td>
            <td><span class="${typeClass[t.type]}">${typeIcon[t.type]} ${typeText[t.type]}</span></td>
            <td>${this.escapeHtml(t.description)}</td>
            <td class="${amountClass} fw-bold">${amountSign} ${this.formatCurrency(t.amount)}</td>
        `;
        return tr;
    }
    
    filterTransactions() {
        const filterType = document.getElementById('filterType')?.value;
        const dateFilter = document.getElementById('dateFilter')?.value;
        
        this.filteredTransactions = this.transactions.filter(t => {
            let match = true;
            if (filterType && filterType !== 'all') match = match && t.type === filterType;
            if (dateFilter && dateFilter !== 'all') {
                const tDate = new Date(t.date);
                const today = new Date();
                if (dateFilter === 'today') match = match && tDate.toDateString() === today.toDateString();
                else if (dateFilter === 'week') {
                    const weekAgo = new Date(today.setDate(today.getDate() - 7));
                    match = match && tDate >= weekAgo;
                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                    match = match && tDate >= monthAgo;
                }
            }
            return match;
        });
        this.renderTransactions();
    }
    
    showMessage(message, type) {
        const msgDiv = document.getElementById('walletMessage');
        if (msgDiv) {
            const alertClass = type === 'danger' ? 'alert-danger' : 'alert-success';
            msgDiv.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
            setTimeout(() => msgDiv.innerHTML = '', 3000);
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

document.addEventListener('DOMContentLoaded', () => {
    window.walletModule = new WalletModule();
});