// DOM Elements
const addButton = document.getElementById('addButton');
const editButton = document.getElementById('editButton');
const addPasswordModal = document.getElementById('addPasswordModal');
const passwordForm = document.getElementById('passwordForm');
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const cancelAddButton = document.getElementById('cancelAdd');
const passwordsList = document.getElementById('passwordsList');

// Edit password modal elements
const editPasswordModal = document.getElementById('editPasswordModal');
const editPasswordForm = document.getElementById('editPasswordForm');
const editPasswordId = document.getElementById('editPasswordId');
const editNameInput = document.getElementById('editName');
const editPasswordInput = document.getElementById('editPassword');
const cancelEditButton = document.getElementById('cancelEdit');

// Event listeners
document.addEventListener('DOMContentLoaded', loadPasswords);
addButton.addEventListener('click', showAddPasswordModal);
cancelAddButton.addEventListener('click', hideAddPasswordModal);
passwordForm.addEventListener('submit', savePassword);
editButton.addEventListener('click', toggleEditMode);
cancelEditButton.addEventListener('click', hideEditPasswordModal);
editPasswordForm.addEventListener('submit', updatePassword);

// State variables
let isEditMode = false;
let passwords = [];
let draggedItem = null;
let draggedItemIndex = null;

// Show add password modal
function showAddPasswordModal() {
  addPasswordModal.classList.add('show');
  nameInput.focus();
}

// Hide add password modal
function hideAddPasswordModal() {
  addPasswordModal.classList.remove('show');
  passwordForm.reset();
}

// Show edit password modal
function showEditPasswordModal(password) {
  editPasswordId.value = password.id;
  editNameInput.value = password.name;
  editPasswordInput.value = password.password;
  editPasswordModal.classList.add('show');
  editNameInput.focus();
}

// Hide edit password modal
function hideEditPasswordModal() {
  editPasswordModal.classList.remove('show');
  editPasswordForm.reset();
}

// Toggle edit mode
function toggleEditMode() {
  isEditMode = !isEditMode;
  
  const passwordItems = document.querySelectorAll('.password-item');
  
  if (isEditMode) {
    editButton.querySelector('.material-icons').textContent = 'done';
    
    // Add drag handle and make items draggable
    passwordItems.forEach((item, index) => {
      item.classList.add('edit-mode');
      item.draggable = true;
      
      // Add drag handle
      const dragHandle = document.createElement('div');
      dragHandle.className = 'drag-handle';
      dragHandle.innerHTML = '<span class="material-icons">drag_indicator</span>';
      item.insertBefore(dragHandle, item.firstChild);
      
      // Add event listeners for drag and drop
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('dragenter', handleDragEnter);
      item.addEventListener('dragleave', handleDragLeave);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);
      
      // Create edit actions container
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'edit-actions';
      
      // Edit button (combines view and edit)
      const editButton = document.createElement('button');
      editButton.className = 'edit-password-button';
      editButton.innerHTML = '<span class="material-icons">edit</span>';
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(item.dataset.id);
        const password = passwords.find(p => p.id === id);
        if (password) {
          showEditPasswordModal(password);
        }
      });
      
      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.innerHTML = '<span class="material-icons">delete</span>';
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(item.dataset.id);
        const password = passwords.find(p => p.id === id);
        if (password) {
          showDeleteConfirmation(password);
        }
      });
      
      actionsContainer.appendChild(editButton);
      actionsContainer.appendChild(deleteButton);
      item.appendChild(actionsContainer);
      
      // Hide the copy button while in edit mode
      const copyButton = item.querySelector('.copy-button');
      if (copyButton) {
        copyButton.style.display = 'none';
      }
    });
  } else {
    editButton.querySelector('.material-icons').textContent = 'edit';
    
    // Save the new order if it has changed
    savePasswordOrder();
    
    passwordItems.forEach(item => {
      item.classList.remove('edit-mode');
      item.draggable = false;
      
      // Remove drag handle
      const dragHandle = item.querySelector('.drag-handle');
      if (dragHandle) {
        dragHandle.remove();
      }
      
      // Remove drag and drop event listeners
      item.removeEventListener('dragstart', handleDragStart);
      item.removeEventListener('dragover', handleDragOver);
      item.removeEventListener('dragenter', handleDragEnter);
      item.removeEventListener('dragleave', handleDragLeave);
      item.removeEventListener('drop', handleDrop);
      item.removeEventListener('dragend', handleDragEnd);
      
      const actionsContainer = item.querySelector('.edit-actions');
      if (actionsContainer) {
        actionsContainer.remove();
      }
      
      // Show the copy button again when exiting edit mode
      const copyButton = item.querySelector('.copy-button');
      if (copyButton) {
        copyButton.style.display = '';
      }
    });
  }
}

// Drag and drop event handlers
function handleDragStart(e) {
  if (!isEditMode) return;
  
  draggedItem = this;
  draggedItemIndex = Array.from(passwordsList.children).indexOf(this);
  
  // Set data for drag operation (required for Firefox)
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  
  // Add styling class
  this.classList.add('dragging');
  
  // Save reference to the current passwords order
  
  // Add transparent ghost image
  setTimeout(() => {
    this.classList.add('drag-ghost');
  }, 0);
}

function handleDragOver(e) {
  if (!isEditMode) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  if (!isEditMode) return;
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  if (!isEditMode) return;
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  if (!isEditMode) return;
  e.stopPropagation();
  
  if (draggedItem !== this) {
    // Get the current index of the drop target
    const dropIndex = Array.from(passwordsList.children).indexOf(this);
    
    // Reorder in DOM
    if (draggedItemIndex < dropIndex) {
      this.parentNode.insertBefore(draggedItem, this.nextSibling);
    } else {
      this.parentNode.insertBefore(draggedItem, this);
    }
    
    // Reorder in our data array
    const item = passwords.splice(draggedItemIndex, 1)[0];
    passwords.splice(dropIndex, 0, item);
  }
  
  this.classList.remove('drag-over');
  return false;
}

function handleDragEnd() {
  if (!isEditMode) return;
  
  // Remove all temporary classes
  this.classList.remove('dragging', 'drag-ghost');
  
  // Remove drag-over class from all items
  const items = document.querySelectorAll('.password-item');
  items.forEach(item => {
    item.classList.remove('drag-over');
  });
  
  draggedItem = null;
  draggedItemIndex = null;
}

// Save the new password order
async function savePasswordOrder() {
  if (passwords.length === 0) return;
  
  try {
    await window.api.updatePasswordOrder(passwords);
  } catch (error) {
    console.error('Error saving password order:', error);
  }
}

// Show delete confirmation
function showDeleteConfirmation(password) {
  // Create confirmation dialog
  const confirmationOverlay = document.createElement('div');
  confirmationOverlay.className = 'confirmation-overlay';
  
  const confirmationDialog = document.createElement('div');
  confirmationDialog.className = 'confirmation-dialog';
  
  const confirmationMessage = document.createElement('p');
  confirmationMessage.textContent = `Are you sure you want to delete "${password.name}"?`;
  
  const confirmationActions = document.createElement('div');
  confirmationActions.className = 'confirmation-actions';
  
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn-secondary';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(confirmationOverlay);
  });
  
  const confirmButton = document.createElement('button');
  confirmButton.className = 'btn-delete';
  confirmButton.textContent = 'Delete';
  confirmButton.addEventListener('click', () => {
    deletePassword(password.id);
    document.body.removeChild(confirmationOverlay);
  });
  
  confirmationActions.appendChild(cancelButton);
  confirmationActions.appendChild(confirmButton);
  
  confirmationDialog.appendChild(confirmationMessage);
  confirmationDialog.appendChild(confirmationActions);
  confirmationOverlay.appendChild(confirmationDialog);
  
  document.body.appendChild(confirmationOverlay);
}

// Function to check if a name already exists
function nameExists(name) {
  return passwords.some(pw => pw.name.toLowerCase() === name.toLowerCase());
}

// Function to save a new password
async function savePassword(e) {
  e.preventDefault();
  
  const name = nameInput.value.trim();
  
  // Check if the name already exists
  if (nameExists(name)) {
    showNotification('A password with this name already exists', 'error');
    return;
  }
  
  const passwordData = {
    name: name,
    password: passwordInput.value,
    createdAt: new Date().toISOString()
  };
  
  try {
    const updatedPasswords = await window.api.savePassword(passwordData);
    passwords = updatedPasswords;
    hideAddPasswordModal();
    renderPasswordsList(passwords);
  } catch (error) {
    console.error('Error saving password:', error);
    showNotification('Failed to save password. Please try again.', 'error');
  }
}

// Function to update an existing password
async function updatePassword(e) {
  e.preventDefault();
  
  const id = Number(editPasswordId.value);
  const name = editNameInput.value.trim();
  
  // Check if the name already exists (excluding the current password being edited)
  if (passwords.some(pw => pw.id !== id && pw.name.toLowerCase() === name.toLowerCase())) {
    showNotification('A password with this name already exists', 'error');
    return;
  }
  
  const updatedPassword = {
    id,
    name: name,
    password: editPasswordInput.value
  };
  
  try {
    const updatedPasswords = await window.api.updatePassword(updatedPassword);
    passwords = updatedPasswords;
    hideEditPasswordModal();
    renderPasswordsList(passwords);
    
    // Reapply edit mode if it was active
    if (isEditMode) {
      toggleEditMode();
      toggleEditMode();
    }
  } catch (error) {
    console.error('Error updating password:', error);
    showNotification('Failed to update password. Please try again.', 'error');
  }
}

// Function to load all passwords
async function loadPasswords() {
  try {
    passwords = await window.api.getPasswords();
    renderPasswordsList(passwords);
  } catch (error) {
    console.error('Error loading passwords:', error);
  }
}

// Function to delete a password
async function deletePassword(id) {
  try {
    passwords = await window.api.deletePassword(Number(id));
    renderPasswordsList(passwords);
  } catch (error) {
    console.error('Error deleting password:', error);
  }
}

// Function to render the passwords list
function renderPasswordsList(passwordsArray) {
  passwordsList.innerHTML = '';
  
  if (passwordsArray.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No passwords saved yet.';
    passwordsList.appendChild(emptyState);
    return;
  }
  
  passwordsArray.forEach(pw => {
    const passwordItem = document.createElement('div');
    passwordItem.className = 'password-item';
    passwordItem.dataset.id = pw.id;
    
    // Add click event to the entire password item
    passwordItem.addEventListener('click', () => {
      if (!isEditMode) {
        copyToClipboard(pw.password);
      }
    });
    
    const nameElement = document.createElement('span');
    nameElement.className = 'password-name';
    nameElement.textContent = pw.name;
    
    // We'll hide the copy button since we now copy on click
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '<span class="material-icons">content_copy</span>';
    
    passwordItem.appendChild(nameElement);
    passwordItem.appendChild(copyButton);
    
    passwordsList.appendChild(passwordItem);
  });
  
  // Reapply edit mode if it was active
  if (isEditMode) {
    toggleEditMode();
    toggleEditMode();
  }
}

// Show a notification message
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showNotification('Copied to clipboard');
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
    });
}

// Add styles for copy notification
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    z-index: 2000;
    color: white;
  }
  
  .notification.info {
    background-color: rgba(51, 51, 51, 0.7);
  }
  
  .notification.error {
    background-color: rgba(255, 59, 48, 0.8);
  }
  
  .notification.show {
    opacity: 0.9;
    transform: translateX(-50%) translateY(0);
  }
  
  .empty-state {
    text-align: center;
    color: #888;
    margin-top: 40px;
  }
  
  .confirmation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .confirmation-dialog {
    background-color: white;
    border-radius: 8px;
    padding: 24px;
    width: 300px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .confirmation-dialog p {
    margin: 0 0 20px 0;
    font-size: 16px;
    color: #333;
    text-align: center;
  }
  
  .confirmation-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .btn-delete {
    background-color: #ff3b30;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .btn-delete:hover {
    background-color: #d9302b;
  }
  
  /* Drag and drop styles */
  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    cursor: grab;
    margin-right: 10px;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
  
  .drag-handle .material-icons {
    font-size: 20px;
  }
  
  .password-item.edit-mode {
    padding-left: 12px;
    padding-right: 100px;
    position: relative;
    cursor: default;
    user-select: none;
    display: flex;
    align-items: center;
  }
  
  .password-item.edit-mode .password-name {
    max-width: calc(100% - 140px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .edit-actions {
    position: absolute;
    right: 15px;
    display: flex;
    gap: 12px;
    margin-left: auto;
  }
  
  .password-item.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
  
  .password-item.drag-ghost {
    transform: translateY(-2px);
  }
  
  .password-item.drag-over {
    border: 2px dashed #aaa;
  }
`;
document.head.appendChild(style); 