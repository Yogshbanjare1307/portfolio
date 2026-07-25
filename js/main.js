document.addEventListener('DOMContentLoaded', () => {
    // 1. Text Split
    const heroName = document.getElementById('hero-name');
    if (heroName) {
        const splitText = (node) => {
            let html = '';
            node.childNodes.forEach(child => {
                if (child.nodeType === 3) { // Text node
                    const text = child.nodeValue;
                    for (let i = 0; i < text.length; i++) {
                        if (text[i] === ' ') {
                            html += '&nbsp;';
                        } else {
                            html += `<span class="letter" style="display:inline-block;">${text[i]}</span>`;
                        }
                    }
                } else if (child.nodeType === 1 && child.tagName === 'BR') {
                    html += '<br>';
                } else if (child.nodeType === 1) {
                    html += child.outerHTML; 
                }
            });
            return html;
        };
        heroName.innerHTML = splitText(heroName);
    }

    // 3. GSAP Register
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 13. Floating Particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 2; // 2-5px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.position = 'absolute';
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            particle.style.backgroundColor = Math.random() > 0.5 ? 'var(--accent)' : 'var(--accent-2)';
            particle.style.borderRadius = '50%';
            
            const duration = Math.random() * 15 + 10; // 10-25s
            particle.style.animation = `floatUp ${duration}s linear infinite`;
            particlesContainer.appendChild(particle);
        }
    }
    
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes floatUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-100vh); }
        }
    `;
    document.head.appendChild(style);

    // 7. Mobile Nav
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // 5. Smooth Scroll
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
                
                if (navToggle && navLinks) {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // 6. Scroll Events
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    const heroBg = document.querySelector('.hero-bg');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                
                // Progress
                if (scrollProgress) {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
                    scrollProgress.style.width = `${progress}%`;
                }

                // Navbar
                if (navbar) {
                    if (scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                }

                // Parallax
                if (heroBg) {
                    heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
                }

                // Active Nav Link
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (scrollY >= (sectionTop - 150)) {
                        current = section.getAttribute('id');
                    }
                });

                navItems.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${current}`) {
                        a.classList.add('active');
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // 9. Before/After Slider
    const compContainer = document.getElementById('comparison-container');
    const compSlider = document.getElementById('comparison-slider');
    const beforeImg = document.getElementById('before-img');
    
    if (compContainer && compSlider && beforeImg) {
        let isDown = false;

        const updateSlider = (e) => {
            const rect = compContainer.getBoundingClientRect();
            let clientX = e.clientX;
            if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;
            if (clientX === undefined) return;
            
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percentage = (x / rect.width) * 100;
            compSlider.style.left = `${percentage}%`;
            beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };

        compContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            updateSlider(e);
        });
        compContainer.addEventListener('touchstart', (e) => {
            isDown = true;
            updateSlider(e);
        });
        
        window.addEventListener('mouseup', () => isDown = false);
        window.addEventListener('touchend', () => isDown = false);

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            updateSlider(e);
        });
        window.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            updateSlider(e);
        });

        compSlider.style.left = '50%';
        beforeImg.style.clipPath = 'inset(0 50% 0 0)';
    }

    // 10. Video Modal
    const videoTriggers = document.querySelectorAll('[data-video]');
    const videoModal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const modalClose = document.getElementById('modal-close');

    const closeModal = () => {
        if (videoModal && modalIframe) {
            videoModal.classList.remove('active');
            modalIframe.src = '';
            document.body.style.overflow = '';
        }
    };

    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const src = trigger.getAttribute('data-video');
            if (videoModal && modalIframe && src) {
                modalIframe.src = src;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // 11. Magnetic Button
    const showreelBtn = document.getElementById('showreel-btn');
    if (showreelBtn && window.matchMedia("(pointer: fine)").matches) {
        showreelBtn.addEventListener('mousemove', (e) => {
            const rect = showreelBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const moveX = (x / (rect.width / 2)) * 6;
            const moveY = (y / (rect.height / 2)) * 6;
            showreelBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            showreelBtn.style.transition = 'none';
        });

        showreelBtn.addEventListener('mouseleave', () => {
            showreelBtn.style.transform = `translate(0px, 0px)`;
            showreelBtn.style.transition = 'transform 0.3s ease';
        });
    }

    // 12. Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (cursor && follower && window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let followerX = mouseX;
        let followerY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const render = () => {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;

            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        const interactives = document.querySelectorAll('a, button, [data-video], .comparison-slider');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(1.5)';
                cursor.style.transition = 'transform 0.2s';
                follower.style.width = '45px';
                follower.style.height = '45px';
                follower.style.borderColor = 'var(--accent)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
                cursor.style.transition = 'transform 0.2s';
                follower.style.width = '30px';
                follower.style.height = '30px';
                follower.style.borderColor = '';
            });
        });
    }

    // 8. GSAP ScrollTrigger Animations
    if (typeof gsap !== 'undefined') {
        const initScrollAnimations = () => {
            gsap.utils.toArray('.section-label, .section-title').forEach(el => {
                gsap.fromTo(el, 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 85%' } }
                );
            });

            if (document.querySelector('.work-card')) {
                gsap.fromTo('.work-card',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: '.work-grid', start: 'top 80%' } }
                );
            }

            if (document.querySelector('.about-grid > *')) {
                gsap.fromTo('.about-grid > *',
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: '.about-grid', start: 'top 80%' } }
                );
            }

            if (document.querySelector('.about-details .detail-item')) {
                gsap.fromTo('.about-details .detail-item',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: '.about-details', start: 'top 85%' } }
                );
            }

            gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
                const width = bar.getAttribute('data-width') || 0;
                gsap.fromTo(bar,
                    { width: '0%' },
                    { width: `${width}%`, duration: 1, scrollTrigger: { trigger: bar, start: 'top 90%' } }
                );
            });

            if (document.querySelector('.tool-card')) {
                gsap.fromTo('.tool-card',
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: '.tools-grid', start: 'top 85%' } }
                );
            }

            if (document.querySelector('.ai-card')) {
                gsap.fromTo('.ai-card',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: '.ai-grid', start: 'top 80%' } }
                );
            }

            if (document.querySelector('.timeline-window')) {
                const tl = gsap.timeline({ scrollTrigger: { trigger: '#timeline', start: 'top 80%' } });
                tl.fromTo('.timeline-window', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
                  .fromTo('.track-block', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.8, stagger: 0.1 }, "-=0.2")
                  .add(() => {
                      const playhead = document.getElementById('playhead');
                      const timecode = document.querySelector('.timecode-display');
                      const tracks = document.querySelectorAll('.track-block');
                      
                      gsap.fromTo(playhead, 
                          { left: '0%' },
                          {
                              left: '100%',
                              duration: 5,
                              ease: 'none',
                              repeat: -1,
                              onUpdate: function() {
                                  const progress = this.progress();
                                  const totalSeconds = progress * 15;
                                  const secs = Math.floor(totalSeconds);
                                  const frames = Math.floor((totalSeconds - secs) * 24);
                                  if (timecode) {
                                      timecode.textContent = `00:00:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
                                  }
                                  
                                  tracks.forEach(track => {
                                      const leftPct = parseFloat(track.style.left) / 100 || 0;
                                      const widthPct = parseFloat(track.style.width) / 100 || 0;
                                      if (progress >= leftPct && progress <= (leftPct + widthPct)) {
                                          track.classList.add('active-clip');
                                      } else {
                                          track.classList.remove('active-clip');
                                      }
                                  });
                              }
                          }
                      );
                  });
            }

            if (document.querySelector('.comparison-container')) {
                gsap.fromTo('.comparison-container',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: '.comparison-wrapper', start: 'top 80%' } }
                );
            }

            if (document.querySelector('.contact-heading')) {
                gsap.fromTo('.contact-heading', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '#contact', start: 'top 80%' } });
            }
            if (document.querySelector('.contact-card')) {
                gsap.fromTo('.contact-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: '.contact-card', start: 'top 85%' } });
            }
        };

        initScrollAnimations();
    }
});

// 2 & 4. Preloader and Hero Animations
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
                initHeroAnimations();
            }, 600);
        } else {
            initHeroAnimations();
        }
    }, 1000);
});

function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline();

    if (document.querySelector('.letter')) {
        tl.fromTo('.letter', 
            { y: 50, opacity: 0, rotateX: -90 },
            { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.04, ease: 'back.out(1.7)' }
        );
    }

    if (document.querySelector('.hero-badge')) {
        tl.fromTo('.hero-badge', { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.4");
    }

    if (document.querySelector('.hero-role-wrapper')) {
        tl.fromTo('.hero-role-wrapper', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.6");
    }

    if (document.querySelector('.hero-divider')) {
        tl.fromTo('.hero-divider', { scaleX: 0, transformOrigin: 'center' }, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, "-=0.4");
    }

    if (document.querySelector('.hero-tagline')) {
        tl.fromTo('.hero-tagline', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.6");
    }

    if (document.querySelector('.hero-cta-group')) {
        tl.fromTo('.hero-cta-group', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
    }

    if (document.querySelector('.hero-stats')) {
        tl.fromTo('.hero-stats', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
    }

    if (document.querySelector('.scroll-indicator')) {
        tl.fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2");
    }

    if (document.querySelector('.hero-socials')) {
        tl.fromTo('.hero-socials', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, "-=0.8");
    }

    // 14. Counter Animation
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const count = parseFloat(stat.getAttribute('data-count')) || 0;
        gsap.to(stat, {
            textContent: count,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            stagger: 1,
        });
    });
}
