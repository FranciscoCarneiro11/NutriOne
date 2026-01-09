export type Language = "pt" | "en" | "es";

export const translations = {
  pt: {
    // Welcome Page
    welcome: {
      headline: "Transforme",
      headlineRest: "o seu corpo e saúde com a",
      subheadline: "Junte-se a milhares de pessoas que já atingiram os seus objetivos com planos personalizados e IA.",
      cta: "Começar Agora",
      login: "Já tem uma conta?",
      loginLink: "Entrar",
      stats: {
        users: "Usuários",
        reviews: "Avaliações 5★",
        exercises: "Exercícios",
      },
    },
    // Common
    common: {
      next: "Próximo",
      back: "Voltar",
      save: "Guardar",
      cancel: "Cancelar",
      loading: "Carregando...",
      error: "Erro",
      success: "Sucesso",
    },
    // Onboarding
    onboarding: {
      gender: {
        title: "Qual é o seu sexo?",
        male: "Masculino",
        female: "Feminino",
      },
      age: {
        title: "Qual é a sua idade?",
        years: "anos",
      },
      goal: {
        title: "Qual é o seu objetivo?",
        loseWeight: "Perder peso",
        gainMuscle: "Ganhar músculo",
        maintain: "Manter peso",
      },
      height: {
        title: "Qual é a sua altura?",
      },
      weight: {
        title: "Qual é o seu peso atual?",
      },
      targetWeight: {
        title: "Qual é o seu peso alvo?",
      },
    },
    // Dashboard
    dashboard: {
      greeting: "Olá",
      todayMeals: "Refeições de Hoje",
      todayWorkout: "Treino de Hoje",
      progress: "Progresso",
    },
    // Diet
    diet: {
      title: "Dieta",
      meals: "Refeições",
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gordura",
    },
    // Workout
    workout: {
      title: "Treino",
      gallery: "Galeria",
      favorites: "Favoritos",
      yourWorkout: "Seu Treino",
    },
  },
  en: {
    // Welcome Page
    welcome: {
      headline: "Transform",
      headlineRest: "your body and health with",
      subheadline: "Join thousands of people who have already achieved their goals with personalized plans and AI.",
      cta: "Get Started",
      login: "Already have an account?",
      loginLink: "Sign In",
      stats: {
        users: "Users",
        reviews: "5★ Reviews",
        exercises: "Exercises",
      },
    },
    // Common
    common: {
      next: "Next",
      back: "Back",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    // Onboarding
    onboarding: {
      gender: {
        title: "What is your gender?",
        male: "Male",
        female: "Female",
      },
      age: {
        title: "How old are you?",
        years: "years",
      },
      goal: {
        title: "What is your goal?",
        loseWeight: "Lose weight",
        gainMuscle: "Gain muscle",
        maintain: "Maintain weight",
      },
      height: {
        title: "What is your height?",
      },
      weight: {
        title: "What is your current weight?",
      },
      targetWeight: {
        title: "What is your target weight?",
      },
    },
    // Dashboard
    dashboard: {
      greeting: "Hello",
      todayMeals: "Today's Meals",
      todayWorkout: "Today's Workout",
      progress: "Progress",
    },
    // Diet
    diet: {
      title: "Diet",
      meals: "Meals",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
    },
    // Workout
    workout: {
      title: "Workout",
      gallery: "Gallery",
      favorites: "Favorites",
      yourWorkout: "Your Workout",
    },
  },
  es: {
    // Welcome Page
    welcome: {
      headline: "Transforma",
      headlineRest: "tu cuerpo y salud con",
      subheadline: "Únete a miles de personas que ya han alcanzado sus objetivos con planes personalizados e IA.",
      cta: "Empezar Ahora",
      login: "¿Ya tienes una cuenta?",
      loginLink: "Iniciar Sesión",
      stats: {
        users: "Usuarios",
        reviews: "Reseñas 5★",
        exercises: "Ejercicios",
      },
    },
    // Common
    common: {
      next: "Siguiente",
      back: "Atrás",
      save: "Guardar",
      cancel: "Cancelar",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
    },
    // Onboarding
    onboarding: {
      gender: {
        title: "¿Cuál es tu sexo?",
        male: "Masculino",
        female: "Femenino",
      },
      age: {
        title: "¿Cuántos años tienes?",
        years: "años",
      },
      goal: {
        title: "¿Cuál es tu objetivo?",
        loseWeight: "Perder peso",
        gainMuscle: "Ganar músculo",
        maintain: "Mantener peso",
      },
      height: {
        title: "¿Cuál es tu altura?",
      },
      weight: {
        title: "¿Cuál es tu peso actual?",
      },
      targetWeight: {
        title: "¿Cuál es tu peso objetivo?",
      },
    },
    // Dashboard
    dashboard: {
      greeting: "Hola",
      todayMeals: "Comidas de Hoy",
      todayWorkout: "Entrenamiento de Hoy",
      progress: "Progreso",
    },
    // Diet
    diet: {
      title: "Dieta",
      meals: "Comidas",
      calories: "Calorías",
      protein: "Proteína",
      carbs: "Carbohidratos",
      fat: "Grasa",
    },
    // Workout
    workout: {
      title: "Entrenamiento",
      gallery: "Galería",
      favorites: "Favoritos",
      yourWorkout: "Tu Entrenamiento",
    },
  },
} as const;

export type TranslationKeys = typeof translations.pt;
