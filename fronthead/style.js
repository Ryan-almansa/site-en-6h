document.addEventListener('DOMContentLoaded', function() {
    const serviceItems = document.querySelectorAll('.service-item');
    let selectedService = 'consultation';
    
    serviceItems.forEach(item => {
      item.addEventListener('click', function() {
        serviceItems.forEach(i => i.classList.remove('active'));
        
        this.classList.add('active');
        
        selectedService = this.getAttribute('data-service');
        
        document.getElementById('summary-service').textContent = this.querySelector('h4').textContent + ' (' + this.querySelector('p').textContent.split(' - ')[0] + ')';
      });
    });
    
    const dayElements = document.querySelectorAll('.day:not(.unavailable)');
    let selectedDate = '7 mai 2025';
    
    dayElements.forEach(day => {
      day.addEventListener('click', function() {
        dayElements.forEach(d => d.classList.remove('active'));
        
        this.classList.add('active');
        
        selectedDate = this.textContent + ' mai 2025';
        document.getElementById('selected-date').textContent = selectedDate;
        document.getElementById('summary-date').textContent = selectedDate;
      });
    });
    
    const timeSlots = document.querySelectorAll('.time-slot:not(.unavailable)');
    let selectedTime = '15:00';
    
    timeSlots.forEach(slot => {
      slot.addEventListener('click', function() {
        timeSlots.forEach(t => t.classList.remove('active'));
        
        
        this.classList.add('active');
        
     
        selectedTime = this.textContent;
        document.getElementById('summary-time').textContent = selectedTime;
      });
    });
    
    
    const steps = document.querySelectorAll('.booking-step');
    
    function showStep(stepNumber) {
      steps.forEach(step => step.classList.remove('active'));
      document.getElementById('step-' + stepNumber).classList.add('active');
    }
    
    document.getElementById('to-step-2').addEventListener('click', () => showStep(2));
    document.getElementById('to-step-1').addEventListener('click', () => showStep(1));
    document.getElementById('to-step-3').addEventListener('click', () => {
      showStep(3);
      updateSummary();
    });
    document.getElementById('to-step-2-from-3').addEventListener('click', () => showStep(2));
    document.getElementById('to-step-4').addEventListener('click', () => {
      if (validateForm()) {
        showStep(4);
        updateSummary();
      }
    });
    document.getElementById('to-step-3-from-4').addEventListener('click', () => showStep(3));
    
    document.getElementById('confirm-booking').addEventListener('click', function() {
     
      showStep(5);
      
      
      const confirmationMessage = document.querySelector('.confirmation-message');
      confirmationMessage.style.opacity = '0';
      setTimeout(() => {
        confirmationMessage.style.transition = 'opacity 0.5s';
        confirmationMessage.style.opacity = '1';
      }, 100);
    });
    
    document.getElementById('new-booking').addEventListener('click', function() {
      
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('notes').value = '';
      showStep(1);
    });
    
    
    let currentMonth = 'Mai';
    
    document.getElementById('prev-month').addEventListener('click', function() {
      if (currentMonth === 'Mai') {
        currentMonth = 'Avril';
        document.querySelector('.calendar-month').textContent = 'Avril 2025';
       
      }
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
      if (currentMonth === 'Avril') {
        currentMonth = 'Mai';
        document.querySelector('.calendar-month').textContent = 'Mai 2025';
        
      } else if (currentMonth === 'Mai') {
        currentMonth = 'Juin';
        document.querySelector('.calendar-month').textContent = 'Juin 2025';
       
      }
    });
    
    
    function validateForm() {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      
      if (!name || !email || !phone) {
        showValidationError('Veuillez remplir tous les champs obligatoires.');
        return false;
      }
      
      if (!validateEmail(email)) {
        showValidationError('Veuillez entrer une adresse email valide.');
        return false;
      }
      
      if (!validatePhone(phone)) {
        showValidationError('Veuillez entrer un numéro de téléphone valide.');
        return false;
      }
      
      return true;
    }
    
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    
    function validatePhone(phone) {
      return phone.length >= 10;
    }
    
    function showValidationError(message) {
      const notification = document.createElement('div');
      notification.className = 'notification notification-error';
      notification.textContent = message;
      
      const form = document.getElementById('step-3');
      form.insertBefore(notification, form.firstChild);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
    
    function updateSummary() {
      const name = document.getElementById('name').value || 'Jean Dupont';
      const email = document.getElementById('email').value || 'jean.dupont@example.com';
      const phone = document.getElementById('phone').value || '06 12 34 56 78';
      
      document.getElementById('summary-name').textContent = name;
      document.getElementById('summary-email').textContent = email;
      document.getElementById('summary-phone').textContent = phone;
    }
    
    
    function updateTimeSlotAvailability(date) {
      const timeSlots = document.querySelectorAll('.time-slot');
      
      timeSlots.forEach(slot => {
        slot.classList.remove('unavailable');
      });
      
      
      if (date === '7 mai 2025') {
        timeSlots[0].classList.add('unavailable'); // 9:00
        timeSlots[3].classList.add('unavailable'); // 12:00
        timeSlots[8].classList.add('unavailable'); // 18:00
      } else if (date === '8 mai 2025') {
        timeSlots[1].classList.add('unavailable'); // 10:00
        timeSlots[4].classList.add('unavailable'); // 14:00
        timeSlots[7].classList.add('unavailable'); // 17:00
      }
    }
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 100);
      });
    });
    
    function addHoverEffects(elements) {
      elements.forEach(element => {
        if (element.classList.contains('unavailable')) return;
        
        element.addEventListener('mouseenter', function() {
          if (!this.classList.contains('active')) {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }
        });
        
        element.addEventListener('mouseleave', function() {
          if (!this.classList.contains('active')) {
            this.style.transform = '';
            this.style.boxShadow = '';
          }
        });
      });
    }
    
    addHoverEffects(document.querySelectorAll('.day'));
    addHoverEffects(document.querySelectorAll('.time-slot'));
    
    updateTimeSlotAvailability(selectedDate);
  });