

document.addEventListener('DOMContentLoaded', () => {

  
  const statNumbers = document.querySelectorAll('.stat-item h3');

  const startCounters = () => {
    statNumbers.forEach((counter) => {
      const targetText = counter.innerText.trim();
      const targetNumber = parseInt(targetText.replace(/\D/g, ''), 10);
      const suffix = targetText.replace(/[0-9]/g, '');
      
      if (isNaN(targetNumber)) return;

      let current = 0;
      const duration = 1400;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = targetNumber / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          counter.innerText = targetNumber + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = Math.floor(current) + suffix;
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    let counted = false;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        startCounters();
        counted = true;
      }
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

 
  const orbitNodes = document.querySelectorAll('.orbit-node');
  const orbitRotator = document.querySelector('.orbit-rotator');

  orbitNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      if (orbitRotator) orbitRotator.style.animationPlayState = 'paused';
    });

    node.addEventListener('mouseleave', () => {
      if (orbitRotator) orbitRotator.style.animationPlayState = 'running';
    });
  });

 
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusBox = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      statusBox.style.display = 'none';

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: json
        });

        const result = await response.json();

        if (result.success) {
          statusBox.innerHTML = '✓ Thank you! Your message has been sent successfully.';
          statusBox.style.color = '#4ade80';
          statusBox.style.background = 'rgba(74, 222, 128, 0.1)';
          statusBox.style.display = 'block';
          contactForm.reset();
        } else {
          statusBox.innerText = 'Could not send message. Please verify your access key.';
          statusBox.style.color = '#f87171';
          statusBox.style.background = 'rgba(248, 113, 113, 0.1)';
          statusBox.style.display = 'block';
        }
      } catch (error) {
        statusBox.innerText = 'Network error! Please check your internet connection.';
        statusBox.style.color = '#f87171';
        statusBox.style.background = 'rgba(248, 113, 113, 0.1)';
        statusBox.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
      }
    });
  }

});


const starCanvas = document.getElementById('starsCanvas');

if (starCanvas) {
  const starCtx = starCanvas.getContext('2d');
  let sWidth, sHeight;

  function resizeCanvas() {
    sWidth = starCanvas.width = window.innerWidth;
    sHeight = starCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

 
  const stars = [];
  const STAR_COUNT = 140;

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * sWidth,
      y: Math.random() * sHeight,
      size: Math.random() * 1.8 + 0.6,
     
      vx: (Math.random() - 0.5) * 0.12, 
      vy: (Math.random() - 0.5) * 0.12, 
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * 0.02 + 0.006,
      color: Math.random() > 0.4 ? '255, 255, 255' : (Math.random() > 0.5 ? '160, 220, 255' : '255, 220, 180')
    });
  }

 
  const activeMeteors = [];

  function triggerMeteorCluster() {
    const count = Math.floor(Math.random() * 2) + 2; // 2 ya 3 taare
    const originX = Math.random() * (sWidth * 0.5);
    const originY = Math.random() * (sHeight * 0.2);

    for (let i = 0; i < count; i++) {
      activeMeteors.push({
        x: originX + (Math.random() * 140 - 70),
        y: originY + (Math.random() * 90 - 45),
        len: Math.random() * 70 + 60,
        
        speed: Math.random() * 2 + 4.5, 
        alpha: Math.random() * 0.3 + 0.7,
        size: Math.random() * 0.8 + 1.6
      });
    }
  }

  
  setInterval(() => {
    if (activeMeteors.length === 0) {
      triggerMeteorCluster();
    }
  }, Math.random() * 3000 + 6000);

 
  let lastScrollY = window.pageYOffset;
  let scrollDelta = 0;

  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;
    scrollDelta = (currentY - lastScrollY) * 0.15; 
    lastScrollY = currentY;
  });

  let t = 0;

  function renderSpace() {
    t += 0.015;
    starCtx.clearRect(0, 0, sWidth, sHeight);
    scrollDelta *= 0.94;

    
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.x += s.vx;
      s.y += s.vy - scrollDelta * 0.08;

      if (s.x < 0) s.x = sWidth;
      if (s.x > sWidth) s.x = 0;
      if (s.y < 0) s.y = sHeight;
      if (s.y > sHeight) s.y = 0;

      const shimmer = Math.abs(Math.sin(t * 6 * s.twinkle));
      const currentAlpha = s.baseAlpha * (0.6 + 0.4 * shimmer);

      starCtx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
      starCtx.beginPath();
      starCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      starCtx.fill();
    }

   
    for (let i = activeMeteors.length - 1; i >= 0; i--) {
      const m = activeMeteors[i];

      starCtx.save();
      const grad = starCtx.createLinearGradient(
        m.x, m.y,
        m.x - m.len, m.y - (m.len * 0.5)
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
      grad.addColorStop(0.3, `rgba(140, 215, 255, ${m.alpha * 0.75})`);
      grad.addColorStop(1, 'rgba(122, 90, 248, 0)');

      starCtx.strokeStyle = grad;
      starCtx.lineWidth = m.size;
      starCtx.shadowBlur = 12;
      starCtx.shadowColor = '#00d8ff';

      starCtx.beginPath();
      starCtx.moveTo(m.x, m.y);
      starCtx.lineTo(m.x - m.len, m.y - (m.len * 0.5));
      starCtx.stroke();
      starCtx.restore();

     
      m.x += m.speed;
      m.y += m.speed * 0.5;

      if (m.x > sWidth + 200 || m.y > sHeight + 200) {
        activeMeteors.splice(i, 1);
      }
    }

    requestAnimationFrame(renderSpace);
  }

  renderSpace();
}
