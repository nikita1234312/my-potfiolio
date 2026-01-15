document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navigation a')
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
    
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
    
            window.scrollTo({
                top: targetSection.offsetTop - 160,
                behavior: 'smooth'
            })
        })
    })

    const heroLinks = document.querySelectorAll('.hero-learn-more');
    
    heroLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 160,
                        behavior: 'smooth'
                    });
                }
            }
        });
    })

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            delay: 100,
            easing: 'ease',
            mirror: false,
            anchorPlacement: 'top-bottom'
        });

        window.addEventListener('load', () => {
            AOS.refresh();
        });
    }

})


const animateCounters = () => {
    const counters = document.querySelectorAll(".js-counter");

    const startCounter = (counter) => {
        const target = +counter.getAttribute("data-target");
        const duration = 2000; // 2 секунды
        let startTime = null;

        const updateCounter = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // ФУНКЦИЯ ЗАМЕДЛЕНИЯ (Easing)
            // Она делает так, чтобы числа синхронизировались идеально
            const easeProgress = 1 - (1 - progress) * (1 - progress);

            // Используем Math.round для мгновенного отклика маленьких чисел
            const currentCount = Math.round(easeProgress * target);

            // Отрисовка текста
            if (currentCount === target) {
                counter.innerText = target + (target === 350 ? '+' : '');
            } else {
                counter.innerText = currentCount;
            }

            // Продолжаем, пока не вышло время (2 секунды)
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Срабатывает, когда видно половину блока

    counters.forEach(counter => observer.observe(counter));
};

document.addEventListener('DOMContentLoaded', animateCounters);


const slider = document.getElementById('projectSlider');
const nextBtn = document.getElementById('nextSlide');
const prevBtn = document.getElementById('prevSlide');

if (slider) {
    nextBtn.addEventListener('click', () => {
        slider.scrollLeft += 200;
    });

    prevBtn.addEventListener('click', () => {
        slider.scrollLeft -= 200;
    });
}


const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("img01");
const closeBtn = document.querySelector(".modal-close");

// Находим все картинки в проектах
document.querySelectorAll('.work-image-side img').forEach(img => {
    img.onclick = function() {
        modal.style.display = "block";
        
        // Берем путь из атрибута data-full именно той картинки, на которую нажали
        const fullImagePath = this.getAttribute('data-full');
        modalImg.src = fullImagePath;
        
        document.body.style.overflow = "hidden";
        
        const wrapper = document.querySelector('.modal-content-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
    }
});

// Закрытие при нажатии на крестик
closeBtn.onclick = function() {
    closeModal();
}

// Закрытие при нажатии на пустую область
modal.onclick = function(e) {
    if (e.target !== modalImg) {
        closeModal();
    }
}

function closeModal() {
    const wrapper = document.querySelector('.modal-content-wrapper');
    if (wrapper) wrapper.scrollTo(0, 0);

    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "";
        modalImg.src = ""; // Очищаем, чтобы сбросить память модалки
    }, 1);
}



const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    // Если пролистали больше 500 пикселей — показываем кнопку
    if (window.pageYOffset > 500) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


async function typeText(lines, color) {
    const screen = document.querySelector('.monitor-screen');
    let consoleDiv = screen.querySelector('.console-output');
    
    if (!consoleDiv) {
        consoleDiv = document.createElement('div');
        consoleDiv.className = 'console-output';
        screen.appendChild(consoleDiv);
    }

    // Показываем консоль поверх формы
    consoleDiv.innerHTML = '';
    consoleDiv.style.display = 'block'; 
    consoleDiv.style.color = color;

    for (let lineText of lines) {
        const lineElement = document.createElement('div');
        lineElement.className = 'console-line';
        consoleDiv.appendChild(lineElement);

        for (let char of lineText) {
            lineElement.textContent += char;
            // Скорость печати
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Если нужно, чтобы через 5 секунд консоль исчезла и форма вернулась:
    setTimeout(() => {
        consoleDiv.style.display = 'none';
    }, 5000);
}

// Обновим обработчик формы
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.terminal-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('userName').value;
            const contact = document.getElementById('userContact').value;

            if (name.length < 2 || contact.length < 5) {
                await typeText([
                    "Traceback (most recent call):",
                    "  File 'contact_me.py', line 12, in validate",
                    "ValidationError: Данные заполнены неверно!",
                    ">> Пожалуйста, проверьте поля ввода."
                ], "#ff5555");
                return;
            }

            await typeText([
                "> Запуск скрипта...",
                "[INFO] Подключение к шлюзу: OK",
                "[INFO] Отправка пакета данных...",
                "> Сообщение успешно доставлено.",
                "-------------------------------",
                "СПАСИБО! Я скоро свяжусь с вами."
            ], "#00ff00");
        });
    }
});