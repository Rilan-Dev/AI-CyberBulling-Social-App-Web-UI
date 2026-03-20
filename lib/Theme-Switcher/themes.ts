export type ThemeOption = {
  name: string
  id: string
  className: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundPreview: string
  cardPreview: string
  textPreview: string
  description: string
}

export const themes: ThemeOption[] = [
  {
    name: "Default",
    id: "default",
    className: "theme-default",
    primaryColor: "hsl(222.2, 47.4%, 11.2%)",
    secondaryColor: "hsl(210, 40%, 96.1%)",
    accentColor: "hsl(210, 40%, 96.1%)",
    backgroundPreview: "#ffffff",
    cardPreview: "#ffffff",
    textPreview: "#09090b",
    description: "Clean and minimal design with a focus on readability and usability.",
  },
  {
    name: "Corporate",
    id: "corporate",
    className: "theme-corporate",
    primaryColor: "hsl(215, 60%, 25%)",
    secondaryColor: "hsl(215, 20%, 90%)",
    accentColor: "hsl(215, 70%, 50%)",
    backgroundPreview: "#f8fafc",
    cardPreview: "#ffffff",
    textPreview: "#1e293b",
    description: "Professional and trustworthy design for corporate applications.",
  },
  {
    name: "Elegant",
    id: "elegant",
    className: "theme-elegant",
    primaryColor: "hsl(260, 30%, 30%)",
    secondaryColor: "hsl(260, 10%, 90%)",
    accentColor: "hsl(335, 80%, 60%)",
    backgroundPreview: "#f9f7fc",
    cardPreview: "#ffffff",
    textPreview: "#2d2b38",
    description: "Sophisticated design with a touch of luxury for premium applications.",
  },
  {
    name: "Tech",
    id: "tech",
    className: "theme-tech",
    primaryColor: "hsl(200, 70%, 30%)",
    secondaryColor: "hsl(200, 20%, 95%)",
    accentColor: "hsl(160, 80%, 40%)",
    backgroundPreview: "#f0f7fa",
    cardPreview: "#ffffff",
    textPreview: "#0c3247",
    description: "Modern and innovative design for tech-focused applications.",
  },
  {
    name: "Warm",
    id: "warm",
    className: "theme-warm",
    primaryColor: "hsl(5, 78%, 48%)", // Changed from sandal color to a vibrant red-orange
    secondaryColor: "hsl(25, 30%, 95%)",
    accentColor: "hsl(45, 90%, 50%)",
    backgroundPreview: "#fffaf5",
    cardPreview: "#ffffff",
    textPreview: "#3d2c20",
    description: "Warm and inviting design for friendly and approachable applications.",
  },
  {
    name: "Dark",
    id: "dark",
    className: "dark",
    primaryColor: "hsl(210, 40%, 98%)",
    secondaryColor: "hsl(217.2, 32.6%, 17.5%)",
    accentColor: "hsl(217.2, 32.6%, 17.5%)",
    backgroundPreview: "#09090b",
    cardPreview: "#1c1c1f",
    textPreview: "#ffffff",
    description: "Dark theme for reduced eye strain and modern aesthetics.",
  },
  {
    name: "Royal Blue Gradient",
    id: "royal-blue",
    className: "theme-royal-blue",
    primaryColor: "#0288d1", // Updated to match reference image
    secondaryColor: "#01579b", // Updated to match reference image
    accentColor: "#29b6f6", // Updated to match reference image
    backgroundPreview: "#f5f5f5",
    cardPreview: "#ffffff",
    textPreview: "#212121",
    description: "Professional gradient theme with royal blue accents for enterprise applications.",
  },
  {
    name: "Sky Blue Dark",
    id: "sky-blue-dark",
    className: "theme-sky-blue-dark",
    primaryColor: "hsl(207, 90%, 77%)", // #90caf9 converted to HSL
    secondaryColor: "hsl(200, 18%, 73%)", // #b0bec5 converted to HSL
    accentColor: "hsl(217, 100%, 75%)", // #82B1FF converted to HSL
    backgroundPreview: "#303030",
    cardPreview: "#424242",
    textPreview: "#ffffff",
    description: "Dark theme with sky blue gradients for modern interfaces.",
  },
]

export function getTheme(themeId: string): ThemeOption | undefined {
  return themes.find((theme) => theme.id === themeId)
}
