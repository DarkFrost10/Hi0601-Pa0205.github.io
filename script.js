$(document).ready(function() {
  let envelopeOpened = false;

  // ========== TEMPORIZADOR DESDE EL 13 DE MARZO DE 2026 ==========
  const startDate = new Date(2026, 2, 13, 0, 0, 0); // mes 2 = marzo
  let timerInterval = null;

  function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    if (diff < 0) {
      $('#timer-dias').text('0');
      $('#timer-horas').text('00');
      $('#timer-minutos').text('00');
      $('#timer-segundos').text('00');
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const dias = Math.floor(totalSeconds / 86400);
    const horas = Math.floor((totalSeconds % 86400) / 3600);
    const minutos = Math.floor((totalSeconds % 3600) / 60);
    const segundos = totalSeconds % 60;

    $('#timer-dias').text(dias);
    $('#timer-horas').text(String(horas).padStart(2, '0'));
    $('#timer-minutos').text(String(minutos).padStart(2, '0'));
    $('#timer-segundos').text(String(segundos).padStart(2, '0'));
  }

  function startTimer() {
    updateTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  // Click / tap en cada cuadro → iluminación dorada temporal
  $(document).on('click', '.timer-box', function() {
    $(this).addClass('active');
    const $box = $(this);
    setTimeout(function() {
      $box.removeClass('active');
    }, 800);
  });

  // ========== GENERAR ESTRELLAS DE FONDO ==========
  function createStars() {
    const $container = $('#stars-container');
    const count = 40;

    for (let i = 0; i < count; i++) {
      const size = 6 + Math.random() * 16;
      const top  = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = (Math.random() * 4).toFixed(2);
      const duration = (2.5 + Math.random() * 2.5).toFixed(2);

      const $star = $(`
        <div class="star" style="
          top: ${top}%;
          left: ${left}%;
          width: ${size}px;
          height: ${size}px;
          animation-delay: ${delay}s;
          animation-duration: ${duration}s;
        ">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 
                     C52 35 65 48 100 50 
                     C65 52 52 65 50 100 
                     C48 65 35 52 0 50 
                     C35 48 48 35 50 0 Z" 
                  fill="currentColor"/>
          </svg>
        </div>
      `);

      $container.append($star);
    }
  }

  createStars();

  // ========== PANTALLA DE BLOQUEO ==========
  $('#fingerprint').on('click', function() {
    const $fp = $(this);
    
    if ($fp.hasClass('scanning')) return;
    
    $fp.addClass('scanning');
    $fp.find('.scan-line').show();
    
    setTimeout(function() {
      $fp.removeClass('scanning').addClass('success');
      $fp.find('.scan-line').hide();
      
      createParticles($fp);
      
      setTimeout(function() {
        $('#lock-screen').addClass('unlocked');
  
        startTimer();
        setTimeout(function() {
             $('#timer-container').addClass('visible moved-up');  // ← ahora también moved-up
            }, 300);
  
        setTimeout(function() {
          $('#envelope-container').addClass('visible');
        }, 400);
      }, 800);
    }, 1500);
  });

  // ========== PARTÍCULAS ==========
  function createParticles($element) {
    const rect = $element[0].getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
      const $particle = $('<div class="particle">✦</div>');
      const angle = (Math.PI * 2 / 20) * i;
      const distance = 60 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      $particle.css({
        left: centerX + 'px',
        top: centerY + 'px',
        color: i % 2 === 0 ? '#d4af37' : '#f5d76e',
        position: 'fixed'
      });
      
      $('body').append($particle);
      
      $particle.animate({ opacity: 0 }, {
        duration: 1200,
        step: function(now) {
          const progress = 1 - now;
          $(this).css({
            left: (centerX + tx * progress) + 'px',
            top: (centerY + ty * progress) + 'px',
            opacity: now
          });
        },
        complete: function() { $(this).remove(); }
      });
    }
  }

  // ========== ABRIR SOBRE CON SELLO DE CORAZÓN ==========
  $('#wax-seal').on('click', function(e) {
    e.stopPropagation();
    if (envelopeOpened) return;
    envelopeOpened = true;
    
    const $seal = $(this);
    const $flap = $('.envelope-flap');
    
    $seal.addClass('opening');
    
    setTimeout(function() {
      $flap.css('transform', 'rotateX(180deg)');
    }, 300);
    
    setTimeout(function() {
      showCard();
    }, 1200);
  });

  // ========== MOSTRAR CARTA ==========
  function showCard() {
    const $card = $('#card');
    
    // Ocultar sobre rápido para que no bloquee clics
    $('.valentines-day').fadeOut(300);
    
    // Mover el temporizador arriba (ahora no bloquea clics fuera de los cuadros)
    $('#timer-container').addClass('reveal-labels');  // ← revela título y fecha
    
    // Mostrar carta
    $card.addClass('show');
    
    $card.css({
      transform: 'translate(-50%, -50%) scale(0.1)',
      opacity: 0
    });
    
    $card.animate({ opacity: 1 }, {
      duration: 1200,
      step: function(now) {
        const scale = 0.1 + (now * 0.9);
        const wobble = 1 + Math.sin(now * Math.PI * 3) * 0.03 * (1 - now);
        $(this).css('transform', 
          'translate(-50%, -50%) scale(' + (scale * wobble) + ')'
        );
      },
      complete: function() {
        $(this).css('transform', 'translate(-50%, -50%) scale(1)');
        createCelebrationParticles();
      }
    });
  }

  // ========== PARTÍCULAS DE CELEBRACIÓN ==========
  function createCelebrationParticles() {
    const colors = ['#d4af37', '#f5d76e', '#1a3a5c', '#b8860b'];
    const symbols = ['♥', '✦', '❦', '◆'];
    
    for (let i = 0; i < 30; i++) {
      setTimeout(function() {
        const $p = $('<div class="particle">' + 
          symbols[Math.floor(Math.random() * symbols.length)] + '</div>');
        
        $p.css({
          left: Math.random() * 100 + 'vw',
          top: '100vh',
          color: colors[Math.floor(Math.random() * colors.length)],
          position: 'fixed',
          fontSize: (0.8 + Math.random() * 1) + 'rem',
          zIndex: 99
        });
        
        $('body').append($p);
        
        $p.animate({ top: '-10vh', opacity: 0 }, {
          duration: 3000 + Math.random() * 2000,
          easing: 'linear',
          complete: function() { $(this).remove(); }
        });
      }, i * 100);
    }
  }

  // Efecto de hover en el sobre
  $('.valentines-day').on('mouseenter', function() {
    if (!envelopeOpened) {
      $('.envelope').css('transform', 'translateY(-10px)');
    }
  }).on('mouseleave', function() {
    if (!envelopeOpened) {
      $('.envelope').css('transform', 'translateY(0)');
    }
  });
});