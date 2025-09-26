// VOLLSTÄNDIGE MoneyPilot App - Alle Funktionen mit korrigierter Anmeldung

// Authentifizierung System für MoneyPilot
let currentUser = null;
let isAuthenticated = false;

// Auth System Initialisierung
function initAuthSystem() {
  checkAuthStatus();
}

// Prüfen ob Benutzer bereits angemeldet ist
function checkAuthStatus() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      isAuthenticated = true;
      hideAuthOverlay();
      showUserInfo();
      loadUserData();
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
      localStorage.removeItem('currentUser');
      showAuthOverlay();
    }
  } else {
    showAuthOverlay();
  }
}

// Auth Overlay anzeigen/verstecken
function showAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

function hideAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Benutzerinformationen anzeigen
function showUserInfo() {
  if (currentUser) {
    const userNameElement = document.getElementById('userName');
    const userInfoElement = document.getElementById('userInfo');
    
    if (userNameElement && userInfoElement) {
      userNameElement.textContent = `Hallo, ${currentUser.name}!`;
      userInfoElement.style.display = 'flex';
    }
  }
}

function hideUserInfo() {
  const userInfoElement = document.getElementById('userInfo');
  if (userInfoElement) {
    userInfoElement.style.display = 'none';
  }
}

// Login verarbeiten
function handleLogin() {
  const emailElement = document.getElementById('loginEmail');
  const passwordElement = document.getElementById('loginPassword');
  
  if (!emailElement || !passwordElement) {
    alert('Fehler: Login-Felder nicht gefunden');
    return;
  }

  const email = emailElement.value.trim();
  const password = passwordElement.value;
  
  if (!validateLoginForm(email, password)) {
    return;
  }
  
  const loginBtn = document.querySelector('#loginForm .auth-btn');
  if (loginBtn) {
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
  }
  
  setTimeout(() => {
    try {
      const users = getUsersFromStorage();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        currentUser = user;
        isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        hideAuthOverlay();
        showUserInfo();
        loadUserData();
        
        showSuccessMessage('Erfolgreich angemeldet!');
        
      } else {
        showError('loginPasswordError', 'E-Mail oder Passwort ist falsch');
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
      showError('loginEmailError', 'Ein Fehler ist aufgetreten');
    }
    
    if (loginBtn) {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
    }
  }, 800);
}

// Registrierung verarbeiten
function handleRegister() {
  const nameElement = document.getElementById('registerName');
  const emailElement = document.getElementById('registerEmail');
  const passwordElement = document.getElementById('registerPassword');
  const passwordConfirmElement = document.getElementById('registerPasswordConfirm');
  
  if (!nameElement || !emailElement || !passwordElement || !passwordConfirmElement) {
    alert('Fehler: Registrierungs-Felder nicht gefunden');
    return;
  }

  const name = nameElement.value.trim();
  const email = emailElement.value.trim();
  const password = passwordElement.value;
  const passwordConfirm = passwordConfirmElement.value;
  
  if (!validateRegisterForm(name, email, password, passwordConfirm)) {
    return;
  }
  
  const registerBtn = document.querySelector('#registerForm .auth-btn');
  if (registerBtn) {
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;
  }
  
  setTimeout(() => {
    try {
      const users = getUsersFromStorage();
      
      if (users.some(u => u.email === email)) {
        showError('registerEmailError', 'Diese E-Mail ist bereits registriert');
        if (registerBtn) {
          registerBtn.classList.remove('loading');
          registerBtn.disabled = false;
        }
        return;
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      currentUser = newUser;
      isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      hideAuthOverlay();
      showUserInfo();
      
      showSuccessMessage('Registrierung erfolgreich! Willkommen bei MoneyPilot!');
      
    } catch (error) {
      console.error('Fehler bei Registrierung:', error);
      showError('registerEmailError', 'Ein Fehler ist aufgetreten');
    }
    
    if (registerBtn) {
      registerBtn.classList.remove('loading');
      registerBtn.disabled = false;
    }
  }, 1000);
}

// Logout verarbeiten
function handleLogout() {
  if (confirm('Möchten Sie sich wirklich abmelden?')) {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('currentUser');
    
    hideUserInfo();
    showAuthOverlay();
    resetApp();
    
    showSuccessMessage('Erfolgreich abgemeldet!');
  }
}

// Benutzer aus localStorage abrufen
function getUsersFromStorage() {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    return [];
  }
}

// App für neuen Benutzer zurücksetzen
function resetApp() {
    categories = [];
    monthlyBudget = 0;
    monthlyData = {};
    is50_30_20Active = false; // Explizit zurücksetzen
    updateList();
    updateChart();
    updateCircleCenter();
    updateLegendVisibility(false); // Legende verstecken
}


// Event Listeners für Auth System
function setupAuthEventListeners() {
  // Form Wechsel
  const showRegisterBtn = document.getElementById('showRegister');
  const showLoginBtn = document.getElementById('showLogin');
  
  if (showRegisterBtn) {
    showRegisterBtn.onclick = (e) => {
      e.preventDefault();
      showRegisterForm();
    };
  }
  
  if (showLoginBtn) {
    showLoginBtn.onclick = (e) => {
      e.preventDefault();
      showLoginForm();
    };
  }
  
  // Form Submissions
  const loginForm = document.getElementById('loginFormElement');
  const registerForm = document.getElementById('registerFormElement');
  
  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      handleLogin();
    };
  }
  
  if (registerForm) {
    registerForm.onsubmit = (e) => {
      e.preventDefault();
      handleRegister();
    };
  }
  
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = handleLogout;
  }
  
  // Input Validation
  setupInputValidation();
}

// Zwischen Login und Registrierung wechseln
function showRegisterForm() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm && registerForm) {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    clearAllErrors();
  }
}

function showLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm && registerForm) {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    clearAllErrors();
  }
}

// Input Validation Setup
function setupInputValidation() {
  const inputs = document.querySelectorAll('#loginForm input, #registerForm input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => clearError(input));
  });
}

// Validierungsfunktionen
function validateLoginForm(email, password) {
  let isValid = true;
  
  clearAllErrors();
  
  if (!email) {
    showError('loginEmailError', 'Bitte geben Sie Ihre E-Mail ein');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('loginEmailError', 'Bitte geben Sie eine gültige E-Mail ein');
    isValid = false;
  }
  
  if (!password) {
    showError('loginPasswordError', 'Bitte geben Sie Ihr Passwort ein');
    isValid = false;
  }
  
  return isValid;
}

function validateRegisterForm(name, email, password, passwordConfirm) {
  let isValid = true;
  
  clearAllErrors();
  
  if (!name || name.length < 2) {
    showError('registerNameError', 'Name muss mindestens 2 Zeichen haben');
    isValid = false;
  }
  
  if (!email) {
    showError('registerEmailError', 'Bitte geben Sie eine E-Mail ein');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('registerEmailError', 'Bitte geben Sie eine gültige E-Mail ein');
    isValid = false;
  }
  
  if (!password) {
    showError('registerPasswordError', 'Bitte geben Sie ein Passwort ein');
    isValid = false;
  } else if (password.length < 6) {
    showError('registerPasswordError', 'Passwort muss mindestens 6 Zeichen haben');
    isValid = false;
  }
  
  if (!passwordConfirm) {
    showError('registerPasswordConfirmError', 'Bitte bestätigen Sie Ihr Passwort');
    isValid = false;
  } else if (password !== passwordConfirm) {
    showError('registerPasswordConfirmError', 'Passwörter stimmen nicht überein');
    isValid = false;
  }
  
  return isValid;
}

function validateInput(input) {
  const value = input.value.trim();
  const id = input.id;
  
  switch(id) {
    case 'loginEmail':
    case 'registerEmail':
      if (!value) {
        showError(id + 'Error', 'E-Mail ist erforderlich');
      } else if (!isValidEmail(value)) {
        showError(id + 'Error', 'Ungültige E-Mail');
      } else {
        clearError(input);
      }
      break;
    case 'registerName':
      if (!value || value.length < 2) {
        showError('registerNameError', 'Name muss mindestens 2 Zeichen haben');
      } else {
        clearError(input);
      }
      break;
    case 'loginPassword':
    case 'registerPassword':
      if (!value) {
        showError(id + 'Error', 'Passwort ist erforderlich');
      } else if (id === 'registerPassword' && value.length < 6) {
        showError('registerPasswordError', 'Mindestens 6 Zeichen');
      } else {
        clearError(input);
      }
      break;
    case 'registerPasswordConfirm':
      const password = document.getElementById('registerPassword').value;
      if (!value) {
        showError('registerPasswordConfirmError', 'Passwort bestätigen');
      } else if (value !== password) {
        showError('registerPasswordConfirmError', 'Passwörter stimmen nicht überein');
      } else {
        clearError(input);
      }
      break;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  const inputElement = document.getElementById(elementId.replace('Error', ''));
  
  if (errorElement) {
    errorElement.textContent = message;
  }
  if (inputElement) {
    inputElement.classList.add('error');
  }
}

function clearError(input) {
  const errorElement = document.getElementById(input.id + 'Error');
  if (errorElement) {
    errorElement.textContent = '';
  }
  input.classList.remove('error');
}

function clearAllErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  const inputElements = document.querySelectorAll('input.error');
  
  errorElements.forEach(el => el.textContent = '');
  inputElements.forEach(el => el.classList.remove('error'));
}

function showSuccessMessage(message) {
  setTimeout(() => {
    alert(message);
  }, 100);
}

// Benutzerspezifische Datenverwaltung
function loadUserData() {
  if (!currentUser) return;
  
  try {
    const userDataKey = `monthlyData_${currentUser.id}`;
    const savedData = localStorage.getItem(userDataKey);
    monthlyData = savedData ? JSON.parse(savedData) : {};
    
    loadCurrentMonth();
  } catch (error) {
    console.error('Fehler beim Laden der Benutzerdaten:', error);
    monthlyData = {};
  }
}

function saveUserData() {
  if (!currentUser) return;
  
  try {
    const userDataKey = `monthlyData_${currentUser.id}`;
    localStorage.setItem(userDataKey, JSON.stringify(monthlyData));
  } catch (error) {
    console.error('Fehler beim Speichern der Benutzerdaten:', error);
  }
}

// Benutzerspezifische saveCurrentMonth Funktion
function saveCurrentMonthForUser() {
  if (!currentUser) return;
  
  try {
    const key = getMonthKey();
    // preserve existing _appliedRecurringIds and _removedRecurringIds if present
    const existing = monthlyData[key] || {};
    monthlyData[key] = {
      categories: JSON.parse(JSON.stringify(categories)),
      monthlyBudget: monthlyBudget,
      timestamp: Date.now(),
      _appliedRecurringIds: Array.isArray(existing._appliedRecurringIds) ? existing._appliedRecurringIds : [],
      _removedRecurringIds: Array.isArray(existing._removedRecurringIds) ? existing._removedRecurringIds : [],
      // preserve manual monthly budget marker so recurring templates don't overwrite explicit user edits
      _manualMonthlyBudget: existing._manualMonthlyBudget === true
    };
    
    saveUserData();
  } catch (error) {
    console.error('Fehler beim Speichern des aktuellen Monats:', error);
  }
}

// Navigation und Monatsverwaltung
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let monthlyData = {};
let currentView = 'current';

// Navigation Event Listeners
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => switchView(btn.dataset.view);
});

document.getElementById('prevMonth').onclick = () => changeMonth(-1);
document.getElementById('nextMonth').onclick = () => changeMonth(1);
document.getElementById('prevYear').onclick = () => changeYear(-1);
document.getElementById('nextYear').onclick = () => changeYear(1);

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-view="${view}"]`).classList.add('active');

  document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
  document.getElementById(view + 'View').classList.add('active');

  document.getElementById('monthNav').style.display =
    view === 'current' ? 'flex' : 'none';

  if(view === 'overview') updateOverview();
  if(view === 'yearly') updateYearlyView();
}

function changeMonth(delta) {
    saveCurrentMonthForUser();
    currentMonth += delta;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    loadCurrentMonth();
    updateMonthDisplay();
    
    // VERBESSERTE Prüfung:
    if (is503020Plan()) {
        is50_30_20Active = true;
        updateLegendVisibility(true);
    } else {
        is50_30_20Active = false;
        updateLegendVisibility(false);
    }
}

function changeYear(delta) {
  currentYear += delta;
  document.getElementById('yearTitle').textContent = currentYear + ' Jahresübersicht';
  document.getElementById('prevYear').textContent = '‹ ' + (currentYear - 1);
  document.getElementById('nextYear').textContent = (currentYear + 1) + ' ›';
  updateYearlyView();
}

function updateMonthDisplay() {
  const months = ['Januar','Februar','März','April','Mai','Juni',
                 'Juli','August','September','Oktober','November','Dezember'];
  document.getElementById('currentMonthDisplay').textContent =
    months[currentMonth] + ' ' + currentYear;
}

function getMonthKey() {
  return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
}

function loadCurrentMonth() {
  const key = getMonthKey();
  
  // Ensure month object exists and has recurring helper arrays
  if (!monthlyData[key]) {
    monthlyData[key] = {
      categories: [],
      monthlyBudget: 0,
      timestamp: Date.now(),
      _appliedRecurringIds: [],
      _removedRecurringIds: []
    };
  } else {
    if (!Array.isArray(monthlyData[key]._appliedRecurringIds)) monthlyData[key]._appliedRecurringIds = [];
    if (!Array.isArray(monthlyData[key]._removedRecurringIds)) monthlyData[key]._removedRecurringIds = [];
  }

  // Apply recurring templates for this month (idempotent)
  applyRecurringTemplatesForMonth(currentYear, currentMonth);

  // Use the stored month data as the working categories/monthlyBudget
  categories = JSON.parse(JSON.stringify(monthlyData[key].categories || []));
  monthlyBudget = monthlyData[key].monthlyBudget || 0;

  // Ensure backward compatibility: every category should have a transactions array and numeric spent
  categories.forEach(cat => {
    if (!Array.isArray(cat.transactions)) cat.transactions = [];
    if (typeof cat.spent !== 'number') cat.spent = 0;
    // Recalculate spent from transactions to ensure idempotency
    if (typeof recalcCategorySpent === 'function') recalcCategorySpent(cat);
  });
  
  updateList();
  updateChart();
  updateRetoureOptions();
  
  // HIER die 50/30/20 Prüfung hinzufügen (NACH den Updates):
  if (is503020Plan()) {
    is50_30_20Active = true;
    updateLegendVisibility(true);
  } else {
    is50_30_20Active = false;
    updateLegendVisibility(false);
  }
}



// Ensure recurring root arrays exist on the global monthlyData object
function ensureRecurringRoot() {
  if (!monthlyData._recurring) monthlyData._recurring = { incomes: [], categories: [], expenses: [] };
  if (!Array.isArray(monthlyData._recurring.incomes)) monthlyData._recurring.incomes = [];
  if (!Array.isArray(monthlyData._recurring.categories)) monthlyData._recurring.categories = [];
  if (!Array.isArray(monthlyData._recurring.expenses)) monthlyData._recurring.expenses = [];
}

// generate a reasonably unique id for recurring templates
function genUniqueId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
}

// Add delta months to a year/month pair and return { year, month }
function addMonths(year, month, delta) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

// Explicitly apply a recurring income amount to the next `count` months,
// but do not overwrite months where the user manually edited the monthly budget.
function applyIncomeToNextMonths(startYear, startMonth, amount, count) {
  for (let i = 1; i <= count; i++) {
    const { year, month } = addMonths(startYear, startMonth, i);
    const key = `${year}-${String(month + 1).padStart(2,'0')}`;
    if (!monthlyData[key]) {
      monthlyData[key] = { categories: [], monthlyBudget: 0, timestamp: Date.now(), _appliedRecurringIds: [], _removedRecurringIds: [], _manualMonthlyBudget: false };
    }
    if (!monthlyData[key]._manualMonthlyBudget) {
      monthlyData[key].monthlyBudget = Number(amount || 0);
    }
  }
  saveUserData();
}

// Materialize recurring templates into the next `monthsAhead` months starting AFTER startYear/startMonth
// This creates month entries (if missing) and copies recurring categories/expenses/incomes into them
// without overwriting any manual edits for that month (respects _manualMonthlyBudget and _removedRecurringIds).
function materializeRecurringTemplates(startYear, startMonth, monthsAhead = 12, forceOverwriteManual = false) {
  ensureRecurringRoot();

  for (let i = 1; i <= monthsAhead; i++) {
    const { year, month } = addMonths(startYear, startMonth, i);
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;

    if (!monthlyData[key]) {
      monthlyData[key] = { categories: [], monthlyBudget: 0, timestamp: Date.now(), _appliedRecurringIds: [], _removedRecurringIds: [], _manualMonthlyBudget: false };
    }

    if (!Array.isArray(monthlyData[key]._appliedRecurringIds)) monthlyData[key]._appliedRecurringIds = [];
    if (!Array.isArray(monthlyData[key]._removedRecurringIds)) monthlyData[key]._removedRecurringIds = [];

    const removed = monthlyData[key]._removedRecurringIds || [];

    // Apply recurring categories templates
    (monthlyData._recurring.categories || []).forEach(t => {
      const startDate = new Date(t.startYear, t.startMonth || 0, 1);
      const targetDate = new Date(year, month, 1);
      if (targetDate < startDate) return;
      if (removed.includes(t.id)) return;

      let cat = monthlyData[key].categories.find(c => c.__recurringCategoryId === t.id || c.label === t.label);
      if (!cat) {
        cat = { label: t.label, emoji: t.emoji || '', budget: Number(t.budget || 0), transactions: [], spent: 0, __recurringCategoryId: t.id, color: vibrantColors[monthlyData[key].categories.length % vibrantColors.length] };
        monthlyData[key].categories.push(cat);
      }
    });

    // Apply recurring expenses templates
    (monthlyData._recurring.expenses || []).forEach(t => {
      const startDate = new Date(t.startYear, t.startMonth || 0, 1);
      const targetDate = new Date(year, month, 1);
      if (targetDate < startDate) return;
      if (removed.includes(t.id)) return;

      const txId = `rec-${t.id}-${key}`;

      // Find or create category
      const catLabel = t.categoryLabel || t.category || 'Sonstiges';
      let cat = monthlyData[key].categories.find(c => c.__recurringCategoryId === (t.categoryRecurringId || t.id) || c.label === catLabel);
      if (!cat) {
        cat = { label: catLabel, emoji: t.emoji || '', budget: Number(t.budget || 0), transactions: [], spent: 0, __recurringCategoryId: t.categoryRecurringId || t.id, color: vibrantColors[monthlyData[key].categories.length % vibrantColors.length] };
        monthlyData[key].categories.push(cat);
      }

      if (!Array.isArray(cat.transactions)) cat.transactions = [];
      if (!cat.transactions.some(tx => tx.id === txId)) {
        const tx = { id: txId, type: 'expense', amount: Number(t.amount || 0), date: (new Date(year, month, 1)).toISOString(), note: t.note || 'Wiederkehrend', __recurringId: t.id };
        cat.transactions.push(tx);
      }

      if (typeof recalcCategorySpent === 'function') recalcCategorySpent(cat);
    });

    // Apply recurring incomes: choose most-recent template whose start <= targetDate
    const incomes = (monthlyData._recurring.incomes || []).filter(t => {
      const startDate = new Date(t.startYear, t.startMonth || 0, 1);
      const targetDate = new Date(year, month, 1);
      if (targetDate < startDate) return false;
      if (removed.includes(t.id)) return false;
      return true;
    });
    if (incomes.length > 0) {
      // pick the template with the latest start (largest year*12+month)
      incomes.sort((a,b) => (a.startYear*12 + (a.startMonth||0)) - (b.startYear*12 + (b.startMonth||0)));
      const latest = incomes[incomes.length - 1];
      // If forceOverwriteManual is true (user explicitly created/updated a recurring income in an earlier month)
      // overwrite the month's budget regardless of _manualMonthlyBudget. Otherwise respect manual overrides.
      if (!monthlyData[key]._manualMonthlyBudget || forceOverwriteManual) {
        monthlyData[key].monthlyBudget = Number(latest.amount || 0);
        // If forcing, clear the manual marker so recurring takes effect
        if (forceOverwriteManual) monthlyData[key]._manualMonthlyBudget = false;
        // record applied id
        if (!monthlyData[key]._appliedRecurringIds.includes(latest.id)) monthlyData[key]._appliedRecurringIds.push(latest.id);
      }
    }
  }

  saveUserData();
}

/**
 * Apply recurring templates for a given year/month (0-based month).
 * Idempotent: checks tx ids and respects monthlyData[key]._removedRecurringIds
 */
function applyRecurringTemplatesForMonth(year, month) {
  const key = `${year}-${String(month + 1).padStart(2, '0')}`;
  ensureRecurringRoot();

  // Ensure month object exists
  if (!monthlyData[key]) {
    monthlyData[key] = {
      categories: [],
      monthlyBudget: 0,
      timestamp: Date.now(),
      _appliedRecurringIds: [],
      _removedRecurringIds: []
    };
  }

  const removed = monthlyData[key]._removedRecurringIds || [];

  // Helper to find or create category by recurring template
  function ensureCategoryFromTemplate(t) {
    // t: { id, label, emoji, budget, startYear, startMonth }
    let cat = monthlyData[key].categories.find(c => c.__recurringCategoryId === t.id);
    if (!cat) {
      // try to find by label as fallback
      cat = monthlyData[key].categories.find(c => c.label === t.label);
    }
    if (!cat) {
      cat = { label: t.label, emoji: t.emoji || '', budget: Number(t.budget || 0), transactions: [], spent: 0, __recurringCategoryId: t.id, color: vibrantColors[monthlyData[key].categories.length % vibrantColors.length] };
      monthlyData[key].categories.push(cat);
    } else {
      if (!cat.__recurringCategoryId) cat.__recurringCategoryId = t.id;
    }
    return cat;
  }

  // Apply recurring expenses
  (monthlyData._recurring.expenses || []).forEach(t => {
    // only apply for months >= start (same year) and same year for now
    if (typeof t.startYear === 'number' && typeof t.startMonth === 'number') {
      const startKey = `${t.startYear}-${String(t.startMonth + 1).padStart(2,'0')}`;
      // if this month is before start, skip
      const startDate = new Date(t.startYear, t.startMonth, 1);
      const targetDate = new Date(year, month, 1);
      if (targetDate < startDate) return;
    }

    // If user removed this recurring template for this month, skip
    if (removed.includes(t.id)) return;

    const txId = `rec-${t.id}-${key}`;

    // Find or create category
    const cat = ensureCategoryFromTemplate({ id: t.categoryRecurringId || t.id, label: t.categoryLabel || t.category || 'Sonstiges', emoji: t.emoji, budget: t.budget });

    if (!Array.isArray(cat.transactions)) cat.transactions = [];
    if (!cat.transactions.some(tx => tx.id === txId)) {
      const tx = { id: txId, type: 'expense', amount: Number(t.amount || 0), date: (new Date(year, month, 1)).toISOString(), note: t.note || 'Wiederkehrend', __recurringId: t.id };
      cat.transactions.push(tx);
    }
    // recalc
    if (typeof recalcCategorySpent === 'function') recalcCategorySpent(cat);
  });

  // Apply recurring categories (templates that define categories without immediate txs)
  (monthlyData._recurring.categories || []).forEach(t => {
    const startDate = new Date(t.startYear, t.startMonth || 0, 1);
    const targetDate = new Date(year, month, 1);
    if (targetDate < startDate) return;
    if (removed.includes(t.id)) return;

    let cat = monthlyData[key].categories.find(c => c.__recurringCategoryId === t.id || c.label === t.label);
    if (!cat) {
      cat = { label: t.label, emoji: t.emoji || '', budget: Number(t.budget || 0), transactions: [], spent: 0, __recurringCategoryId: t.id, color: vibrantColors[monthlyData[key].categories.length % vibrantColors.length] };
      monthlyData[key].categories.push(cat);
    }
  });

  // Apply recurring incomes (simple monthlyBudget additions)
  (monthlyData._recurring.incomes || []).forEach(t => {
    const startDate = new Date(t.startYear, t.startMonth || 0, 1);
    const targetDate = new Date(year, month, 1);
    if (targetDate < startDate) return;
    if (removed.includes(t.id)) return;
    // For incomes, set monthlyBudget from the template unless the user manually edited the monthlyBudget for this month.
    // The presence of monthlyData[key]._manualMonthlyBudget === true indicates a manual override and must not be overwritten.
    if (!monthlyData[key]._manualMonthlyBudget) {
      monthlyData[key].monthlyBudget = Number(t.amount || 0);
    }
  });

  // Persist if we made changes
  saveUserData();
}

function updateOverview() {
   console.log('=== DEBUG START ===');
  console.log('monthlyData:', monthlyData);
  
  // Ihre bestehenden Zeilen...
  const months = Object.keys(monthlyData).filter(key => /^\d{4}-\d{2}$/.test(key)).sort().reverse();
  console.log('Monate gefunden:', months);
  
  const expenses = months.map(key => {
    const data = monthlyData[key];
    const sum = data && Array.isArray(data.categories) 
      ? data.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0)
      : 0;
    console.log(`Monat ${key}: ${sum}€`);
    return sum;
  });
  
  console.log('Expenses Array:', expenses);
  console.log('=== DEBUG ENDE ===');

  // Kennzahlen berechnen
 
  const avg3 = expenses.slice(0, 3).reduce((a, b) => a + b, 0)
             / Math.min(3, expenses.length) || 0;
  const avg6 = expenses.slice(0, 6).reduce((a, b) => a + b, 0)
             / Math.min(6, expenses.length) || 0;
  const maxExp = expenses.length ? Math.max(...expenses) : 0;
  const minExp = expenses.length ? Math.min(...expenses) : 0;

  // Anzeige updaten
  console.log('DEBUG avg3:', avg3);
console.log('Element avg3Months:', document.getElementById('avg3Months'));

  document.getElementById('avg3Months').textContent = avg3.toFixed(2) + ' €';
  document.getElementById('avg6Months').textContent = avg6.toFixed(2) + ' €';
  document.getElementById('maxExpense').textContent = maxExp.toFixed(2) + ' €';
  //document.getElementById('minExpense').textContent = minExp.toFixed(2) + ' €';

  // Verlaufsliste bauen
  const monthNames = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  const historyHtml = months.map((key, idx) => {
    const total = expenses[idx];
    const [year, m] = key.split('-');
    const monthLabel = monthNames[parseInt(m, 10) - 1];
    return `
      <div class="month-item" onclick="goToMonth('${key}')">
        <span>${monthLabel} ${year}</span>
        <span style="color: #ef4444; font-weight: 600;">
          -${total.toFixed(2)} €
        </span>
      </div>`;
  }).join('');

  document.getElementById('monthlyHistory').innerHTML = historyHtml;
}


function updateYearlyView() {
  const yearMonths = [];
  for(let m = 0; m < 12; m++) {
    const key = `${currentYear}-${String(m + 1).padStart(2, '0')}`;
    yearMonths.push({ key, month: m });
  }

  const monthNames = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  let yearTotal = 0;

  const gridHtml = yearMonths.map(({ key, month }) => {
    const data = monthlyData[key];
    const spent = data ? data.categories.reduce((sum, cat) => sum + cat.spent, 0) : 0;
    yearTotal += spent;
   
    return `
      <div class="month-card" onclick="goToMonth('${key}')">
        <h4>${monthNames[month]}</h4>
        <div class="month-expense">-${spent.toFixed(2)} €</div>
      </div>
    `;
  }).join('');

  document.getElementById('yearlyGrid').innerHTML = gridHtml;
  document.getElementById('yearTotal').textContent = yearTotal.toFixed(2) + ' €';
  document.getElementById('yearAverage').textContent = (yearTotal / 12).toFixed(2) + ' €';
}

function goToMonth(monthKey) {
  const [year, month] = monthKey.split('-');
  currentYear = parseInt(year);
  currentMonth = parseInt(month) - 1;
  loadCurrentMonth();
  updateMonthDisplay();
  switchView('current');
}

// Chart.js und Kategorien-Management
const catList = document.getElementById('cat-list');
const outCtx = document.getElementById('outChart').getContext('2d');
//const sumHistory = document.getElementById('sum-history');
const plusBtn = document.getElementById('addCircleBtn');
const moreBtn = document.getElementById('moreBtn');
const centerBudget = document.getElementById('centerBudget');
const centerSpent = document.getElementById('centerSpent');
const modal = document.getElementById('modalDialog');
const moreOptionsModal = document.getElementById('moreOptionsModal');
const modalForm = document.getElementById('modalForm');
const modalTitle = document.getElementById('modalTitle');
const modalAddCat = document.getElementById('modalAddCat');
const modalBookExpense = document.getElementById('modalBookExpense');
const modalRetoureMode = document.getElementById('modalRetoureMode');
const modalCatSelect = document.getElementById('modalCatSelect');
const modalCatName = document.getElementById('modalCatName');
const modalCatBudget = document.getElementById('modalCatBudget');
const modalEmojiSelect = document.getElementById('modalEmojiSelect');
const expenseCatName = document.getElementById('expenseCatName');
const expenseCatRest = document.getElementById('expenseCatRest');
const modalExpense = document.getElementById('modalExpense');
//const modalRetoure = document.getElementById('modalRetoure');
const retoureCatSelect = document.getElementById('retoureCatSelect');
const retoureAmount = document.getElementById('retoureAmount');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

// Mehr-Optionen Elemente
const moreCloseBtn = document.getElementById('moreCloseBtn');
const retoureOption = document.getElementById('retoureOption');
const exportOption = document.getElementById('exportOption');
//const settingsOption = document.getElementById('settingsOption');
const helpOption = document.getElementById('helpOption');

let categories = [];
let monthlyBudget = 0;

// BUNTE FARBEN FÜR CHART
const vibrantColors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7',
  '#a55eea', '#26de81', '#fd79a8', '#fdcb6e', '#e17055',
  '#00b894', '#0984e3', '#e84393', '#00cec9', '#74b9ff'
];

const allowRetoure = ['Kleidung','Elektronik','Lebensmittel','Sonstiges'];

const iconPlugin = {
  id:'segmentIcons',
  afterDatasetDraw(chart){
    const {ctx,chartArea:{height}}=chart;
    chart.getDatasetMeta(0).data.forEach((arc,i)=>{
      if(categories[i]?.emoji){
// Ersetzen Sie Zeilen 694-698 durch:
// Ersetzen Sie Zeilen 694-698 durch:
const {x,y}=arc.getCenterPoint();
ctx.save();

// Intelligente Größenberechnung mit Überlappungsschutz
const segmentAngle = arc.endAngle - arc.startAngle;
const segmentRadius = arc.outerRadius - arc.innerRadius;

// Verfügbarer Platz im Segment berechnen
const segmentArcLength = segmentAngle * arc.outerRadius; // Bogenlänge
const availableWidth = segmentArcLength * 0.6; // 60% der Bogenlänge nutzen
const availableHeight = segmentRadius * 0.6;   // 60% der Ring-Breite nutzen

// Größe basierend auf verfügbarem Platz - STRIKT begrenzt
const baseSize = Math.round(height/15);
const minSize = 16;  // Kleinere Mindestgröße
const maxSizeByAngle = Math.min(availableWidth, availableHeight); // Begrenzt durch Segment
const maxSizeByChart = baseSize;

// Finale Größe - kann NICHT größer sein als das Segment
const fontSize = Math.max(minSize, Math.min(maxSizeByAngle, maxSizeByChart));




ctx.font=`${fontSize}px Segoe UI Emoji`;
ctx.textAlign='center';
ctx.textBaseline='middle';
ctx.fillText(categories[i].emoji,x,y);
ctx.restore();

      }
    });
  }
};

// Canvas-Kontext holen
const ctx = document.getElementById('outChart').getContext('2d');
// Custom Tooltip-Container aus dem DOM
const tooltipEl = document.getElementById('customTooltip');

outChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: categories.map(c => c.label),
    datasets: [{
      data: categories.map(c => c.budget),
      backgroundColor: categories.map((_, i) => categoryColors[i % categoryColors.length]),
      borderColor: '#FFFFFF',
      borderWidth: 6,
      cutout: '75%'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false, // Standard-Tooltip deaktivieren
       external: context => {
  const { chart, tooltip } = context;
  if (tooltip.opacity === 0) {
    tooltipEl.classList.remove('show');
    return;
  }

  const idx  = tooltip.dataPoints[0].dataIndex;
  const cat  = categories[idx];
  const rest = (cat.budget - cat.spent).toFixed(2);
  const over = cat.spent > cat.budget;
  const segment = chart.getDatasetMeta(0).data[idx];

  // Tooltip-Inhalt anpassen
  tooltipEl.classList.toggle('overrun', over);
  tooltipEl.innerHTML = over
    ? `<div class="title">Budget überschritten!</div>
       <div class="rest">+${(cat.spent - cat.budget).toFixed(2)} € Overrun</div>`
    : `<div class="title">${cat.label}</div>
       <div class="rest">Restbudget: ${rest} €</div>`;
  tooltipEl.classList.add('show');

  // Segment umranden bei Überziehung
  segment.options.borderColor = over ? '#DC2626' : '#FFFFFF';
  chart.update('none');

  // Mittelpunkt des Segments
  const center = segment.getCenterPoint();

  // Offset in px
  const OFFSET = 12;

  // Position relativ zur circle-container
  const containerRect = chart.canvas.parentElement.getBoundingClientRect();
  const x = center.x + (center.x < chart.width / 2 ? -OFFSET : OFFSET);
  const y = center.y - OFFSET;

  tooltipEl.style.left = `${x}px`;
  tooltipEl.style.top  = `${y}px`;
  tooltipEl.style.position = 'absolute';
  tooltipEl.style.zIndex   = '9999';
}

      }
    },
    onHover: (e, elems) => {
      e.native.target.style.cursor = elems.length ? 'pointer' : 'default';
    },
    onClick: (e, elems) => {
      if (elems.length) openExpenseModal(elems[0].index);
    }
  },
  plugins: [iconPlugin]
});

function calcSpentSum(){return categories.reduce((s,c)=>s+c.spent,0);}

function updateCircleCenter(){
  centerBudget.textContent = monthlyBudget.toLocaleString('de-DE',{minimumFractionDigits:2})+' €';
  centerSpent.textContent = 'Ausgegeben: '+calcSpentSum().toLocaleString('de-DE',{minimumFractionDigits:2})+' €';
}
// Dynamischer Farbverlauf-Generator für unbegrenzte Kategorien
function generateInfiniteColorGradient(baseHue, saturation, lightness, categoryIndex, totalInCategory) {
    // Basis-Parameter für jede Hauptkategorie
    const baseParams = {
        'notwendig': { hue: 51, sat: 89, light: 50 },   // Gelb-Basis
        'wuensche': { hue: 207, sat: 69, light: 53 },   // Blau-Basis  
        'sparen': { hue: 145, sat: 61, light: 43 }      // Grün-Basis
    };
    
    const base = baseParams[arguments[4]] || baseParams.wuensche;
    
    // Dynamische Farbberechnung
    const hueVariation = (categoryIndex * 15) % 60;           // Farbton-Variation
    const satVariation = 20 + (categoryIndex * 8) % 40;       // Sättigung 20-60%
    const lightVariation = 30 + (categoryIndex * 12) % 50;    // Helligkeit 30-80%
    
    // Finale HSL-Werte berechnen
    const finalHue = (base.hue + hueVariation) % 360;
    const finalSat = Math.max(30, Math.min(90, base.sat - satVariation + (categoryIndex * 5)));
    const finalLight = Math.max(25, Math.min(80, base.light + lightVariation - 40));
    
    return `hsl(${finalHue}, ${finalSat}%, ${finalLight}%)`;
}

// ERWEITERTE Farbpaletten für jede Hauptkategorie (50+ Farben pro Kategorie)
function getInfiniteCategoryColors(mainCategory, categoryIndex) {
    const colorGenerators = {
        'notwendig': function(index) {
            // Gelb-Orange-Rot Spektrum (unendlich)
            const hueBase = 51; // Gelb
            const hueRange = 40; // Bis Orange-Rot
            const hue = hueBase + (index * 3) % hueRange;
            const sat = 75 + (index * 4) % 20; // 75-95%
            const light = 45 + (index * 6) % 30; // 45-75%
            return `hsl(${hue}, ${sat}%, ${light}%)`;
        },
        
        'wuensche': function(index) {
            // Blau-Cyan-Lila Spektrum (unendlich)
            const hueBase = 200; // Blau
            const hueRange = 80; // Bis Lila
            const hue = (hueBase + (index * 4)) % 360;
            const sat = 65 + (index * 3) % 25; // 65-90%
            const light = 40 + (index * 5) % 35; // 40-75%
            return `hsl(${hue}, ${sat}%, ${light}%)`;
        },
        
        'sparen': function(index) {
            // Grün-Türkis Spektrum (unendlich)
            const hueBase = 145; // Grün
            const hueRange = 50; // Bis Türkis
            const hue = hueBase + (index * 3) % hueRange;
            const sat = 60 + (index * 4) % 25; // 60-85%
            const light = 35 + (index * 7) % 40; // 35-75%
            return `hsl(${hue}, ${sat}%, ${light}%)`;
        }
    };
    
    const generator = colorGenerators[mainCategory] || colorGenerators.wuensche;
    return generator(categoryIndex);
}

// Verbesserte Kontrastversion - behält Hauptfarben bei
function getControlledContrastColor(mainCategory, categoryIndex) {
    const baseHues = {
        'notwendig': 51,   // Gelb-Basis
        'wuensche': 207,   // Blau-Basis  
        'sparen': 145      // Grün-Basis
    };
    
    const baseHue = baseHues[mainCategory] || 207;
    
    // BEGRENZTE Farbvariation - bleibt in der Kategorie-Farbe
    const hueOffsets = [0, 10, -10, 15, -15, 20, -8, 12, -12, 18];  // Kleinere Variationen
    const satLevels = [85, 70, 95, 60, 80, 75, 90, 65, 88, 72];     // Gute Sättigung
    const lightLevels = [55, 35, 70, 45, 60, 40, 65, 50, 75, 30];   // Starke Helligkeitsunterschiede
    
    const hueOffset = hueOffsets[categoryIndex % hueOffsets.length];
    const saturation = satLevels[categoryIndex % satLevels.length];
    const lightness = lightLevels[categoryIndex % lightLevels.length];
    
    const finalHue = (baseHue + hueOffset + 360) % 360;
    
    return `hsl(${finalHue}, ${saturation}%, ${lightness}%)`;
}



function updateChart() {
    // Kategorien automatisch kategorisieren und sortieren
    categorizeCategoriesAutomatically(); // Diese Zeile hinzufügen!
    
    if (categories.length === 0) {
        outChart.data.labels = [];
        outChart.data.datasets[0].data = [];
        outChart.data.datasets[0].backgroundColor = [];
        outChart.data.datasets[0].borderColor = [];
    } else {
        // Labels und Daten aus categories holen
        outChart.data.labels = categories.map(c => c.label);
        outChart.data.datasets[0].data = categories.map(c => c.budget);

        // NEUE Farbzuweisung mit Extremkontrasten
        const categoryCounters = { 'notwendig': 0, 'wuensche': 0, 'sparen': 0 };

        outChart.data.datasets[0].backgroundColor = categories.map((cat, i) => {
            const over = cat.spent > cat.budget;
            if (over) return '#95A5A6'; // Grau bei Überziehung
            
            const mainCat = cat.mainCategory || 'wuensche';
            const categoryIndex = categoryCounters[mainCat];
            categoryCounters[mainCat]++;
            
            // Extreme Kontrastfarben verwenden
            return getControlledContrastColor(mainCat, categoryIndex);
        });

        // Border-Farben setzen
        outChart.data.datasets[0].borderColor = categories.map(c =>
            c.spent > c.budget ? '#DC2626' : '#FFFFFF'
        );

        outChart.data.datasets[0].borderWidth = 2; // Statt 0
        outChart.data.datasets[0].cutout = '75%';
    }

    // Chart aktualisieren
    outChart.update();
    
    // Rest Ihrer updateChart Funktion...
    updateCircleCenter();
    saveCurrentMonthForUser();
}

  /*// Historie- und Center-Update
  sumHistory.innerHTML =
    '–' + calcSpentSum().toLocaleString('de-DE', { minimumFractionDigits: 2 }) +
    ' € <small>Spent in Monat</small>';
  updateCircleCenter();
  saveCurrentMonthForUser(); */


  categorizeCategoriesAutomatically();
    
    if (categories.length === 0) {
        outChart.data.labels = [];
        outChart.data.datasets[0].data = [];
        outChart.data.datasets[0].backgroundColor = [];
    } else {
        outChart.data.labels = categories.map(c => c.label);
        outChart.data.datasets[0].data = categories.map(c => c.budget);

        // NEUE Farbpalette - deutlich unterscheidbar
        const categoryColors = {
            'notwendig': '#FFEB3B',    // Kräftiges Gelb
            'wuensche': '#3498DB',     // Kräftiges Blau  
            'sparen': '#27AE60'        // Kräftiges Grün
        };

        // Hauptfarbe + Variationen für bessere Unterscheidung
        outChart.data.datasets[0].backgroundColor = categories.map((cat, i) => {
            const over = cat.spent > cat.budget;
            if (over) return '#95A5A6'; // Grau bei Überziehung
            
            const baseColor = categoryColors[cat.mainCategory] || categoryColors.wuensche;
            
            // Leichte Variationen innerhalb der Gruppe
            const variations = [
                baseColor,                    // Original
                baseColor + 'DD',            // 87% Opazität
                baseColor + 'BB',            // 73% Opazität
                baseColor + '99'             // 60% Opazität
            ];
            
            return variations[i % variations.length];
        });

        outChart.data.datasets[0].borderColor = '#FFFFFF';
        outChart.data.datasets[0].borderWidth = 2;
    }

    outChart.data.datasets[0].cutout = '75%';
    outChart.update();
    
    updateCircleCenter();
    saveCurrentMonthForUser();
  

// KORRIGIERTE updateList Funktion - nutzt bestehende is503020Plan() Funktion
function updateList() {
  catList.innerHTML = '';
  
  // Nutze die bestehende is503020Plan() Funktion
  if (!is503020Plan()) {
    // STANDARD-MODUS: alle Kategorien einfach ungroupiert auflisten
    console.log('Standard-Modus: Kategorien werden nicht gruppiert');
    
    categories.forEach((cat, i) => {
      const spent = cat.spent;
      const budget = cat.budget;
      const remaining = budget - spent;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;

      let progressClass = '';
      if (percentage >= 90) progressClass = 'danger';
      else if (percentage >= 70) progressClass = 'warning';

      const over = spent > budget;
      const li = document.createElement('div');
      li.className = `category-item ${over ? 'overrun' : ''}`;
      const categoryColor = vibrantColors[i % vibrantColors.length];
      li.style.setProperty('--category-color', categoryColor);

      li.innerHTML = `
        <div class="category-header">
          <div class="category-name">
            <span style="color: ${categoryColor}; font-size: 0.8em; margin-right: 0.5rem;">${cat.emoji}</span>
            ${cat.label}
          </div>
          <div class="category-amount">€${remaining.toFixed(2)}</div>
        </div>
        <div class="progress-container">
          <div class="progress-bar ${progressClass}" style="width: ${Math.min(percentage, 100)}%; background: linear-gradient(90deg, ${categoryColor}, ${categoryColor}aa);"></div>
        </div>
        <div class="category-stats">
          <span>€${spent.toFixed(2)} von €${budget.toFixed(2)}</span>
          <span>${percentage.toFixed(0)}%</span>
        </div>
        <button class="delete-btn" title="Kategorie löschen">×</button>
      `;

      // Event Listeners hinzufügen
      li.querySelector('.delete-btn').onclick = (e) => {
        e.stopPropagation();
        categories.splice(i, 1);
        updateList();
        updateChart();
        updateRetoureOptions();
      };

      li.onclick = () => openExpenseModal(i);
      catList.appendChild(li);
    });
    
  } else {
    // 50/30/20 GRUPPEN-MODUS: Kategorien nach Hauptkategorien gruppieren
    console.log('50/30/20 Gruppen-Modus: Kategorien werden gruppiert');
    
    // Hauptkategorien definieren
    const mainCategories = [
      { key: 'notwendig', label: '🟡 Notwendiges (50%)', color: '#FFD700' },
      { key: 'wuensche', label: '🔵 Wünsche (30%)', color: '#4169E1' },
      { key: 'sparen', label: '🟢 Sparen (20%)', color: '#32CD32' }
    ];

    mainCategories.forEach(mainCat => {
      // Kategorien für diese Hauptkategorie filtern
      const categoriesInGroup = categories.filter(cat => cat.mainCategory === mainCat.key);

      if (categoriesInGroup.length === 0) return; // Überspringe leere Gruppen

      // Hauptkategorie-Header erstellen
      const groupHeader = document.createElement('div');
      groupHeader.className = 'category-group-header';
      groupHeader.style.cssText = `
        background: linear-gradient(135deg, ${mainCat.color}22, ${mainCat.color}11);
        border: 1px solid ${mainCat.color}44;
        border-radius: 12px;
        padding: 1rem;
        margin: 1.5rem 0 1rem 0;
        text-align: center;
        font-weight: bold;
        font-size: 1.1rem;
        color: var(--color-text);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      `;
      
      // Gesamtsummen für die Gruppe berechnen
      const totalBudget = categoriesInGroup.reduce((sum, cat) => sum + cat.budget, 0);
      const totalSpent = categoriesInGroup.reduce((sum, cat) => sum + cat.spent, 0);
      const remaining = totalBudget - totalSpent;
      
      groupHeader.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${mainCat.label}</span>
          <span style="font-family: var(--font-family-mono); color: ${totalSpent > totalBudget ? '#ef4444' : '#10b981'};">
            €${remaining.toFixed(2)} verbleibend
          </span>
        </div>
        <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem;">
          €${totalSpent.toFixed(2)} von €${totalBudget.toFixed(2)} ausgegeben
        </div>
      `;
      
      catList.appendChild(groupHeader);

      // Kategorien in dieser Gruppe anzeigen
      categoriesInGroup.forEach((cat, localIndex) => {
        const globalIndex = categories.indexOf(cat);
        const spent = cat.spent;
        const budget = cat.budget;
        const remaining = budget - spent;
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;

        let progressClass = '';
        if (percentage >= 90) progressClass = 'danger';
        else if (percentage >= 70) progressClass = 'warning';

        const over = spent > budget;
        const li = document.createElement('div');
        li.className = `category-item ${over ? 'overrun' : ''} grouped-item`;
        const categoryColor = vibrantColors[globalIndex % vibrantColors.length];
        li.style.setProperty('--category-color', categoryColor);
        
        // Leichte Einrückung für gruppierte Items
        li.style.marginLeft = '1rem';
        li.style.marginBottom = '0.5rem';

        li.innerHTML = `
          <div class="category-header">
            <div class="category-name">
              <span style="color: ${categoryColor}; font-size: 0.8em; margin-right: 0.5rem;">${cat.emoji}</span>
              ${cat.label}
            </div>
            <div class="category-amount">€${remaining.toFixed(2)}</div>
          </div>
          <div class="progress-container">
            <div class="progress-bar ${progressClass}" style="width: ${Math.min(percentage, 100)}%; background: linear-gradient(90deg, ${categoryColor}, ${categoryColor}aa);"></div>
          </div>
          <div class="category-stats">
            <span>€${spent.toFixed(2)} von €${budget.toFixed(2)}</span>
            <span>${percentage.toFixed(0)}%</span>
          </div>
          <button class="delete-btn" title="Kategorie löschen">×</button>
        `;

        // Event Listeners hinzufügen
        li.querySelector('.delete-btn').onclick = (e) => {
          e.stopPropagation();
          categories.splice(globalIndex, 1);
          updateList();
          updateChart();
          updateRetoureOptions();
        };

        li.onclick = () => openExpenseModal(globalIndex);
        catList.appendChild(li);
      });
    });
  }
}


// Create a Details modal (singleton)
function createDetailsModal() {
  if (document.getElementById('detailsModal')) return;
  const d = document.createElement('dialog');
  d.id = 'detailsModal';
  d.className = 'details-modal';
  d.innerHTML = `
    <div class="details-header">
      <h3 id="detailsTitle">Details</h3>
      <button id="detailsClose" class="close-btn">×</button>
    </div>
    <div id="detailsContent" class="details-content"></div>
  `;
  document.body.appendChild(d);
  document.getElementById('detailsClose').onclick = () => d.close();
}

// Show category transactions in a details modal
function showDetails(categoryIndex) {
  const cat = categories[categoryIndex];
  if (!cat) return;
  createDetailsModal();
  const modal = document.getElementById('detailsModal');
  const title = document.getElementById('detailsTitle');
  const content = document.getElementById('detailsContent');

  title.textContent = `${cat.emoji} ${cat.label} — Transaktionen`;

  // clone & safety
  const txs = Array.isArray(cat.transactions) ? cat.transactions.slice() : [];
  // sort chronologically descending (newest first) -> but requirement: chronological (older first)
  txs.sort((a,b) => new Date(a.date) - new Date(b.date));

  if (txs.length === 0) {
    content.innerHTML = '<div class="no-transactions">Keine Transaktionen vorhanden.</div>';
    modal.showModal();
    return;
  }

  content.innerHTML = '';
  txs.forEach((tx, idx) => {
    const row = document.createElement('div');
    row.className = 'details-row';

    const date = new Date(tx.date);
    const dateStr = `${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}.${date.getFullYear()}`;

    const amountSpan = document.createElement('span');
    amountSpan.className = 'details-amount';
    if (tx.type === 'retour') {
      amountSpan.style.color = '#16a34a'; // green
      amountSpan.textContent = `+${tx.amount.toFixed(2)} €`;
    } else {
      amountSpan.style.color = '#ef4444'; // red
      amountSpan.textContent = `-${tx.amount.toFixed(2)} €`;
    }

    const dateSpan = document.createElement('div');
    dateSpan.className = 'details-date';
    dateSpan.textContent = dateStr;

    // delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'details-delete';
    delBtn.title = 'Eintrag löschen';
    delBtn.innerHTML = '×';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      if (!confirm('Soll dieser Eintrag wirklich gelöscht werden?')) return;
      // find by id and remove
      const idxInCat = (cat.transactions || []).findIndex(t => t.id === tx.id);
      if (idxInCat >= 0) {
        // If this transaction originated from a recurring template, record removal for this month
        if (tx && typeof tx.__recurringId === 'string') {
          const key = getMonthKey();
          if (!monthlyData[key]) monthlyData[key] = { categories: JSON.parse(JSON.stringify(categories)), monthlyBudget, timestamp: Date.now(), _appliedRecurringIds: [], _removedRecurringIds: [] };
          if (!Array.isArray(monthlyData[key]._removedRecurringIds)) monthlyData[key]._removedRecurringIds = [];
          if (!monthlyData[key]._removedRecurringIds.includes(tx.__recurringId)) monthlyData[key]._removedRecurringIds.push(tx.__recurringId);
        }

        // remove tx and recompute spent (returns are treated as negative amounts)
        cat.transactions.splice(idxInCat, 1);
        if (typeof recalcCategorySpent === 'function') recalcCategorySpent(cat);

        // persist the change including the removedRecurringIds marker
        saveCurrentMonthForUser();
        saveUserData();
        updateList();
        updateChart();
        // re-render modal
        showDetails(categoryIndex);
      }
    };

  const topRow = document.createElement('div');
  topRow.className = 'details-top';
  // left: date
  topRow.appendChild(dateSpan);

  // right group: amount + small delete button
  const rightGroup = document.createElement('div');
  rightGroup.className = 'details-right';
  rightGroup.appendChild(amountSpan);
  rightGroup.appendChild(delBtn);

  topRow.appendChild(rightGroup);

    row.appendChild(topRow);

    if (tx.note) {
      const noteRow = document.createElement('div');
      noteRow.className = 'details-note';
      noteRow.textContent = tx.note;
      row.appendChild(noteRow);
    }

    content.appendChild(row);
  });

  modal.showModal();
}

function updateRetoureOptions(){
  retoureCatSelect.innerHTML = '<option value="">Kategorie wählen...</option>';
  categories.forEach((cat,i)=>{
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${cat.emoji} ${cat.label}`;
    retoureCatSelect.appendChild(option);
  });
}

function editMonthlyBudget(){
  const modalEl = document.getElementById('monthlyBudgetModal');
  const input = document.getElementById('monthlyBudgetInput');
  const saveBtn = document.getElementById('monthlyBudgetSave');
  const cancelBtn = document.getElementById('monthlyBudgetCancel');

  // If the modal or its controls are not present, fall back to the old prompt
  if (!modalEl || !input || !saveBtn || !cancelBtn) {
    const newBudget = prompt('Monatsbudget eingeben:', monthlyBudget);
    if (newBudget !== null && !isNaN(newBudget) && newBudget >= 0) {
      monthlyBudget = parseFloat(newBudget);
      updateCircleCenter();
      saveCurrentMonthForUser();
    }
    return;
  }

  // Populate input with current value
  input.value = monthlyBudget;

  // Reset handlers to avoid duplicate attachments
  saveBtn.onclick = null;
  cancelBtn.onclick = null;

  saveBtn.onclick = () => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && val >= 0) {
      monthlyBudget = val;
      updateCircleCenter();
      // If the user marked this as recurring income, create a recurring template
      try {
        const recurringChecked = document.getElementById('recurringIncome') && document.getElementById('recurringIncome').checked;
        if (recurringChecked) {
          ensureRecurringRoot();
          // Create a recurring income template (or update an existing one that starts in this month)
          let tpl = (monthlyData._recurring.incomes || []).find(t => t.startYear === currentYear && t.startMonth === currentMonth);
          if (!tpl) {
            const id = genUniqueId();
            tpl = { id, startYear: currentYear, startMonth: currentMonth, amount: val };
            monthlyData._recurring.incomes.push(tpl);
          } else {
            tpl.amount = val;
          }
          // Materialize this recurring income into the next 12 months and force overwrite manual budgets
          materializeRecurringTemplates(currentYear, currentMonth, 12, true);
        }
      } catch (err) { console.error('Fehler beim Anlegen recurring income:', err); }

      // Mark this month as manually edited unless the user chose to make it recurring.
      const key = getMonthKey();
      if (!monthlyData[key]) monthlyData[key] = { categories: JSON.parse(JSON.stringify(categories)), monthlyBudget, timestamp: Date.now(), _appliedRecurringIds: [], _removedRecurringIds: [], _manualMonthlyBudget: true };
      // If user marked recurringIncome, we just created/updated a recurring template and forced materialization.
      // In that case clear the manual marker so the recurring template becomes authoritative for following months.
      const recurringChecked2 = document.getElementById('recurringIncome') && document.getElementById('recurringIncome').checked;
      if (recurringChecked2) {
        monthlyData[key]._manualMonthlyBudget = false;
      } else {
        monthlyData[key]._manualMonthlyBudget = true;
      }

      saveCurrentMonthForUser();
      // NOTE: The recurring checkbox (#recurringIncome) is left as a UI hook;
      // actual recurring-template logic will be implemented separately.
      modalEl.close();
    } else {
      alert('Bitte ein gültiges Monatsbudget eingeben.');
    }
  };

  cancelBtn.onclick = () => {
    modalEl.close();
  };

  modalEl.showModal();
}

// Modal Handlers
modalCatSelect.onchange = function() {
  if (this.value === 'custom') {
    modalCatName.style.display = 'block';
    modalCatName.required = true;
    modalCatName.focus();
  } else {
    modalCatName.style.display = 'none';
    modalCatName.required = false;
    modalCatName.value = '';
  }
};

// Button Event Listeners
plusBtn.onclick = () => openCatModal();
moreBtn.onclick = () => moreOptionsModal.showModal();
cancelBtn.onclick = () => modal.close();
moreCloseBtn.onclick = () => moreOptionsModal.close();

// Mehr-Optionen Handler
retoureOption.onclick = () => {
  moreOptionsModal.close();
  openRetoureModal();
};

exportOption.onclick = () => {
  moreOptionsModal.close();
  exportData();
};

/*settingsOption.onclick = () => {
  moreOptionsModal.close();
  alert('Einstellungen kommen bald!');
};*/

helpOption.onclick = () => {
  moreOptionsModal.close();
  showHelp();
};

function openCatModal() {
  modalTitle.textContent = "Neue Kategorie/Budget anlegen";
  modalAddCat.style.display = "";
  modalBookExpense.style.display = "none";
  modalRetoureMode.style.display = "none";

  // Felder zurücksetzen
  modalCatSelect.value = "";
  modalCatName.value = "";
  modalCatName.style.display = "none";
  modalCatName.required = false;
  modalCatBudget.value = "";
  modalEmojiSelect.value = "";

  // Modal öffnen
  modal.showModal();

  // Hauptkategorie-Dropdown (modalParentSelect) ein-/ausblenden
  const mainCatSelect = document.getElementById("modalParentSelect");
  
  if (is503020Plan()) {
    // Im 50/30/20 Plan sichtbar und required
    mainCatSelect.style.display = "";
    mainCatSelect.required = true;
  } else {
    // Im normalen Plan ausblenden und nicht required
    mainCatSelect.style.display = "none";
    mainCatSelect.required = false;
  }

  modalCatSelect.focus();

  saveBtn.onclick = () => {
    const categoryName = modalCatSelect.value === 'custom' ? modalCatName.value.trim() : modalCatSelect.value;
    const budget = parseFloat(modalCatBudget.value);
    const emoji = modalEmojiSelect.value;
   
    // Validierung: Hauptkategorie nur im 50/30/20 Plan prüfen
    const mainCatValid = !is503020Plan() || !!mainCatSelect.value;
    
    if (!categoryName || isNaN(budget) || budget <= 0 || !mainCatValid) {
      alert('Bitte alle Felder korrekt ausfüllen!');
      return;
    }
    
    // Create category in current month
    const cat = { 
      label: categoryName, 
      emoji: emoji, 
      budget: budget, 
      spent: 0, 
      transactions: [], 
      color: vibrantColors[categories.length % vibrantColors.length],
      mainCategory: is503020Plan() ? mainCatSelect.value : null
    };
    categories.push(cat);

    // If recurring checkbox checked, create recurring template and persist
    try {
      ensureRecurringRoot();
      const recurringChecked = document.getElementById('recurringCategory') && document.getElementById('recurringCategory').checked;
  if (recurringChecked) {
        const id = genUniqueId();
        const tpl = { id, startYear: currentYear, startMonth: currentMonth, label: categoryName, emoji, budget };
        monthlyData._recurring.categories.push(tpl);
        cat.__recurringCategoryId = id;
        // Materialize recurring category into next 12 months
        materializeRecurringTemplates(currentYear, currentMonth, 12);
        saveUserData();
      }
    } catch (err) {
      console.error('Fehler beim Anlegen recurring category:', err);
    }

    // persist current month
    const existingKey = monthlyData[getMonthKey()] || {};
    monthlyData[getMonthKey()] = { 
      categories: JSON.parse(JSON.stringify(categories)), 
      monthlyBudget, 
      timestamp: Date.now(), 
      _appliedRecurringIds: existingKey._appliedRecurringIds || [], 
      _removedRecurringIds: existingKey._removedRecurringIds || [], 
      _manualMonthlyBudget: existingKey._manualMonthlyBudget === true 
    };

    updateList();
    updateChart();
    updateRetoureOptions();
    modal.close();
  };
}


function openExpenseModal(idx){
  const cat = categories[idx];
  modalTitle.textContent = "Buchung für: " + cat.label;
  modalAddCat.style.display = "none";
  modalBookExpense.style.display = "";
  modalRetoureMode.style.display = "none";
  expenseCatName.textContent = cat.emoji + ' ' + cat.label;
  expenseCatRest.textContent = (cat.budget - cat.spent).toLocaleString('de-DE', {minimumFractionDigits: 2});
  modalExpense.value = "";
  //modalRetoure.checked = false;

  const canRetoure = allowRetoure.includes(cat.label);
  //modalRetoure.parentElement.style.display = canRetoure ? 'block' : 'none';

  ensureExpenseModalFields();
  modal.showModal();
  modalExpense.focus();

  saveBtn.onclick = () => {
    const val = parseFloat(modalExpense.value);
    if (isNaN(val) || val <= 0) {
      alert('Bitte gültigen Betrag eingeben!');
      return;
    }

    // optional date & note fields inside the expense modal (if present in DOM)
    const dateInput = document.getElementById('modalExpenseDate');
    const noteInput = document.getElementById('modalExpenseNote');
    let txDate = new Date();
    if (dateInput && dateInput.value) {
      const d = new Date(dateInput.value);
      if (!isNaN(d)) txDate = d;
    }
    const note = noteInput ? noteInput.value.trim() : '';

    // ensure transactions array exists
    if (!Array.isArray(cat.transactions)) cat.transactions = [];

    // Check recurring checkbox for expenses
    const recurringChecked = document.getElementById('recurringExpense') && document.getElementById('recurringExpense').checked;

  if (recurringChecked) {
      // create recurring template
      try {
        ensureRecurringRoot();
        const id = genUniqueId();
        // persist template
        const tpl = { id, startYear: currentYear, startMonth: currentMonth, amount: val, categoryLabel: cat.label, emoji: cat.emoji };
        monthlyData._recurring.expenses.push(tpl);

        // create tx with deterministic id for this month
        const key = getMonthKey();
        const txId = `rec-${id}-${key}`;
        if (!Array.isArray(cat.transactions)) cat.transactions = [];
        cat.transactions.push({ id: txId, type: 'expense', amount: val, date: txDate.toISOString(), note, __recurringId: id });

  // Materialize recurring expense into next 12 months
  materializeRecurringTemplates(currentYear, currentMonth, 12);
  saveUserData();
      } catch (err) { console.error('Fehler beim Anlegen recurring expense:', err); }
      // recalc
      if (typeof recalcCategorySpent === 'function') recalcCategorySpent(cat);
    } else {
      // regular expense
      if (!Array.isArray(cat.transactions)) cat.transactions = [];
      cat.transactions.push({ id: Date.now().toString(), type: 'expense', amount: val, date: txDate.toISOString(), note });
      if (typeof recalcCategorySpent === 'function') recalcCategorySpent(cat);
    }

    updateList();
    updateChart();
    saveCurrentMonthForUser();
    modal.close();
  };
}

// ensure fields for retoure modal
function ensureRetoureModalFields() {
  if (!document.getElementById('modalRetoureDate')) {
    const parent = modalRetoureMode;
    if (!parent) return;
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Datum';
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'modalRetoureDate';
    dateInput.className = 'form-control';
    const today = new Date();
    dateInput.value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const noteLabel = document.createElement('label');
    noteLabel.textContent = 'Notiz (optional)';
    const noteInput = document.createElement('textarea');
    noteInput.id = 'modalRetoureNote';
    noteInput.className = 'form-control';
    noteInput.placeholder = 'Notiz (optional)';

    parent.appendChild(dateLabel);
    parent.appendChild(dateInput);
    parent.appendChild(noteLabel);
    parent.appendChild(noteInput);
  }
}

// Recalculate category.spent from transactions
function recalcCategorySpent(cat) {
  if (!cat || !Array.isArray(cat.transactions)) { cat.spent = 0; return; }
  // Treat 'retour' transactions as negative contributions to spent
  cat.spent = cat.transactions.reduce((s, tx) => {
    const amt = Number(tx.amount || 0);
    if (tx.type === 'retour') return s - amt;
    return s + amt;
  }, 0);
  if (cat.spent < 0) cat.spent = 0;
}

// Ensure expense modal has date & note inputs (create if not present)
function ensureExpenseModalFields() {
  if (!document.getElementById('modalExpenseDate')) {
    const parent = modalBookExpense;
    if (!parent) return;
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Datum';
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'modalExpenseDate';
    dateInput.className = 'form-control';
    // default to today
    const today = new Date();
    dateInput.value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const noteLabel = document.createElement('label');
    noteLabel.textContent = 'Notiz (optional)';
    const noteInput = document.createElement('textarea');
    noteInput.id = 'modalExpenseNote';
    noteInput.className = 'form-control';
    noteInput.placeholder = 'Notiz (optional)';

    parent.appendChild(dateLabel);
    parent.appendChild(dateInput);
    parent.appendChild(noteLabel);
    parent.appendChild(noteInput);
  }
}



function openRetoureModal(){
  if(categories.length === 0){
    alert('Erst Kategorien anlegen!');
    return;
  }
  modalTitle.textContent = "Retoure verbuchen";
  modalAddCat.style.display = "none";
  modalBookExpense.style.display = "none";
  modalRetoureMode.style.display = "";
  retoureCatSelect.value = "";
  retoureAmount.value = "";
  updateRetoureOptions();
  ensureRetoureModalFields();
  modal.showModal();
  retoureCatSelect.focus();

  saveBtn.onclick = () => {
    const catIdx = parseInt(retoureCatSelect.value);
    const amount = parseFloat(retoureAmount.value);
   
    if(isNaN(catIdx) || isNaN(amount) || amount <= 0){
      alert('Bitte Kategorie und Betrag angeben!');
      return;
    }
   
    const cat = categories[catIdx];
    if (!Array.isArray(cat.transactions)) cat.transactions = [];
    // read optional date & note
    const dateInput = document.getElementById('modalRetoureDate');
    const noteInput = document.getElementById('modalRetoureNote');
    let txDate = new Date();
    if (dateInput && dateInput.value) {
      const d = new Date(dateInput.value);
      if (!isNaN(d)) txDate = d;
    }
    const note = noteInput ? noteInput.value.trim() : '';

  // remove amount from spent (retour increases available budget)
  // we'll push a retour tx and then recompute
  cat.transactions.push({ id: Date.now().toString(), type: 'retour', amount: amount, date: txDate.toISOString(), note });
  if (typeof recalcCategorySpent === 'function') recalcCategorySpent(cat);
    updateList();
    updateChart();
    saveCurrentMonthForUser();
    modal.close();
  };
}

// Hilfsfunktionen
function exportData() {
  const data = {
    monthlyData: monthlyData,
    currentMonth: currentMonth,
    currentYear: currentYear,
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MoneyPilot-Export-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showHelp() {
  alert(`MoneyPilot Hilfe:

📊 Aktueller Monat: Verwalte deine monatlichen Budgets
📈 Monatsübersicht: Siehe Durchschnittswerte und Historie 
📅 Jahresansicht: Übersicht über das komplette Jahr

➕ Plus-Button: Neue Kategorie hinzufügen
︙ Mehr-Button: Weitere Optionen wie Retouren
🎯 Klick auf Kategorien: Ausgaben hinzufügen

💡 Tipp: Klicke auf das Monatsbudget zum Bearbeiten!`);
}

// Modal Event Listener
modal.addEventListener('close', () => {
  modalForm.reset();
  modalCatName.style.display = 'none';
  modalCatName.required = false;
  saveBtn.onclick = null;
});

// App Initialisierung
function init() {
  // Auth System zuerst initialisieren
    // Auth System zuerst initialisieren
    initAuthSystem();
    
    // Auth Event Listeners einrichten  
    setupAuthEventListeners();
    
    // Nur wenn angemeldet, normale App-Initialisierung
    if (isAuthenticated) {
        loadUserData();
        updateMonthDisplay();
        updateList();
        updateChart();
        updateRetoureOptions();
        updateCircleCenter();
        
        // Legende initial verstecken für regulären Plan
        updateLegendVisibility(false);
    }
    
    // Jahr-Navigation Setup
    document.getElementById('prevYear').textContent = '‹ ' + (currentYear - 1);
    document.getElementById('nextYear').textContent = (currentYear + 1) + ' ›';
  }

// 50/30/20 Budgetplaner UI- und Logik-Integration
const budgetPlanOption = document.getElementById('budgetPlanOption');
const budgetPlanModal = document.getElementById('budgetPlanModal');
const budgetPlanForm = document.getElementById('budgetPlanForm');
const budgetPlanCancel = document.getElementById('budgetPlanCancel');
const plannerIncome = document.getElementById('plannerIncome');
const plannerResult = document.getElementById('plannerResult');

if (budgetPlanOption) {
    budgetPlanOption.onclick = () => {
        plannerIncome.value = '';
        plannerResult.innerHTML = '';
        budgetPlanModal.showModal();
    };
}
if (budgetPlanCancel) {
    budgetPlanCancel.onclick = () => budgetPlanModal.close();
}
if (budgetPlanForm) {
  // The basic 50/30/20 variant has been removed. Submitting the planner
  // now triggers the complete automatic budget plan creation only.
  budgetPlanForm.onsubmit = e => {
    e.preventDefault();
    createComplete503020Budget();
  };
  // Ensure the Apply button (if present) also triggers the complete planner
  const applyBtn = document.getElementById('budgetPlanApply');
  if (applyBtn) applyBtn.onclick = createComplete503020Budget;
} 


// Globale Variablen für das 50/30/20 System
let is50_30_20Active = true;
let needsChart, wantsChart, savingsChart;

// Charts für Mini-Kreise initialisieren
function initMiniCharts() {
    console.log('Initialisiere Mini-Charts...');
    
    const needsCtx = document.getElementById('needsChart');
    const wantsCtx = document.getElementById('wantsChart');
    const savingsCtx = document.getElementById('savingsChart');
    
    if (!needsCtx || !wantsCtx || !savingsCtx) {
        console.error('Canvas Elemente nicht gefunden');
        return;
    }
    
    const commonConfig = {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderColor: '#FFFFFF',
                borderWidth: 2,
                cutout: '60%'
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value.toFixed(2)} €`;
                        }
                    }
                }
            },
            animation: { 
                animateRotate: true, 
                duration: 800 
            }
        }
    };
    
    try {
        needsChart = new Chart(needsCtx.getContext('2d'), JSON.parse(JSON.stringify(commonConfig)));
        wantsChart = new Chart(wantsCtx.getContext('2d'), JSON.parse(JSON.stringify(commonConfig)));
        savingsChart = new Chart(savingsCtx.getContext('2d'), JSON.parse(JSON.stringify(commonConfig)));
        
        console.log('Mini-Charts erfolgreich initialisiert');
        
        // Initial leere Charts rendern
        updateMiniCharts();
    } catch (error) {
        console.error('Fehler beim Initialisieren der Mini-Charts:', error);
    }
}

// 50/30/20 Plan erweiterte Anwendung
function enhanced50_30_20Plan() {
    return;
}
    

// Mini-Kreise anzeigen mit Animation
function showSubcircles() {
    console.log('Zeige Subcircles...');
    const container = document.getElementById('subcircleContainer');
    if (container) {
        container.style.display = 'block';
        
        // Animation hinzufügen
        setTimeout(() => {
            container.classList.add('show');
            initMiniCharts();
        }, 100);
        
        setTimeout(() => updateMiniCharts(), 300);
    }
}

// Mini-Kreise verstecken
function hideSubcircles() {
    const container = document.getElementById('subcircleContainer');
    if (container) {
        container.classList.remove('show');
        setTimeout(() => {
            container.style.display = 'none';
        }, 500);
    }
    is50_30_20Active = false;
}

// Mini-Charts aktualisieren
function updateMiniCharts() {
    if (!is50_30_20Active || !needsChart || !wantsChart || !savingsChart) {
        console.log('Mini-Charts nicht verfügbar oder 50/30/20 nicht aktiv');
        return;
    }
    
    console.log('Aktualisiere Mini-Charts...');
    
    // Kategorien nach Hauptkategorien gruppieren
    const needsCategories = categories.filter(c => c.mainCategory === 'notwendig');
    const wantsCategories = categories.filter(c => c.mainCategory === 'wuensche');
    const savingsCategories = categories.filter(c => c.mainCategory === 'sparen');
    
    // Farben für Unterkategorien
    const subcategoryColors = [
        '#0177FF', '#3399FF', '#66CCFF', '#00E5FF', '#00FFC3',
        '#00FF7A', '#66FF33', '#CCFF33', '#E5FF00', '#AFFF00',
        '#FF6B35', '#FF8E53', '#FFB07A', '#FFD700', '#FFA500'
    ];
    
    // Charts aktualisieren
    updateSingleMiniChart(needsChart, needsCategories, subcategoryColors, 'needsBudget', 'needsSpent');
    updateSingleMiniChart(wantsChart, wantsCategories, subcategoryColors, 'wantsBudget', 'wantsSpent');
    updateSingleMiniChart(savingsChart, savingsCategories, subcategoryColors, 'savingsBudget', 'savingsSpent');
}

// Einzelnen Mini-Chart aktualisieren
function updateSingleMiniChart(chart, categoryData, colors, budgetElementId, spentElementId) {
    if (!chart) return;
    
    const totalBudget = categoryData.reduce((sum, cat) => sum + cat.budget, 0);
    const totalSpent = categoryData.reduce((sum, cat) => sum + cat.spent, 0);
    
    // Budget und Ausgaben im Zentrum anzeigen
    const budgetElement = document.getElementById(budgetElementId);
    const spentElement = document.getElementById(spentElementId);
    
    if (budgetElement) budgetElement.textContent = `${totalBudget.toFixed(0)} €`;
    if (spentElement) spentElement.textContent = `${totalSpent.toFixed(0)} €`;
    
    if (categoryData.length === 0) {
        // Leeren Chart anzeigen
        chart.data.labels = ['Keine Kategorien'];
        chart.data.datasets[0].data = [1];
        chart.data.datasets[0].backgroundColor = ['#E5E7EB'];
    } else {
        // Kategorien mit Daten anzeigen
        chart.data.labels = categoryData.map(c => c.label);
        chart.data.datasets[0].data = categoryData.map(c => Math.max(c.budget, 0.1)); // Mindestens 0.1 für Sichtbarkeit
        chart.data.datasets[0].backgroundColor = categoryData.map((c, i) => {
            const over = c.spent > c.budget;
            return over ? '#DC2626' : colors[i % colors.length];
        });
    }
    
    chart.update('none');
}

// Erweiterte Kategorie hinzufügen Funktion
function enhanceAddCategoryModal() {
    const categorySelect = document.getElementById('categorySelect');
    const mainCategoryDiv = document.getElementById('mainCategoryDiv');
    
    if (!categorySelect || !mainCategoryDiv) return;
    
    // Hauptkategorie Feld anzeigen/verstecken basierend auf 50/30/20 Status
    function toggleMainCategoryField() {
        if (is50_30_20Active) {
            mainCategoryDiv.style.display = 'block';
        } else {
            mainCategoryDiv.style.display = 'none';
        }
    }
    
    // Initial prüfen
    toggleMainCategoryField();
    
    // Überschreibe die addCategory Funktion
    const originalAddCategory = window.addCategory;
    if (originalAddCategory) {
        window.addCategory = function() {
            const categorySelect = document.getElementById('categorySelect');
            const customCategory = document.getElementById('customCategory');
            const emojiSelect = document.getElementById('emojiSelect');
            const budgetInput = document.getElementById('budgetInput');
            const mainCategorySelect = document.getElementById('mainCategorySelect');
            
            const categoryName = categorySelect.value === 'custom' ? customCategory.value.trim() : categorySelect.value;
            const selectedEmoji = emojiSelect.value;
            const budget = parseFloat(budgetInput.value) || 0;
            const mainCategory = mainCategorySelect ? mainCategorySelect.value : '';
            
            if (!categoryName) {
                alert('Bitte wähle eine Kategorie aus oder gib eine eigene ein!');
                return;
            }
            
            if (categories.some(c => c.label === categoryName)) {
                alert('Diese Kategorie existiert bereits!');
                return;
            }
            
            // Neue Kategorie erstellen
            const newCategory = {
                label: categoryName,
                emoji: selectedEmoji,
                budget: budget,
        spent: 0,
        transactions: []
            };
            
            // Bei 50/30/20 System Hauptkategorie hinzufügen
            if (is50_30_20Active && mainCategory) {
                newCategory.mainCategory = mainCategory;
            }
            
            categories.push(newCategory);
            
            // UI aktualisieren
            updateList();
            updateChart();
            updateCircleCenter();
            if (is50_30_20Active) updateMiniCharts();
            updateRetoureOptions();
            saveCurrentMonthForUser();
            
            // Modal schließen und zurücksetzen
            document.getElementById('addModal').close();
            resetAddForm();
        };
    }
    
    // Modal Öffnung erweitern
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        const originalClick = addCategoryBtn.onclick;
        addCategoryBtn.onclick = function() {
            toggleMainCategoryField();
            if (originalClick) originalClick();
        };
    }
}

// Formular zurücksetzen
function resetAddForm() {
    document.getElementById('categorySelect').value = '';
    document.getElementById('customCategory').value = '';
    document.getElementById('emojiSelect').value = '🏠';
    document.getElementById('budgetInput').value = '';
    
    const mainCategorySelect = document.getElementById('mainCategorySelect');
    if (mainCategorySelect) mainCategorySelect.value = '';
    
    document.getElementById('customCategoryDiv').style.display = 'none';
}

// Erweiterte Daten laden Funktion
function enhanceDataLoading() {
    const originalLoadCurrentMonth = window.loadCurrentMonth;
    if (originalLoadCurrentMonth) {
        window.loadCurrentMonth = function() {
            originalLoadCurrentMonth();
            
            // Prüfen ob 50/30/20 System aktiv ist
            if (categories.some(c => c.mainCategory)) {
                is50_30_20Active = true;
                showSubcircles();
            } else {
                hideSubcircles();
            }
        };
    }
}
// Zeige die Legende nur, wenn der 50/30/20-Plan aktiv ist
function updateLegendVisibility(isBudgetPlanActive) {
    const showLegend = () => {
        const legend = document.querySelector('.simple-legend');
        if (legend) {
            if (isBudgetPlanActive) {
                legend.classList.add('show');
                legend.style.display = 'flex';
                console.log('✅ Legende angezeigt');
            } else {
                legend.classList.remove('show');
                legend.style.display = 'none';
                console.log('❌ Legende versteckt');
            }
            return true; // Erfolg
        }
        return false; // Element nicht gefunden
    };
    
    // Erst versuchen ohne Verzögerung
    if (!showLegend() && isBudgetPlanActive) {
        // Falls nicht gefunden, mit Verzögerung nochmal versuchen
        console.log('⏳ Legende nicht gefunden, versuche in 100ms...');
        setTimeout(() => {
            if (!showLegend()) {
                setTimeout(() => showLegend(), 500); // Nochmal nach 500ms
            }
        }, 100);
    }
}


// Verbesserte 50/30/20 Erkennung
function is503020Plan() {
    const hasNotwendig = categories.some(c => c.mainCategory === 'notwendig');
    const hasWuensche = categories.some(c => c.mainCategory === 'wuensche'); 
    const hasSparen = categories.some(c => c.mainCategory === 'sparen');
    
    return hasNotwendig && hasWuensche && hasSparen;
}
// System beim Laden initialisieren
// Aktualisiere die Prüfungen überall:
document.addEventListener('DOMContentLoaded', function() {
    console.log('50/30/20 System wird initialisiert...');
    
    setTimeout(() => {
        enhanced50_30_20Plan();
        enhanceAddCategoryModal();
        enhanceDataLoading();
        
        // VERBESSERTE Prüfung:
        if (is503020Plan()) {
            is50_30_20Active = true;
            showSubcircles();
            updateLegendVisibility(true);
        } else {
            is50_30_20Active = false;
            updateLegendVisibility(false);
        }
        
        console.log('50/30/20 System initialisiert');
    }, 1000);
});



// Erweiterte updateChart Funktion
const originalUpdateChart = window.updateChart;
if (originalUpdateChart) {
    window.updateChart = function() {
        originalUpdateChart();
        setTimeout(() => {
            addCategoryLabelsToChart();
            addCategoryLegend();
        }, 100);
    };
}
// ===== KATEGORIEN‐VISUALISIERUNG ERWEITERT =====

// Kategorien den 50/30/20 Bereichen zuordnen
function getCategoryMainType(category) {
    if (!category.mainCategory) {
        const needsKeywords   = ['miete','hypothek','lebensmittel','strom','gas','wasser','kranken','transport','öpnv','grundlegend','medikament','hygiene'];
        const savingsKeywords = ['notgroschen','altersvorsorge','sparen','ziele','investition','rücklage'];
        const name = category.label.toLowerCase();
        if (needsKeywords.some(k => name.includes(k))) return 'notwendig';
        if (savingsKeywords.some(k => name.includes(k))) return 'sparen';
        return 'wuensche';
    }
    return category.mainCategory;
}

// Berechne Kategorie‐Summen
function getCategorySums() {
    const sums = {
        notwendig: { budget: 0, spent: 0, count: 0 },
        wuensche:  { budget: 0, spent: 0, count: 0 },
        sparen:    { budget: 0, spent: 0, count: 0 }
    };
    categories.forEach(cat => {
        const type = getCategoryMainType(cat);
        sums[type].budget += cat.budget;
        sums[type].spent  += cat.spent;
        sums[type].count++;
    });
    return sums;
}

// Chart aktualisieren und Labels/Legende hinzufügen
function updateChartWithCategories() {
    if (typeof updateChart === 'function') updateChart();
    addCategoryLabelsToChart();
    addCategoryLegend();
}

// Labels auf dem Kreis platzieren
function addCategoryLabelsToChart() {
    document.querySelectorAll('.circle-category-labels').forEach(el => el.remove());
    const container = document.querySelector('.chart-container') || document.querySelector('#chart-container');
    if (!container) return;

    const sums = getCategorySums();
    const total = sums.notwendig.budget + sums.wuensche.budget + sums.sparen.budget;
    if (total === 0) return;

    const labelsDiv = document.createElement('div');
    labelsDiv.className = 'circle-category-labels';
    container.appendChild(labelsDiv);

    let angle = -90;
    const sections = [
        { key:'notwendig', label:'Notwendig',  cls:'category-needs',   data:sums.notwendig },
        { key:'wuensche',  label:'Wünsche',     cls:'category-wants',    data:sums.wuensche  },
        { key:'sparen',    label:'Sparen',      cls:'category-savings',  data:sums.sparen    }
    ];

    sections.forEach(sec => {
        if (sec.data.budget > 0) {
            const percent = sec.data.budget / total;
            const sweep   = percent * 360;
            const mid     = angle + sweep/2;

            const lbl = document.createElement('div');
            lbl.className = `category-section-label ${sec.cls}`;
            lbl.textContent = sec.label;
            lbl.title = `${sec.data.budget.toFixed(0)}€ Budget • ${sec.data.spent.toFixed(0)}€ ausgegeben`;

            const r = 140;
            const x = Math.cos(mid*Math.PI/180)*r, y = Math.sin(mid*Math.PI/180)*r;
            lbl.style.left = `calc(50% + ${x}px)`;
            lbl.style.top  = `calc(50% + ${y}px)`;

            lbl.addEventListener('click', () => showCategoryDetails(sec.key, sec.data));
            labelsDiv.appendChild(lbl);

            angle += sweep;
        }
    });
}

// Legende unter dem Chart
function addCategoryLegend() {
    document.querySelectorAll('.category-legend').forEach(el => el.remove());
    const container = document.querySelector('.chart-container') || document.querySelector('#chart-container');
    if (!container) return;

    const sums = getCategorySums();
    const legend = document.createElement('div');
    legend.className = 'category-legend';

    [
        { key:'notwendig', txt:'Notwendig',  cls:'legend-needs',   d:sums.notwendig },
        { key:'wuensche',  txt:'Wünsche',     cls:'legend-wants',   d:sums.wuensche  },
        { key:'sparen',    txt:'Sparen',      cls:'legend-savings', d:sums.sparen    }
    ].forEach(item => {
        if (item.d.budget > 0) {
            const it = document.createElement('div');
            it.className = `legend-item ${item.cls}`;
            it.innerHTML = `
                <div class="legend-color"></div>
                <span class="legend-text">${item.txt}</span>
                <span class="legend-amount">${item.d.budget.toFixed(0)}€</span>
            `;
            it.addEventListener('click', () => showCategoryDetails(item.key, item.d));
            legend.appendChild(it);
        }
    });

    container.appendChild(legend);
}

// Details-Dialog via alert()
function showCategoryDetails(key, data) {
    const titles = {
        notwendig: '🏠 Notwendige Ausgaben (50%)',
        wuensche:  '🎉 Wünsche & Vergnügen (30%)',
        sparen:    '💰 Sparen & Investitionen (20%)'
    };
    const descs = {
        notwendig: 'Grundbedürfnisse wie Miete, Lebensmittel, Transport',
        wuensche:  'Entertainment, Hobbys, Shopping, Restaurants',
        sparen:    'Notgroschen, Altersvorsorge, langfristige Ziele'
    };
    const pct = monthlyBudget>0?((data.budget/monthlyBudget*100).toFixed(1)):'0';
    const rem = (data.budget-data.spent).toFixed(2);
    alert(`${titles[key]}

Budget: ${data.budget.toFixed(2)}€ (${pct}%)
Ausgegeben: ${data.spent.toFixed(2)}€
Verbleibt: ${rem}€

${descs[key]}
Kategorien: ${data.count}`);
}

// UpdateChart override erweitert
const origUpdateChart = window.updateChart;
if (origUpdateChart) {
    window.updateChart = function() {
        origUpdateChart();
        setTimeout(() => {
            addCategoryLabelsToChart();
            addCategoryLegend();
        }, 100);
    };
}

// Initial bei Laden
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (categories && categories.length) updateChartWithCategories();
    }, 1000);
});

// ===== ENDE KATEGORIEN‐VISUALISIERUNG =====

// ===== START: Kompletter 50/30/20 Budgetplan =====
const completeCategories = {
    notwendig: [
        {name: 'Miete/Hypothek', emoji: '🏠', percentage: 25},
        {name: 'Lebensmittel', emoji: '🛒', percentage: 8},
        {name: 'Strom/Gas/Wasser', emoji: '⚡', percentage: 3},
        {name: 'Handy/Internet', emoji: '📱', percentage: 2},
        {name: 'Krankenversicherung', emoji: '🏥', percentage: 4},
        {name: 'Transport/ÖPNV', emoji: '🚊', percentage: 3},
        {name: 'Grundlegende Kleidung', emoji: '👕', percentage: 2},
        {name: 'Medikamente', emoji: '💊', percentage: 1.5},
        {name: 'Grundhygiene', emoji: '🧴', percentage: 1.5}
    ],
    wuensche: [
        {name: 'Restaurants/Essen gehen', emoji: '🍽️', percentage: 6},
        {name: 'Unterhaltung/Streaming', emoji: '🎬', percentage: 3},
        {name: 'Hobbys', emoji: '🎨', percentage: 4},
        {name: 'Sport/Fitness', emoji: '⚽', percentage: 3},
        {name: 'Mode/Shopping', emoji: '🛍️', percentage: 4},
        {name: 'Reisen/Urlaub', emoji: '✈️', percentage: 5},
        {name: 'Geschenke', emoji: '🎁', percentage: 2},
        {name: 'Beauty/Kosmetik', emoji: '💄', percentage: 2},
        {name: 'Elektronik/Gadgets', emoji: '📱', percentage: 1}
    ],
    sparen: [
        {name: 'Notgroschen', emoji: '💰', percentage: 8},
        {name: 'Altersvorsorge', emoji: '🏦', percentage: 6},
        {name: 'Langfristige Ziele', emoji: '🎯', percentage: 4},
        {name: 'Investitionen', emoji: '📈', percentage: 2}
    ]
};

function createComplete503020Budget() {
    const income = Number(document.getElementById('plannerIncome').value);
    const resultDiv = document.getElementById('plannerResult');
    if (isNaN(income) || income <= 0) {
        resultDiv.innerHTML = '<div style="color:red;">❌ Bitte gib ein gültiges Monatseinkommen ein.</div>';
        return;
    }
    showBudgetCreationProgress();
    setTimeout(() => {
        const newCategories = [];
        let idx = 0;
        Object.keys(completeCategories).forEach(mainCat => {
            completeCategories[mainCat].forEach(cat => {
                const b = Math.round((income * cat.percentage) / 100);
                if (b >= 1) {
                    newCategories.push({
                        label: cat.name,
                        emoji: cat.emoji,
                        budget: b,
                        spent: 0,
                        transactions: [],
                        mainCategory: mainCat,
                        color: getColorForCategory(idx++)
                    });
                }
            });
        });
        categories.length = 0;
        categories.push(...newCategories);
        monthlyBudget = income;
        is503020Active = true;
        
        updateList(); 
        updateChart(); 
        updateCircleCenter(); 
        showSubcircles(); 
        updateMiniCharts(); 
        saveCurrentMonthForUser();
        
        // LEGENDE MIT LÄNGERER VERZÖGERUNG ANZEIGEN:
        setTimeout(() => {
            updateLegendVisibility(true);
            console.log('Legende sollte jetzt angezeigt werden');
        }, 1000); // 1 Sekunde warten
        
        showCompleteBudgetSuccess(newCategories.length, income);
        setTimeout(() => {
            document.getElementById('budgetPlanModal').close();
            showSuccessMessage('🎉 Dein kompletter Finanzplan ist bereit!');
        }, 3000);
    }, 1000);
}




function showBudgetCreationProgress() {
    document.getElementById('plannerResult').innerHTML = `
        <div style="text-align:center;padding:20px;">
            <div style="font-size:2em;">🚀</div>
            <div style="font-weight:bold;color:#667eea;">Erstelle deinen kompletten Budgetplan...</div>
            <div class="budget-progress"><div class="budget-progress-bar" style="animation:budgetProgressAnimation 2s forwards;"></div></div>
        </div>`;
}

function showCompleteBudgetSuccess(count, income) {
    const needs = Math.round(income*0.5), wants = Math.round(income*0.3), save = Math.round(income*0.2);
    document.getElementById('plannerResult').innerHTML = `
        <div style="text-align:center;padding:15px;background:linear-gradient(135deg,#667eea20,#764ba220);border:2px solid #667eea;border-radius:10px;">
            <div style="font-size:2.5em;">✅</div>
            <div style="font-weight:bold;color:#667eea;font-size:1.2em;">Kompletter Budgetplan erstellt!</div>
            <div class="budget-success-grid">
                <div class="budget-success-item needs"><strong>Notwendig</strong><br>${needs}€<br><small>50%</small></div>
                <div class="budget-success-item wants"><strong>Wünsche</strong><br>${wants}€<br><small>30%</small></div>
                <div class="budget-success-item savings"><strong>Sparen</strong><br>${save}€<br><small>20%</small></div>
            </div>
            <div style="margin-top:10px;font-size:0.9em;"><strong>${count} Kategorien</strong> wurden angelegt.</div>
        </div>`;
}

function getColorForCategory(i) {
    const palette = ['#0177FF','#3399FF','#66CCFF','#00E5FF','#00FFC3','#00FF7A','#66FF33','#CCFF33','#E5FF00','#AFFF00','#FF6B35','#FF8E53','#FFB07A','#FFD700','#FFA500','#FF6B6B','#4ECDC4','#45B7D1','#F9CA24','#6C5CE7','#A55EEA','#26DE81','#FD79A8','#FDCB6E','#E17055','#00B894','#0984E3','#E84393','#00CEC9','#74B9FF'];
    return palette[i % palette.length];
}

function initCompleteBudgetSystem() {
    addCompleteBudgetButton();
    enhanceBudgetPlannerModal();
}
function addCompleteBudgetButton() {
    const modal = document.getElementById('budgetPlanModal');
    if (!modal || modal.querySelector('#completeBudgetSection')) return;
    const form = modal.querySelector('form');
    if (!form) return;
    const sec = document.createElement('div');
    sec.id = 'completeBudgetSection';
    sec.className = 'complete-budget-section';
    sec.innerHTML = `
        <h4>🎯 Oder: Kompletten Lebensplan erstellen</h4>
        <button type="button" id="createCompleteBudgetBtn" class="complete-budget-btn">
            🚀 Kompletten 50/30/20 Budgetplan erstellen
        </button>
        <p><small>Automatisch alle Kategorien für Wohnen, Essen, Transport, Sparen etc.</small></p>`;
    form.appendChild(sec);
    document.getElementById('createCompleteBudgetBtn').addEventListener('click', createComplete503020Budget);
}
function enhanceBudgetPlannerModal() {
    const modal = document.getElementById('budgetPlanModal');
    const h2 = modal?.querySelector('h2');
    if (h2 && !h2.querySelector('.subtitle')) {
        const sub = document.createElement('div');
        sub.className = 'subtitle';
        sub.style.cssText = 'font-size:0.8em;color:#888;margin-top:4px;';
        sub.textContent = 'Erstelle deinen Finanzplan nach der 50/30/20 Methode';
        h2.appendChild(sub);
    }
}
(function() {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCompleteBudgetSystem);
    else initCompleteBudgetSystem();
})();
// ===== END: Kompletter 50/30/20 Budgetplan =====

// ===== BUDGET EDIT FUNKTIONALITÄT =====

// Modal für Budget-Bearbeitung erstellen
function createBudgetEditModal() {
    const existingModal = document.getElementById('budgetEditModal');
    if (existingModal) return;

    const modal = document.createElement('dialog');
    modal.id = 'budgetEditModal';
    modal.className = 'budget-edit-modal';
    
    modal.innerHTML = `
        <div class="budget-edit-header">
            <h3 id="budgetEditTitle">
                <span id="budgetEditEmoji"></span>
                Budget anpassen
            </h3>
            <p style="color: #666; margin: 0;">Passe das Budget deinen Bedürfnissen an</p>
        </div>
        
        <div class="budget-current" id="budgetCurrentInfo">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; color: #333;">Aktuelles Budget</div>
                    <div id="budgetCurrentAmount" style="font-size: 1.2em; color: #667eea;">0€</div>
                </div>
                <div>
                    <div style="font-weight: bold; color: #333;">Bereits ausgegeben</div>
                    <div id="budgetCurrentSpent" style="font-size: 1.2em; color: #e74c3c;">0€</div>
                </div>
            </div>
        </div>
        
        <div class="budget-input-group">
            <label for="newBudgetAmount">Neues Budget (€)</label>
            <input type="number" id="newBudgetAmount" min="0" step="0.01" placeholder="Neues Budget eingeben">
            <div id="budgetPercentageInfo" class="budget-percentage-info" style="display: none;"></div>
        </div>
        
        <div class="budget-buttons">
            <button type="button" class="budget-btn budget-btn-cancel" onclick="closeBudgetEditModal()">
                Abbrechen
            </button>
            <button type="button" class="budget-btn budget-btn-save" onclick="saveBudgetChange()">
                💾 Speichern
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event Listener für Eingabe-Änderungen
    const budgetInput = document.getElementById('newBudgetAmount');
    budgetInput.addEventListener('input', updateBudgetPreview);
}

// Budget-Edit Modal öffnen
function openBudgetEditModal(categoryIndex) {
    if (!categories[categoryIndex]) return;
    
    createBudgetEditModal();
    
    const modal = document.getElementById('budgetEditModal');
    const category = categories[categoryIndex];
    
    // Modal-Inhalte setzen
    document.getElementById('budgetEditEmoji').textContent = category.emoji;
    document.getElementById('budgetEditTitle').innerHTML = 
        `<span id="budgetEditEmoji">${category.emoji}</span> ${category.label} - Budget anpassen`;
    document.getElementById('budgetCurrentAmount').textContent = `${category.budget.toFixed(2)}€`;
    document.getElementById('budgetCurrentSpent').textContent = `${category.spent.toFixed(2)}€`;
    document.getElementById('newBudgetAmount').value = category.budget.toFixed(2);
    
    // Kategorie-Index speichern
    modal.dataset.categoryIndex = categoryIndex;
    
    // Modal öffnen
    modal.showModal();
    document.getElementById('newBudgetAmount').focus();
    document.getElementById('newBudgetAmount').select();
    
    updateBudgetPreview();
}

// Budget-Vorschau aktualisieren
function updateBudgetPreview() {
    const modal = document.getElementById('budgetEditModal');
    const categoryIndex = parseInt(modal.dataset.categoryIndex);
    const category = categories[categoryIndex];
    const newBudget = parseFloat(document.getElementById('newBudgetAmount').value) || 0;
    const percentageInfo = document.getElementById('budgetPercentageInfo');
    
    if (newBudget > 0 && monthlyBudget > 0) {
        const percentage = (newBudget / monthlyBudget * 100).toFixed(1);
        const difference = newBudget - category.budget;
        const diffText = difference > 0 ? `+${difference.toFixed(2)}€` : `${difference.toFixed(2)}€`;
        
        percentageInfo.style.display = 'block';
        percentageInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span><strong>${percentage}%</strong> vom Gesamtbudget</span>
                <span><strong>${diffText}</strong> Änderung</span>
            </div>
            ${difference > 0 ? 
                '<div style="color: #e74c3c;">⚠️ Budget wird erhöht - prüfe andere Kategorien</div>' : 
                '<div style="color: #27ae60;">✅ Budget wird reduziert - mehr Spielraum für andere Kategorien</div>'
            }
        `;
    } else {
        percentageInfo.style.display = 'none';
    }
}

// Budget-Änderung speichern
function saveBudgetChange() {
    const modal = document.getElementById('budgetEditModal');
    const categoryIndex = parseInt(modal.dataset.categoryIndex);
    const newBudget = parseFloat(document.getElementById('newBudgetAmount').value);
    
    if (isNaN(newBudget) || newBudget < 0) {
        alert('Bitte gib ein gültiges Budget ein (mindestens 0€).');
        return;
    }
    
    // Budget aktualisieren
    categories[categoryIndex].budget = newBudget;
    
    // UI aktualisieren
    updateList();
    updateChart();
    updateCircleCenter();
    if (typeof updateMiniCharts === 'function') updateMiniCharts();
    saveCurrentMonthForUser();
    
    // Erfolgs-Feedback
    showBudgetChangeSuccess(categories[categoryIndex].label, newBudget);
    
    // Modal schließen
    closeBudgetEditModal();
}

// Erfolgs-Feedback anzeigen
function showBudgetChangeSuccess(categoryName, newBudget) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: bold;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    successDiv.innerHTML = `✅ ${categoryName}: Budget auf ${newBudget.toFixed(2)}€ angepasst`;
    
    document.body.appendChild(successDiv);
    
    // Animation
    setTimeout(() => successDiv.style.transform = 'translateX(0)', 100);
    setTimeout(() => successDiv.style.transform = 'translateX(100%)', 3000);
    setTimeout(() => document.body.removeChild(successDiv), 3300);
}

// Budget-Edit Modal schließen
function closeBudgetEditModal() {
    const modal = document.getElementById('budgetEditModal');
    if (modal) modal.close();
}

// Bestehende updateList Funktion erweitern für Klick-Handler
const originalUpdateList = window.updateList;
if (originalUpdateList) {
    window.updateList = function() {
        originalUpdateList();
        
        // Klick-Handler für Budget-Bearbeitung hinzufügen
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach((item, index) => {
            // Entferne bestehende Click-Handler für Ausgaben
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Rechtsklick oder Doppelklick für Budget-Edit
            newItem.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                openBudgetEditModal(index);
            });
            
            newItem.addEventListener('dblclick', (e) => {
                e.preventDefault();
                openBudgetEditModal(index);
            });
            
            // Normaler Klick für Ausgaben-Modal (bestehende Funktion)
            newItem.addEventListener('click', (e) => {
    if (!e.target.classList.contains('delete-btn')) {
        openExpenseModal(index);
    }
});

// Delete-Button Handler hinzufügen
const deleteBtn = newItem.querySelector('.delete-btn');
if (deleteBtn) {
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Persist removal for this month if this category is tied to a recurring template
    const key = getMonthKey();
    if (!monthlyData[key]) monthlyData[key] = { categories: JSON.parse(JSON.stringify(categories)), monthlyBudget, timestamp: Date.now(), _appliedRecurringIds: [], _removedRecurringIds: [] };
    const cat = categories[index];
    if (cat && cat.__recurringCategoryId) {
      if (!Array.isArray(monthlyData[key]._removedRecurringIds)) monthlyData[key]._removedRecurringIds = [];
      if (!monthlyData[key]._removedRecurringIds.includes(cat.__recurringCategoryId)) monthlyData[key]._removedRecurringIds.push(cat.__recurringCategoryId);
    }
    // Also scan transactions for recurring tx ids and mark those recurring ids as removed for this month
    if (cat && Array.isArray(cat.transactions)) {
      cat.transactions.forEach(tx => {
        if (tx && typeof tx.__recurringId === 'string') {
          if (!Array.isArray(monthlyData[key]._removedRecurringIds)) monthlyData[key]._removedRecurringIds = [];
          if (!monthlyData[key]._removedRecurringIds.includes(tx.__recurringId)) monthlyData[key]._removedRecurringIds.push(tx.__recurringId);
        }
      });
    }
    // Remove locally and persist
    categories.splice(index, 1);
    monthlyData[key].categories = JSON.parse(JSON.stringify(categories));
    saveCurrentMonthForUser();
    updateList();
    updateChart();
    updateRetoureOptions();
  });
}
            
            // Budget-Edit Button hinzufügen
            const categoryHeader = newItem.querySelector('.category-header');
            if (categoryHeader && !categoryHeader.querySelector('.budget-edit-btn')) {
                const editBtn = document.createElement('button');
                editBtn.className = 'budget-edit-btn';
                editBtn.innerHTML = '︙';
                editBtn.title = 'Budget bearbeiten';
                editBtn.style.cssText = `
                    background: transparent;
                    border: none;
                    font-size: 1.2em;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 2px;
                    transition: background-color 0.2s;
                    color: #fff;  
                `;
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openBudgetEditModal(index);
                });
                editBtn.addEventListener('mouseenter', () => {
                    editBtn.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                });
                editBtn.addEventListener('mouseleave', () => {
                    editBtn.style.backgroundColor = 'transparent';
                });
                
                categoryHeader.appendChild(editBtn);
            }
      // Details-Button hinzufügen
      if (categoryHeader && !categoryHeader.querySelector('.details-btn')) {
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'details-btn';
        detailsBtn.innerHTML = '🔍';
        detailsBtn.title = 'Details anzeigen';
        detailsBtn.style.cssText = `
          background: transparent;
          border: none;
          font-size: 1.1em;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          margin-left: 6px;
        `;
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showDetails(index);
        });
        detailsBtn.addEventListener('mouseenter', () => detailsBtn.style.backgroundColor = 'rgba(0,0,0,0.04)');
        detailsBtn.addEventListener('mouseleave', () => detailsBtn.style.backgroundColor = 'transparent');
        categoryHeader.appendChild(detailsBtn);
      }
        });
    };
    
    // Initial aufrufen wenn Kategorien existieren
    if (categories && categories.length > 0) {
        window.updateList();
    }
}

// Modal schließen wenn außerhalb geklickt wird
document.addEventListener('click', (e) => {
    const modal = document.getElementById('budgetEditModal');
    if (modal && e.target === modal) {
        closeBudgetEditModal();
    }
});

// Escape-Taste zum Schließen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBudgetEditModal();
    }
});

// ===== END: BUDGET EDIT FUNKTIONALITÄT =====


// Kategorien automatisch zuordnen und sortieren
function categorizeCategoriesAutomatically() {
    // Definiere Keywords für automatische Zuordnung
    const categoryKeywords = {
        notwendig: [
            'miete', 'hypothek', 'wohnen', 'lebensmittel', 'einkauf', 'groceries',
            'strom', 'gas', 'wasser', 'handy', 'internet', 'telefon',
            'krankenversicherung', 'versicherung', 'transport', 'öpnv', 'auto',
            'kleidung', 'medikamente', 'gesundheit', 'hygiene'
        ],
        sparen: [
            'sparen', 'notgroschen', 'altersvorsorge', 'investitionen', 'rücklage',
            'langfristig', 'ziele', 'vorsorge', 'ersparnisse'
        ]
        // Alles andere wird zu "wuensche"
    };

    // Kategorien zuordnen
    categories.forEach(cat => {
        if (!cat.mainCategory) {
            const name = cat.label.toLowerCase();
            
            if (categoryKeywords.notwendig.some(keyword => name.includes(keyword))) {
                cat.mainCategory = 'notwendig';
            } else if (categoryKeywords.sparen.some(keyword => name.includes(keyword))) {
                cat.mainCategory = 'sparen';
            } else {
                cat.mainCategory = 'wuensche';
            }
        }
    });

    // Kategorien sortieren: erst Notwendig, dann Wünsche, dann Sparen
    categories.sort((a, b) => {
        const order = { 'notwendig': 1, 'wuensche': 2, 'sparen': 3 };
        return order[a.mainCategory] - order[b.mainCategory];
    });
}




// Beispiel-Aufruf: Wenn der Plan aktiviert wird
updateLegendVisibility(true);  // Legende anzeigen
updateLegendVisibility(false); // Legende ausblenden


init();
