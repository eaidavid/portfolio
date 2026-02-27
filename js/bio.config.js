// Edite este arquivo para gerenciar a página inicial (links da bio).
// Dica: para ocultar um item sem apagar, use `enabled: false`.
window.BIO_CONFIG = {
  profile: {
    name: "David Alves",
    tagline: "Links • Portfólio • Contato",
    avatar: "assets/img/foto-perfil.png",
    status: "Disponível para projetos e freelas",
    meta: [
      { icon: "fas fa-location-dot", text: "Brasil" },
      { icon: "fas fa-bolt", text: "Respondo rápido no WhatsApp" }
    ]
  },
  primaryCta: {
    label: "Portfólio dev",
    href: "dev.html",
    icon: "fas fa-code"
  },
  cards: [
    {
      title: "Portfólio Dev",
      description: "Projetos, stack e contato",
      href: "dev.html",
      icon: "fas fa-code",
      accent: "#20e48d"
    },
    {
      title: "Portfólio Design",
      description: "Serviços, cases e contato",
      href: "design.html",
      icon: "fas fa-pen-nib",
      accent: "#12bf74"
    },
    {
      title: "WhatsApp",
      description: "Orçamentos e parcerias",
      href: "https://wa.me/5562995302425?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20link%20da%20bio%20e%20quero%20fazer%20um%20or%C3%A7amento.%0A%0AMeu%20nome%20%C3%A9%20",
      icon: "fab fa-whatsapp",
      accent: "#22c55e",
      newTab: true,
      badge: "Direto"
    },
    {
      title: "GitHub",
      description: "Repos, libs e projetos",
      href: "https://github.com/eaidavid",
      icon: "fab fa-github",
      accent: "#12bf74",
      newTab: true
    }
  ],
  links: [
    {
      label: "LinkedIn",
      subtitle: "Experiência e networking",
      href: "http://linkedin.com/in/david-alves-477654225",
      icon: "fab fa-linkedin-in",
      accent: "#12bf74",
      newTab: true
    },
    {
      label: "GitHub",
      subtitle: "@eaidavid",
      href: "https://github.com/eaidavid",
      icon: "fab fa-github",
      accent: "#94a3b8",
      newTab: true
    },
    {
      label: "WhatsApp",
      subtitle: "Mensagem direta",
      href: "https://wa.me/5562995302425",
      icon: "fab fa-whatsapp",
      accent: "#22c55e",
      newTab: true
    },
    {
      label: "Email (copiar)",
      subtitle: "Clique para copiar",
      type: "copy",
      value: "eaidavidalves@gmail.com",
      icon: "fas fa-envelope",
      accent: "#12bf74"
    }
  ],
  footer: {
    brand: "DA.",
    name: "David Alves",
    right: [
      { label: "GitHub", href: "https://github.com/eaidavid", icon: "fab fa-github", newTab: true },
      {
        label: "LinkedIn",
        href: "http://linkedin.com/in/david-alves-477654225",
        icon: "fab fa-linkedin-in",
        newTab: true
      }
    ]
  }
};
