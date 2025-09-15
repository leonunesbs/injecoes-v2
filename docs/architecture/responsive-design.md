# Responsive Design & Interface

Documentação sobre o design responsivo e otimizações de interface do Sistema de Injeções.

## 📱 Visão Geral

O sistema foi projetado com foco em responsividade, garantindo uma experiência otimizada em todos os dispositivos, desde smartphones até desktops.

## 🎯 Breakpoints Utilizados

### Tailwind CSS Breakpoints

- **Mobile**: `< 640px` - Layout vertical, elementos compactos
- **SM**: `640px+` - Layout híbrido com elementos maiores
- **MD**: `768px+` - Layout de 2 colunas em formulários
- **LG**: `1024px+` - Layout desktop completo
- **XL**: `1280px+` - Layout desktop expandido

### Estratégia de Design

- **Mobile First**: Desenvolvimento iniciado com foco em dispositivos móveis
- **Progressive Enhancement**: Melhorias incrementais para telas maiores
- **Touch-Friendly**: Elementos otimizados para interação por toque

## 🏗️ Componentes Responsivos

### Layout de Prescrições

**Arquivo**: `src/app/(withAuth)/prescriptions/layout.tsx`

#### Características Responsivas

- **Header Flexível**:
  - Mobile: Layout vertical (`flex-col`)
  - Desktop: Layout horizontal (`sm:flex-row`)
- **Botões Adaptativos**:
  - Mobile: Largura total (`w-full`)
  - Desktop: Largura automática (`sm:w-auto`)
- **Títulos Escaláveis**:
  - Mobile: `text-2xl`
  - Desktop: `text-3xl`

#### Código de Exemplo

```tsx
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
    {/* Conteúdo do header */}
  </div>
  <Link href="/prescriptions/new" className="w-full sm:w-auto">
    <Button className="w-full sm:w-auto">
      <Plus className="mr-2 h-4 w-4" />
      <span className="hidden sm:inline">Nova Prescrição</span>
      <span className="sm:hidden">Nova</span>
    </Button>
  </Link>
</div>
```

### Layout de Landing

**Arquivo**: `src/app/(landing)/layout.tsx`

#### Características Responsivas

- **Header Compacto**:
  - Mobile: `h-14`
  - SM: `h-16`
  - LG: `h-18`

- **Logo Escalável**:
  - Mobile: `h-8 w-8`
  - SM: `h-10 w-10`
  - LG: `h-12 w-12`

- **Navegação Adaptativa**:
  - Mobile: Menu hambúrguer
  - Desktop: Navegação horizontal

#### Código de Exemplo

```tsx
<div className="flex h-14 items-center justify-between sm:h-16 lg:h-18">
  <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg shadow-lg sm:h-10 sm:w-10 sm:rounded-xl lg:h-12 lg:w-12">
      <Syringe className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7" />
    </div>
    {/* Título e descrição */}
  </div>
</div>
```

### Formulário de Prescrição

**Arquivo**: `src/components/forms/PatientIndicationForm.tsx`

#### Características Responsivas

- **Grid Adaptativo**:
  - Mobile: 1 coluna (`grid-cols-1`)
  - Desktop: 2 colunas (`md:grid-cols-2`)

- **Botões Compactos**:
  - Mobile: `h-9 min-w-[70px] text-xs`
  - Desktop: `sm:h-10 sm:min-w-[80px] sm:text-sm`

- **Espaçamento Otimizado**:
  - Mobile: `space-y-4 gap-4`
  - Desktop: `sm:space-y-6 sm:gap-6`

#### Código de Exemplo

```tsx
<form className="space-y-4 sm:space-y-6">
  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
    {/* Campos do formulário */}
  </div>

  <div className="flex flex-wrap gap-2">
    {options.map((option) => (
      <Button
        key={option.id}
        className="h-9 min-w-[70px] text-xs sm:h-10 sm:min-w-[80px] sm:text-sm"
      >
        {option.label}
      </Button>
    ))}
  </div>
</form>
```

## 📊 Tabelas Responsivas

### PrescriptionsList

**Arquivo**: `src/components/forms/PrescriptionsList.tsx`

#### Características Responsivas

- **Toolbar Adaptativo**:
  - Mobile: Layout vertical (`flex-col`)
  - Desktop: Layout horizontal (`lg:flex-row`)

- **Botões de Ação**:
  - Mobile: Texto abreviado (`CSV`, `PDF`)
  - Desktop: Texto completo (`Download CSV`, `Gerar PDF`)

- **Paginação Inteligente**:
  - Mobile: Botões essenciais
  - Desktop: Controles completos

#### Código de Exemplo

```tsx
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
    <Input className="w-full pl-10 sm:w-80" />
    <Select className="w-full sm:w-48">{/* Opções */}</Select>
  </div>

  <div className="flex items-center gap-2 sm:gap-4">
    <Button className="h-9 px-3">
      <Download className="mr-2 h-4 w-4" />
      <span className="hidden sm:inline">Download CSV</span>
      <span className="sm:hidden">CSV</span>
    </Button>
  </div>
</div>
```

## 🎨 Padrões de Design

### Espaçamento Consistente

```css
/* Mobile First */
.space-y-4 sm:space-y-6
.gap-4 sm:gap-6
.p-3 sm:p-4 lg:p-6
```

### Tipografia Escalável

```css
/* Títulos */
.text-2xl sm:text-3xl
.text-base sm:text-lg lg:text-xl

/* Corpo do texto */
.text-sm sm:text-base
.text-xs sm:text-sm
```

### Botões Adaptativos

```css
/* Altura */
.h-9 sm:h-10 lg:h-11

/* Largura */
.w-full sm:w-auto
.min-w-[70px] sm:min-w-[80px]

/* Texto */
.text-xs sm:text-sm
```

## 📱 Otimizações Mobile

### Touch Targets

- **Tamanho mínimo**: 44px (recomendação Apple/Google)
- **Espaçamento**: Mínimo 8px entre elementos
- **Área de toque**: Generosa para facilitar interação

### Performance

- **Lazy Loading**: Componentes carregados sob demanda
- **Otimização de Imagens**: Formatos adequados para cada dispositivo
- **Bundle Splitting**: Código dividido por rotas

### Acessibilidade

- **Contraste**: Mínimo 4.5:1 para texto normal
- **Foco**: Indicadores visuais claros
- **Navegação**: Suporte a teclado completo

## 🔧 Ferramentas e Configuração

### Tailwind CSS

```css
/* Configuração no globals.css */
@theme {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}
```

### Breakpoints Customizados

```css
/* Breakpoints padrão do Tailwind */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## 📈 Métricas de Performance

### Core Web Vitals

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Mobile Performance

- **First Paint**: < 1.5s
- **Interactive**: < 3.5s
- **Bundle Size**: < 250KB (gzipped)

## 🚀 Próximas Melhorias

### Planejadas

- [ ] PWA (Progressive Web App)
- [ ] Offline Support
- [ ] Push Notifications
- [ ] Gestos de navegação

### Em Consideração

- [ ] Dark Mode
- [ ] Tema personalizável
- [ ] Modo de alta contraste
- [ ] Suporte a leitores de tela

## 📚 Recursos Adicionais

### Documentação

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

### Ferramentas

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

---

**Última atualização**: Dezembro 2024  
**Versão**: 2.0.0  
**Responsável**: Equipe de Desenvolvimento
