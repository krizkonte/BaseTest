# Proposta de Melhorias para o Sistema de Tipografia

## Problemas Identificados

### 1. **Inconsistência entre Sistemas de Cor**
- `utilities-text-color.css` usa padrão baseado em superfícies (`text-on-surface-*`, `text-on-inverted-*`)
- `utilities-typography.css` usa padrão semântico independente (`text-primary`, `text-secondary`)
- Não há integração clara entre os dois sistemas

### 2. **Duplicação de Conceitos**
- Cores de status definidas em ambos os arquivos com nomenclaturas diferentes
- Sistema de hierarquia de texto duplicado (primary/secondary vs on-surface-primary/secondary)

### 3. **Falta de Contextualização**
- Typography não considera o contexto da superfície onde será aplicado
- Cores semânticas não se adaptam automaticamente ao background

### 4. **Complexidade Desnecessária**
- Muitas classes com funções similares
- Falta de padrão claro para escolha entre sistemas

## Proposta de Reestruturação

### **Fase 1: Unificação dos Sistemas de Cor**

#### Estrutura Proposta:
```css
/* Cores Base - Contextuais */
.text-primary { /* Adapta-se ao contexto */ }
.text-secondary { /* Adapta-se ao contexto */ }
.text-tertiary { /* Adapta-se ao contexto */ }

/* Modificadores de Contexto */
.surface-default { /* Background padrão (light/dark) */ }
.surface-inverted { /* Background invertido */ }
.surface-accent { /* Background colorido */ }
.surface-subtle { /* Background sutil */ }

/* Estados e Status */
.text-danger { /* Adapta-se ao contexto */ }
.text-warning { /* Adapta-se ao contexto */ }
.text-success { /* Adapta-se ao contexto */ }
.text-info { /* Adapta-se ao contexto */ }
```

#### Como Funcionaria:
```html
<!-- Contexto padrão -->
<div class="surface-default">
  <h1 class="heading-1 text-primary">Título</h1>
  <p class="body-lg text-secondary">Descrição</p>
</div>

<!-- Contexto invertido -->
<div class="surface-inverted bg-dark">
  <h1 class="heading-1 text-primary">Título</h1> <!-- Auto-adapta para branco -->
  <p class="body-lg text-secondary">Descrição</p> <!-- Auto-adapta para cinza claro -->
</div>
```

### **Fase 2: Sistema de Tipografia Contextual**

#### Tokens Unificados:
```css
:root {
  /* Superfícies Base */
  --surface-default: light-dark(#ffffff, #0a0a0a);
  --surface-inverted: light-dark(#0a0a0a, #ffffff);
  --surface-accent: var(--brand-600);
  --surface-subtle: light-dark(var(--brand-50), var(--brand-950));
  
  /* Textos Contextuais */
  --text-on-default-primary: light-dark(var(--neutral-900), var(--neutral-100));
  --text-on-default-secondary: light-dark(var(--neutral-700), var(--neutral-300));
  --text-on-default-tertiary: light-dark(var(--neutral-500), var(--neutral-500));
  
  --text-on-inverted-primary: light-dark(var(--neutral-100), var(--neutral-900));
  --text-on-inverted-secondary: light-dark(var(--neutral-300), var(--neutral-700));
  --text-on-inverted-tertiary: light-dark(var(--neutral-500), var(--neutral-500));
  
  --text-on-accent-primary: var(--white);
  --text-on-accent-secondary: oklch(var(--white) / 0.8);
  
  /* Estados Contextuais */
  --text-danger-on-default: var(--danger-700);
  --text-danger-on-inverted: var(--danger-400);
  --text-danger-on-accent: var(--white);
}
```

### **Fase 3: Classes Compostas Inteligentes**

#### Sistema Híbrido:
```css
/* Classes de Tipografia + Contexto Automático */
.heading-1 {
  /* Propriedades tipográficas */
  font-family: var(--font-family-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  
  /* Cor contextual padrão */
  color: var(--text-on-default-primary);
  
  /* Adaptações por contexto */
  .surface-inverted & { color: var(--text-on-inverted-primary); }
  .surface-accent & { color: var(--text-on-accent-primary); }
  .surface-subtle & { color: var(--text-on-subtle-primary); }
}

/* Estados com contexto */
.text-danger {
  color: var(--text-danger-on-default);
  
  .surface-inverted & { color: var(--text-danger-on-inverted); }
  .surface-accent & { color: var(--text-danger-on-accent); }
}
```

### **Fase 4: API Simplificada**

#### Para Desenvolvedores:
```html
<!-- Uso básico - contexto automático -->
<article class="surface-default">
  <h1 class="heading-1">Título</h1>
  <p class="body-lg">Conteúdo</p>
  <span class="text-danger">Erro</span>
</article>

<!-- Contexto específico -->
<section class="surface-inverted bg-dark p-6">
  <h2 class="heading-2">Título Invertido</h2>
  <p class="body-md">Texto adaptado automaticamente</p>
</section>

<!-- Override manual quando necessário -->
<div class="surface-accent">
  <p class="body-lg text-on-accent-secondary">Texto específico</p>
</div>
```

## Benefícios da Proposta

### **1. Simplicidade**
- Uma única API para tipografia + cor
- Menos decisões para o desenvolvedor
- Menos classes para memorizar

### **2. Consistência**
- Cores sempre apropriadas para o contexto
- Reduz erros de contraste
- Mantém hierarquia visual

### **3. Manutenibilidade**
- Tokens centralizados
- Fácil ajuste de temas
- Menos duplicação de código

### **4. Acessibilidade**
- Contraste automático
- Suporte nativo a high-contrast
- Temas dark/light integrados

### **5. Performance**
- Menor CSS final
- Menos especificidade
- Melhor tree-shaking

## Implementação Gradual

### **Etapa 1: Criar Tokens Unificados**
- Definir variáveis CSS contextuais
- Mapear cores existentes para nova estrutura

### **Etapa 2: Migrar Classes Base**
- Atualizar heading-* e body-* para usar contexto
- Manter classes antigas para compatibilidade

### **Etapa 3: Introduzir Surface Modifiers**
- Criar classes .surface-*
- Documentar padrões de uso

### **Etapa 4: Deprecar Sistema Antigo**
- Marcar classes antigas como deprecated
- Fornecer guia de migração

### **Etapa 5: Cleanup Final**
- Remover código duplicado
- Otimizar performance

## Exemplo de Migração

### **Antes:**
```html
<div class="bg-dark">
  <h1 class="heading-1 text-on-inverted-primary">Título</h1>
  <p class="body-lg text-on-inverted-secondary">Texto</p>
  <span class="text-on-inverted-danger">Erro</span>
</div>
```

### **Depois:**
```html
<div class="surface-inverted bg-dark">
  <h1 class="heading-1">Título</h1>
  <p class="body-lg text-secondary">Texto</p>
  <span class="text-danger">Erro</span>
</div>
```

## Conclusão

Esta proposta mantém a flexibilidade do sistema atual enquanto simplifica drasticamente a experiência do desenvolvedor. O contexto automático reduz erros e aumenta a consistência, enquanto as opções de override mantêm a flexibilidade necessária para casos especiais.

A migração pode ser feita gradualmente, mantendo compatibilidade com o código existente durante a transição.