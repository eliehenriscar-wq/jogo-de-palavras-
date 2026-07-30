# jogo-de-palavras-# 🔤 Caça-Palavras – 50 Níveis

Jogo de caça-palavras (word search) completo para computador.

**Idiomas das palavras:** Português + Français  
**Total de níveis:** 50  
**Palavras por nível:** mínimo 20 (até 28 nos níveis avançados)

---

## 📁 Arquivos

| Arquivo       | Função                          |
|---------------|---------------------------------|
| `index.html`  | Estrutura da página             |
| `style.css`   | Estilo full-screen moderno      |
| `script.js`   | Lógica do jogo + gerador        |
| `readme.md`   | Este arquivo                    |

---

## 🚀 Como jogar (local)

1. Baixe os 4 arquivos
2. Coloque todos na mesma pasta
3. Abra o arquivo `index.html` no navegador (Chrome, Firefox, Edge...)

Ou use um servidor local:

```bash
# Com Python
python -m http.server 8000

# Depois abra: http://localhost:8000
```

---

## ✨ Funcionalidades

- ✅ Tela cheia no computador
- ✅ 50 níveis progressivos
- ✅ Mínimo 20 palavras por nível (PT + FR)
- ✅ Seleção com mouse (arrastar)
- ✅ Sons (clique, palavra encontrada, nível completo)
- ✅ Botão de som no rodapé (ligar/desligar)
- ✅ Dica (💡) – mostra o início de uma palavra
- ✅ Reiniciar nível
- ✅ Navegação entre níveis
- ✅ Lista de palavras na lateral
- ✅ Barra de progresso
- ✅ Overlay de parabéns ao terminar o nível

---

## 🎮 Controles

| Ação                    | Como fazer                  |
|-------------------------|-----------------------------|
| Selecionar palavra      | Clique e arraste com o mouse |
| Ativar/desativar som    | Botão 🔊 no rodapé          |
| Pedir dica              | Botão 💡                    |
| Reiniciar nível         | Botão ↻                     |
| Próximo nível           | Botão ▶ (quando terminar)   |

---

## 📦 Publicar no GitHub

```bash
git init
git add index.html style.css script.js readme.md
git commit -m "Caça-Palavras 50 níveis - PT/FR"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/caca-palavras.git
git push -u origin main
```

Depois ative o **GitHub Pages** nas configurações do repositório para jogar online.

---

## 🛠️ Personalização rápida

No arquivo `script.js` você pode:

- Aumentar/diminuir o número de níveis (`TOTAL_LEVELS`)
- Adicionar mais palavras no array `WORD_POOL`
- Mudar a dificuldade (tamanho da grade e quantidade de palavras)

---

Feito com ❤️ para quem gosta de jogos de palavras.  
Bom jogo! 🎯
