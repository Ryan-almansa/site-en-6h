 // Fonction pour changer d'onglet
 document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Retirer la classe active de tous les boutons et contenus
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Ajouter la classe active au bouton cliqué
      button.classList.add('active');
      
      // Afficher le contenu correspondant
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Fonction pour afficher/masquer le mot de passe
  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const passwordInput = toggle.previousElementSibling;
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Changer l'icône (à implémenter)
    });
  });
  
  // Validation de formulaire et autres fonctionnalités à implémenter
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Logique de connexion à implémenter
    console.log('Tentative de connexion');
  });
  
  document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Logique d'inscription à implémenter
    console.log('Tentative d\'inscription');
  });
  
  // Évaluation de la force du mot de passe
  const passwordInput = document.getElementById('register-password');
  const strengthBars = document.querySelectorAll('.bar-segment');
  const strengthText = document.querySelector('.strength-text');
  
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    // Vérifier la longueur
    if (password.length >= 8) strength++;
    
    // Vérifier la présence de lettres minuscules et majuscules
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    
    // Vérifier la présence de chiffres
    if (password.match(/[0-9]/)) strength++;
    
    // Vérifier la présence de caractères spéciaux
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    // Mettre à jour l'affichage
    strengthBars.forEach((bar, index) => {
      if (index < strength) {
        bar.classList.add('active');
      } else {
        bar.classList.remove('active');
      }
    });
    
    // Mettre à jour le texte
    const strengthLabels = ['Faible', 'Moyen', 'Fort', 'Très fort'];
    strengthText.textContent = strength > 0 ? `Force: ${strengthLabels[strength-1]}` : 'Force du mot de passe';
  });