import React, { createContext, useContext, useState } from 'react';

export type Language = 'PT' | 'EN' | 'PL';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  t: (key: string, section?: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dicionário em Português do Brasil - Tema Patrulha Canina - Aniversário das Gêmeas Ada e Gabi
const TRANSLATIONS: Record<string, Record<string, any>> = {
  common: {
    date: "Sábado, 14",
    time: "A partir do meio-dia",
    location: "Casa da Bisavó",
    addCalendar: "SALVAR NA AGENDA",
    copied: "COPIADO COM SUCESSO!",
    copyPin: "COPIAR ENDEREÇO",
  },
  nav: {
    rules: "Aventuras 🐾",
    whenWhere: "Local 📍",
    rsvp: "Confirmar Presença 🐾",
    wishlist: "Mimos & PIX 🎁",
    confirmed: "confirmados",
    back: "Voltar",
    dadVault: "Painel dos Pais",
    subtitle: "Ada e Gabi • Patrulha Canina 🐾",
    level: "ADA E GABI 🐾",
    comicPortrait: "Nossas Aniversariantes",
    guestRegistry: "Controle de Convidados",
  },
  hero: {
    badgeText: "🐾 PATRULHA CANINA • ADA E GABI 🐾",
    sticker1: "★ GÊMEAS ADA E GABI ★",
    sticker2: "⚡ PATRULHA CANINA ⚡",
    sticker3: "✓ DOCINHOS & DIVERSÃO",
    sticker4: "❄️ VENHA COMEMORAR",
    meetDad: "🐶 CONHECER AS GÊMEAS",
    title: "ADA E GABI",
    subtitle: "ANIVERSÁRIO DAS GÊMEAS • PATRULHA CANINA",
    quote: '"Venha comemorar esse dia tão especial e cheio de alegria com a nossa duplinha!"',
    subtext: "O inverno está chegando! Convidamos você para uma tarde cheia de brincadeiras, alegria e muito carinho.",
    rsvpBtn: "CONFIRMAR PRESENÇA",
    wishlistBtn: "LISTA DE MIMOS & PIX",
  },
  rules: {
    badge: "MISSÃO DIVERTIDA",
    title: "GUIA DA NOSSA FESTINHA",
    subtext: "Dicas especiais para a tarde mais animada da Baía da Aventura!",
    rule1Title: "Missão #1: Energia para Brincar",
    rule1Badge: "DIVERSÃO",
    rule1Quote: "Venha com roupa confortável e sapatos prontos para pular!",
    rule1Sub: "Teremos brincadeiras, músicas e muitas risadas com a Patrulha Canina.",
  },
  rsvp: {
    badge: "LISTA OFICIAL DE CONVIDADOS",
    title: "CONFIRMAÇÃO DE PRESENÇA (RSVP)",
    subtext: "Por favor, confirme sua presença para organizarmos tudo com muito carinho!",
    statusPrompt: "Você e sua família estarão com a gente nessa comemoração?",
    yes: "Sim, estaremos lá! 🐾",
    maybe: "Talvez / Vamos tentar confirmar 🤔",
    no: "Infelizmente não poderemos ir 😢",
    nameLabel: "Nome da Família / Responsável",
    namePlaceholder: "Ex: Titia Fernanda e Família",
    guestCountLabel: "Quantas pessoas no total (adultos + crianças)?",
    messageLabel: "Deixe um recadinho carinhoso para as meninas (opcional)",
    messagePlaceholder: "Escreva uma mensagem de parabéns para a Ada e a Gabi...",
    submit: "CONFIRMAR MINHA PRESENÇA",
    successTitle: "Presença Confirmada com Sucesso! 🐾",
    successDesc: "Muito obrigado! Estamos muito felizes em poder comemorar esse dia tão especial juntos.",
    viewRoster: "Ver Lista de Convidados Confirmados",
    backToForm: "Preencher Outra Confirmação",
    whatsappBtn: "AVISAR OS PAIS NO WHATSAPP 📲",
  },
  wishlist: {
    badge: "MIMOS & PIX DE INVERNO",
    title: "LISTA DE PRESENTINHOS & PIX",
    subtext: "Como o inverno está chegando e espaço na mala é reduzido, mimos pequenos ou PIX são a melhor opção para comprarmos o que elas mais precisam!",
    anon: "DICA: O PIX nos ajuda a comprar roupinhas térmicas e calçados no tamanho certinho!",
    claimed: "Reservado / Escolhido",
    available: "Disponível para Presentear",
    reserveBtn: "Vou Dar Esse Presentinho 🎁",
    unreserveBtn: "Cancelar Reserva",
  },
  footer: {
    creator: "Ada e Gabi • Patrulha Canina",
    rights: "Todos os direitos reservados à diversão!",
    reminder: "GUARDE ESSA DATA",
    seeYou: "ESPERAMOS POR VOCÊ!",
    quote: "Casa da Bisavó • Sábado, 14 • A partir do meio-dia • Venha comemorar com a Patrulha Canina!",
    tagline: "ADA E GABI 💕",
    subTagline: "Patrulha Canina pronta para a diversão!",
    comicLink: "Fotos das Meninas",
    vaultLink: "Área dos Pais (Admin)",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang] = useState<Language>('PT');
  const [showModal, setShowModal] = useState<boolean>(false);

  const t = (key: string, section?: string): any => {
    if (section && TRANSLATIONS[section] && TRANSLATIONS[section][key] !== undefined) {
      return TRANSLATIONS[section][key];
    }
    if (TRANSLATIONS[key] !== undefined) {
      return TRANSLATIONS[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, showModal, setShowModal, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
