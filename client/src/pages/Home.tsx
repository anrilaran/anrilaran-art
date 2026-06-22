import { Button } from "@/components/ui/button";
import { Mail, Instagram, Palette, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ru");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLang = localStorage.getItem("preferredLang") || "ru";
    setCurrentLang(savedLang);
    applyTranslation(savedLang);
  }, []);

  const applyTranslation = (lang: string) => {
    // Update React state immediately
    setCurrentLang(lang);
    localStorage.setItem("preferredLang", lang);
    
    fetch(`/translations.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((translations) => {
        const langData = translations[lang];
        if (!langData) {
          console.error(`Language data for '${lang}' not found in translations.json`);
          console.log('Available languages:', Object.keys(translations));
          return;
        }
        // Update all DOM elements with translations
        Object.entries(langData).forEach(([key, value]) => {
          const elements = document.querySelectorAll(`[id="${key}"]`);
          elements.forEach((element) => {
            if (key.includes("bio") || key.includes("quote") || key.includes("snippet")) {
              element.innerHTML = value as string;
            } else if (key === "publication_link") {
              // Update href for publication link
              (element as HTMLAnchorElement).href = value as string;
            } else {
              element.textContent = value as string;
            }
          });
        });
        document.documentElement.lang = lang;
      })
      .catch((error) => console.error("Error loading translations:", error));
  };

  const handleLanguageChange = (lang: string) => {
    applyTranslation(lang);
    setLangMenuOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:opacity-80 transition">
            <img src="/signature.png" alt="Anri Laran" className="h-8 md:h-12 object-contain" />
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4 md:gap-8 text-xs md:text-sm font-normal items-center">
            <a href="#about" id="nav_about" className="hover:text-blue-600 transition">Манифест</a>
            <a href="#works" id="nav_works" className="hover:text-blue-600 transition">Полотна</a>
            <a href="#exhibitions" id="nav_exhibitions" className="hover:text-blue-600 transition">Интервенции</a>
            <a href="#media" id="nav_media" className="hover:text-blue-600 transition">Дискурс</a>
            <a href="#contact" id="nav_contact" className="hover:text-blue-600 transition">Координаты</a>
            
            {/* Desktop Language Switcher */}
            <div className="relative ml-4 border-l border-gray-300 pl-4">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-xs md:text-sm font-normal hover:text-blue-600 transition"
              >
                <span id="lang_display">{currentLang === "ru" ? "Ru" : currentLang === "en" ? "En" : "Fr"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button
                    onClick={() => handleLanguageChange("ru")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs md:text-sm"
                  >
                    Ru
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs md:text-sm border-t border-gray-200"
                  >
                    En
                  </button>
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs md:text-sm border-t border-gray-200"
                  >
                    Fr
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button and Language Switcher */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Language Switcher - Outside Menu */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-xs font-normal hover:text-blue-600 transition p-2"
              >
                <span id="lang_display_mobile">{currentLang === "ru" ? "Ru" : currentLang === "en" ? "En" : "Fr"}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button
                    onClick={() => handleLanguageChange("ru")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
                  >
                    Ru
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs border-t border-gray-200"
                  >
                    En
                  </button>
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs border-t border-gray-200"
                  >
                    Fr
                  </button>
                </div>
              )}
            </div>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            <a href="#about" onClick={closeMobileMenu} id="nav_about_mobile" className="block py-2 hover:text-blue-600 transition">Манифест</a>
            <a href="#works" onClick={closeMobileMenu} id="nav_works_mobile" className="block py-2 hover:text-blue-600 transition">Полотна</a>
            <a href="#exhibitions" onClick={closeMobileMenu} id="nav_exhibitions_mobile" className="block py-2 hover:text-blue-600 transition">Интервенции</a>
            <a href="#media" onClick={closeMobileMenu} id="nav_media_mobile" className="block py-2 hover:text-blue-600 transition">Дискурс</a>
            <a href="#contact" onClick={closeMobileMenu} id="nav_contact_mobile" className="block py-2 hover:text-blue-600 transition">Координаты</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden pt-6 pb-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-5 w-40 h-40 md:w-72 md:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-5 w-40 h-40 md:w-72 md:h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 w-full">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 my-8">
            <div className="w-full overflow-hidden rounded-xl shadow-2xl border border-gray-100">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '16/9' }}
                src="https://www.dropbox.com/scl/fi/6dmgui9cxjbuojuarl7nb/hero-video.mp4?rlkey=j4srbpwv9b37vrf99udisr5wo&st=rels7c5p&dl=1"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <h1 id="hero_title" className="font-bold mb-6 md:mb-8 tracking-tight" style={{ maxWidth: '560px', margin: '0 auto', fontSize: 'clamp(1.275rem, 5.525vw, 2.975rem)', textAlign: 'center' }}>
            Форма которая говорит
          </h1>
          <p id="hero_subtitle" className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
            Полиформический экспрессионизм: резонанс воли внутри живой партитуры
          </p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
            <Button
              onClick={() => document.getElementById("works")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg"
              id="hero_btn_gallery"
            >
              Смотреть Галерею
            </Button>
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg"
              id="hero_btn_contact"
            >
              Связаться
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 id="about_title" className="font-bold mb-8 md:mb-12 text-center" style={{ fontSize: 'clamp(1.105rem, 4.675vw, 2.55rem)' }}>Художник, Философ, Визионер</h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="rounded-lg flex items-center justify-center overflow-hidden bg-gray-50" style={{ height: '408px' }}>
               <img src="/artist-photo.jpg" alt="Anri Laran" className="h-full w-auto" id="about_portrait" />
            </div>
            <div>
              <p id="about_bio" className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                <strong>Anri Laran</strong> (род. 1970) — концептуальный художник и основатель макро-концепции Полиформизма. Выпускник Академии Дизайна и Архитектуры (1996). Его творческий путь — это архитектоническая деконструкция реальности, реализуемая на стыке Полиформического экспрессионизма и Пост-геометрического гуманизма.
              </p>
              <blockquote id="about_quote" className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 rounded italic text-gray-700 mb-6">
                «Каждый мой холст — это авторская партитура, где угловая эмпатия форм преобразует пространственное напряжение в чистый хроматический катарсис».
              </blockquote>
              <p id="about_bio2" className="text-gray-600 leading-relaxed">
                Работы Anri Laran, включая этапные серии Grand Edition, зафиксированы в международном арт-пространстве как акты концептуального сопротивления цифровой стерильности. Его творчество исследует силовые узлы между аналоговой сингулярностью и энтропией авторского жеста, требуя от зрителя не пассивного потребления, а жесткого эстетического усилия.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Style & Philosophy Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 id="style_title" className="font-bold mb-8 md:mb-12 text-center" style={{ fontSize: 'clamp(1.105rem, 4.675vw, 2.55rem)' }}>Стиль и Философия</h2>
          <p id="style_description" className="text-base md:text-lg text-gray-700 text-center mb-8 md:mb-12 leading-relaxed">
            Через форму, цветовые аккорды и уплотнение живописной материи Ларан переводит алгоритмическую стерильность в драматические геометрические партитуры живого человеческого присутствия. Каждая работа — многослойное исследование человеческих переживаний, где цвет и линия создают уникальный визуальный язык, проникающий в подсознание зрителя.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { id: "style_keyword1", text: "Живая геометрия" },
              { id: "style_keyword2", text: "Энтропия авторского жеста" },
              { id: "style_keyword3", text: "Угловая эмпатия формы" },
              { id: "style_keyword4", text: "Аналоговая сингулярность" },
            ].map((keyword) => (
              <div key={keyword.id} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
                <p id={keyword.id} className="font-semibold text-blue-600 text-lg">{keyword.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="works" className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="works_title" className="font-bold mb-4 text-center" style={{ fontSize: 'clamp(1.105rem, 4.675vw, 2.55rem)' }}>Избранные Полотна</h2>
          <p id="works_subtitle" className="text-center text-gray-600 mb-8 md:mb-12 text-base md:text-lg">Динамика и Цвет</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { img: "/01_Three_Grraces_s.jpg", titleId: "work1_title", descId: "work1_desc", title: "Три грации", desc: "холст, масло, 2025" },
              { img: "/02_Guardian_s.jpg", titleId: "work2_title", descId: "work2_desc", title: "Хранитель", desc: "холст, масло, 2025" },
              { img: "/03_Balerina_s.jpg", titleId: "work3_title", descId: "work3_desc", title: "Балерина и пуанты", desc: "холст, масло, 2025" },
              { img: "/04_Reflection_s.jpg", titleId: "work4_title", descId: "work4_desc", title: "Отражение", desc: "холст, масло, 2025" },
              { img: "/05_Cat_s.jpg", titleId: "work5_title", descId: "work5_desc", title: "Кошка", desc: "холст, масло, 2025" },
              { img: "/06_Hot_dance_s.jpg", titleId: "work6_title", descId: "work6_desc", title: "Горячий танец", desc: "холст, масло, 2025" },
            ].map((work, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="rounded-lg aspect-square mb-4 flex items-center justify-center overflow-hidden hover:shadow-lg transition">
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover" />
                </div>
                <h3 id={work.titleId} className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">{work.title}</h3>
                <p id={work.descId} className="text-sm text-gray-500">{work.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              onClick={() => window.open("https://www.saatchiart.com/anrilaran", "_blank")}
              className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 text-lg"
              id="works_btn"
            >
              Посетить полную галерею
            </Button>
          </div>
        </div>
      </section>

      {/* Exhibitions Section */}
      <section id="exhibitions" className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="exhibitions_title" className="font-bold mb-8 md:mb-12 text-center" style={{ fontSize: 'clamp(1.105rem, 4.675vw, 2.55rem)' }}>Интервенции</h2>
          
          {/* Virtual Exhibition Block */}
          <div className="exhibition-container">
            <h3 id="exhibition_virtual_title" className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Виртуальная персональная интервенция «Чувства, эмоции, смыслы»</h3>
            <p id="exhibition_virtual_description" className="text-center text-gray-700 mb-8 md:mb-12 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
              Ретроспектива / Чувства, эмоции, смыслы / (1993–2025) — это манифест присутствия живого человеческого жеста в эпоху цифровой стерильности. Экспозиция деконструирует три десятилетия эволюции авторского визуального языка, где ранние геометрические партитуры сталкиваются с плотным хроматическим резонансом зрелого полиформического экспрессионизма. Виртуальное пространство лишь удерживает рамку для фиксации энтропии, ритмов и трансформации формы во времени. Вход открыт исключительно для вдумчивого анализа и бескомпромиссного эстетического напряжения.
            </p>
            
            {/* iframe Container */}
            <div className="exhibition-iframe-wrapper">
              <iframe 
                width="560" 
                height="315" 
                src="https://www.artsteps.com/embed/68fe2b70252e7a4da9489856/560/315" 
                frameBorder="0" 
                allowFullScreen
                className="exhibition-iframe"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="media" className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="media_title" className="font-bold mb-8 md:mb-12 text-center" style={{ fontSize: 'clamp(1.105rem, 4.675vw, 2.55rem)' }}>Дискурс</h2>
          
          {/* Publication Preview Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Publication Cover - Left Side */}
              <div className="md:col-span-1 h-80 md:h-auto bg-gray-100 overflow-hidden">
                <img 
                  src="/publication-cover.jpg" 
                  alt="Publication Cover" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Publication Content - Right Side */}
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 id="publication_title" className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                    Эмоции — Когда тишина умеет говорить
                  </h3>
                  
                  <div id="publication_snippet" className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 line-clamp-6" style={{ whiteSpace: 'pre-wrap' }}>
                  Тишина в этих картинах не пустота, а работающая сила: она шлифует форму, вводит цвет в состояние речи и оставляет в слоях то, что боится быть сказанным вслух. Эта серия — попытка услышать молчание как живой голос, где каждый мазок и каждый фрагмент — часть разговора.

                  Шёпот мастерской...
                  </div>
                  
                  <a 
                    id="publication_link" 
                    href="https://telegra.ph/EHmocii--Kogda-tishina-umeet-govorit-08-22-2" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gray-400 hover:bg-gray-500 text-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg mt-4">
                      <span id="publication_read_more">читать полную версию</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 id="contact_title" className="font-bold mb-4 text-center" style={{ fontSize: 'clamp(1.105rem, 4.675vw, 2.55rem)' }}>Координаты</h2>
          <p id="contact_subtitle" className="text-center text-gray-600 mb-8 md:mb-12 text-base md:text-lg">
            Для вопросов о приобретении работ, персональных заказах или сотрудничестве, пожалуйста, свяжитесь с нами.
          </p>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="mb-6">
              <label id="form_name" className="block text-sm font-medium text-gray-700 mb-2">Ваше имя</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                id="form_name_input"
                placeholder="Ваше имя"
              />
            </div>
            <div className="mb-6">
              <label id="form_email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                id="form_email_input"
                placeholder="your@email.com"
              />
            </div>
            <div className="mb-6">
              <label id="form_message" className="block text-sm font-medium text-gray-700 mb-2">Сообщение</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
                id="form_message_input"
                placeholder="Ваше сообщение..."
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 text-lg"
              id="form_submit"
            >
              {submitted ? "Спасибо! Сообщение отправлено" : "Отправить"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
            <div>
              <h4 id="footer_about" className="font-semibold mb-4 text-base md:text-lg">Об Anri Laran</h4>
              <p id="footer_bio" className="text-gray-400 text-sm md:text-base leading-relaxed">
                Архитектор смыслов и защитник аналоговой сингулярности. Полиформический экспрессионизм как манифест безусловного присутствия живого человеческого жеста.
              </p>
            </div>
            <div>
              <h4 id="footer_nav" className="font-semibold mb-4 text-base md:text-lg">Навигация</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition" id="footer_about_link">Манифест</a></li>
                <li><a href="#works" className="hover:text-white transition" id="footer_works_link">Полотна</a></li>
                <li><a href="#exhibitions" className="hover:text-white transition" id="footer_exhibitions_link">Интервенции</a></li>
                <li><a href="#media" className="hover:text-white transition" id="footer_media_link">Дискурс</a></li>
                <li><a href="#contact" className="hover:text-white transition" id="footer_contact_link">Координаты</a></li>
              </ul>
            </div>
            <div>
              <h4 id="footer_social" className="font-semibold mb-4 text-base md:text-lg">Социальные сети</h4>
              <div className="flex gap-4">
                <a href="https://instagram.com" className="hover:text-blue-400 transition">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="mailto:contact@anrilaran.com" className="hover:text-blue-400 transition">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p id="footer_copyright">© 2026 Anri Laran. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
