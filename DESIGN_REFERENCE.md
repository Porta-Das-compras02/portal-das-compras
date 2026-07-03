# Portal das Compras - Design Reference

## Análise Visual do Site Original

### Paleta de Cores
- **Cor Primária**: Verde vibrante (#22C55E ou similar)
- **Fundo**: Branco/Off-white
- **Texto Principal**: Preto/Cinza escuro
- **Bordas/Divisores**: Verde claro em padrão tracejado

### Tipografia
- **Headlines**: Fonte bold, sans-serif
- **Corpo**: Fonte regular, sans-serif
- **Tamanho do Heading Principal**: Grande e destacado

### Estrutura do Layout

#### Cabeçalho
- Logo "Portal das Compras" com ícone à esquerda
- Menu: Início, Categorias, Admin, Carrinho
- Carrinho com ícone de sacola e contador de itens (com badge verde)
- Fundo branco com bordas tracejadas em verde

#### Hero Section
- Headline: "Achados que valem a pena, direto no seu endereço."
- Subtítulo: "Eletrônicos, moda, casa, esportes e beleza — curadoria com preços honestos."
- Campo de busca com placeholder "Buscar produtos..."
- Borda tracejada em verde ao redor do input

#### Filtros de Categoria
- Botões horizontais: Todos, Beleza, Casa, Eletrônicos, Esportes, Moda, Outros
- "Todos" em vermelho/destaque
- Outros em verde
- Separadores com "......" entre categorias

#### Grid de Produtos
- Layout responsivo (4 colunas em desktop)
- Cards com borda tracejada em verde
- Estrutura do card:
  - Imagem do produto (Unsplash)
  - Nome do produto
  - Preço com desconto em verde (maior)
  - Preço original riscado em vermelho/cinza
  - "Economize R$ X" em verde

#### Rodapé
- Texto: "© 2026 Portal das Compras · Curadoria de achados imperdíveis"
- "Envio para todo o Brasil · Pagamento seguro"
- Fundo branco/cinza claro

### Produtos (33 itens)
Lista completa com preços e descontos extraída do site original.

## Funcionalidades a Implementar

1. **Carrinho de Compras**: Contador de itens, adicionar/remover produtos
2. **Checkout**: Formulário com Nome, Endereço, CEP, WhatsApp
3. **Pagamento**: PIX (QR Code) e Cartão (simulação)
4. **Confirmação**: Número de pedido aleatório
