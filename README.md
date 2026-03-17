# NutriOne 

**Plataforma web de nutrição e fitness personalizada com IA**

🌐 **Live:** [nutrione.app](https://nutrione.app) · 
👥 **Utilizado por +25 utilizadores**

---

## Sobre o Projeto

O NutriOne é um MVP lançado a público que utiliza IA generativa para 
democratizar o acesso a planos de nutrição e treino personalizados. 
O utilizador responde a um quiz inicial com dados biométricos e 
objetivos e a partir daí, a plataforma gera e adapta planos 
completamente personalizados.

Desenvolvido como produto real, com utilizadores ativos, não como 
projeto académico.

---

## Como Funciona
```
Utilizador regista-se → Responde ao quiz (biometria + objetivos)
        ↓
Dados guardados no Supabase (PostgreSQL)
        ↓
Chamada à API OpenAI com prompt estruturado com o perfil do utilizador
        ↓
Plano de nutrição e treino gerado e persistido
        ↓
Dashboard interativo com tracking de progresso
```

---

## Funcionalidades

- **Plano de Nutrição IA** — geração de planos alimentares 
  personalizados com base em objetivos, peso, altura e preferências
- **Plano de Treino IA** — rotinas de exercício adaptadas ao perfil
- **Smart Food Scanner** — identificação de alimentos por fotografia 
  com estimativa de calorias e macros (Computer Vision)
- **Workout Tracker** — registo de treinos e histórico de progresso
- **Dashboard Interativo** — evolução de peso, calorias e performance
- **Autenticação e Perfil** — gestão de conta com persistência de 
  dados em tempo real (Supabase Auth)

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Estilização | Tailwind CSS + Shadcn/ui |
| Backend & DB | Supabase (PostgreSQL + Auth + Storage) |
| IA | OpenAI API (GPT-4o mini + Vision) |
| Deploy | Lovable + domínio IONOS (nutrione.app) |

---

## Decisões Técnicas

**Supabase em vez de backend custom** — para um MVP com um 
developer, o Supabase permitiu ter autenticação, base de dados 
relacional e storage sem gerir infraestrutura. Em produção com 
escala maior, migraria para um backend dedicado em Node.js.

**Prompt Engineering estruturado** — os prompts enviados à API 
OpenAI incluem o perfil completo do utilizador em formato JSON 
estruturado, garantindo consistência e personalização real dos planos.

**TypeScript em todo o projeto** — escolha deliberada para garantir 
type safety nas chamadas à API e nos modelos de dados do Supabase.

---

## Correr Localmente
```bash
git clone https://github.com/FranciscoCarneiro11/NutriOne
cd NutriOne
npm install

# Cria um ficheiro .env com as tuas credenciais (ver .env.example)
npm run dev
```

**Variáveis de ambiente necessárias:**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_OPENAI_API_KEY=
```

---

## Aprendizagens

- Integração de LLMs em produtos reais — gestão de prompts, 
  rate limiting e custos de API
- Produto com utilizadores reais — feedback loop, iteração rápida 
  e decisões de produto sob incerteza
- Arquitetura de uma SPA com estado complexo em TypeScript
