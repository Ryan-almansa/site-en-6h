document.addEventListener('DOMContentLoaded', function() {
    // Toggle entre paiement mensuel et annuel
    const billingToggle = document.getElementById('billing-toggle');
    const priceElements = document.querySelectorAll('.price-value');
    const periodElements = document.querySelectorAll('.price-period');
    
    billingToggle.addEventListener('change', function() {
      const isAnnual = this.checked;
      
      priceElements.forEach(element => {
        const monthlyPrice = parseInt(element.getAttribute('data-monthly'));
        const annualPrice = parseInt(element.getAttribute('data-annual'));
        element.textContent = isAnnual ? annualPrice + '€' : monthlyPrice + '€';
      });
      
      periodElements.forEach(element => {
        element.textContent = isAnnual ? '/ an' : '/ mois';
        
        if (element.previousElementSibling.getAttribute('data-monthly') === '60') {
          element.textContent = '/ séance';
        }
      });
      
      priceElements.forEach(element => {
        element.classList.add('price-updated');
        setTimeout(() => {
          element.classList.remove('price-updated');
        }, 300);
      });
    });
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', function() {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        item.classList.toggle('active');
        
        const icon = this.querySelector('.faq-icon');
        if (item.classList.contains('active')) {
          icon.textContent = '×';
        } else {
          icon.textContent = '+';
        }
      });
    });
    
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('popular')) {
          this.style.transform = 'translateY(-5px)';
          this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        } else {
          this.style.transform = 'scale(1.05) translateY(-5px)';
        }
      });
      
      card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('popular')) {
          this.style.transform = '';
          this.style.boxShadow = '';
        } else {
          this.style.transform = 'scale(1.05)';
        }
      });
    });
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
    
    setTimeout(() => {
      pricingCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = card.classList.contains('popular') ? 'scale(1.05)' : 'translateY(0)';
        }, index * 150);
      });
    }, 100);
  });