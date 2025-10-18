# 🪝 Git Hooks - Sistema de Versionamento Automático

## 📁 Estrutura

```
hooks/                          ← Versionado no Git
├── pre-commit                  ← Sincroniza versão
└── prepare-commit-msg          ← Versionamento automático

.git/hooks/                     ← NÃO versionado (local)
├── pre-commit                  ← Cópia instalada
└── prepare-commit-msg          ← Cópia instalada

scripts/
└── install-hooks.sh            ← Script de instalação
```

## 🚀 Instalação

### Automática (após npm install)
```bash
npm install
# Executa automaticamente: npm run install:hooks
```

### Manual
```bash
npm run install:hooks
```

### Primeira vez (após clonar repo)
```bash
git clone <repo>
cd hinarioEvangelico
npm install  # Instala dependências + hooks automaticamente
```

## 🔧 O Que Cada Hook Faz

### 1. `pre-commit`
**Quando:** Antes de finalizar o commit
**Função:** Sincroniza versão entre arquivos e verifica trailing spaces

```bash
git commit -m "Alguma mudança"
# 🔄 Verificando sincronização de versão...
# ✅ Sincronização de versão OK!
# 🧹 Verificando trailing spaces...
# ✅ Nenhum trailing space encontrado!
```

**Validações:**
- ✅ `package.json` versão correta
- ✅ `nuxt.config.ts` start_url sem query string
- ✅ `SettingsMenu.vue` importa versão dinamicamente
- ✅ Nenhum trailing space nos arquivos staged

### 2. `prepare-commit-msg`
**Quando:** Após escrever mensagem do commit
**Função:** Atualiza versão baseado em tags

```bash
git commit -m "[FIX] Corrigido bug"
# 🔄 Verificando versionamento automático...
# 📦 Versionamento Automático
#    Tipo: PATCH
#    1.4.0 → 1.4.1
# ✅ package.json atualizado
```

**Tags suportadas:**
- `[FIX]` → patch (1.4.0 → 1.4.**1**)
- `[FEAT]` → minor (1.4.0 → 1.**5**.0)
- `[MAJOR]` → major (1.4.0 → **2**.0.0)

## 🔄 Workflow de Atualização dos Hooks

### Se você modificar um hook:

```bash
# 1. Editar o hook versionado
vim hooks/pre-commit

# 2. Reinstalar
npm run install:hooks

# 3. Commit
git add hooks/
git commit -m "[FIX] Atualizado hook pre-commit"
```

### Outros desenvolvedores receberão:

```bash
git pull
npm run install:hooks  # Atualiza hooks locais
```

## ❓ Por Que Hooks Não Ficam em `.git/hooks/` Diretamente?

### 🚫 Problemas de versionar `.git/`:
1. **Git ignora `.git/` automaticamente** (é a pasta de metadados)
2. **Segurança**: Hooks executam código - risco se malicioso
3. **Permissões**: Cada máquina precisa de `chmod +x`
4. **Conflitos**: Cada clone tem seu próprio `.git/`

### ✅ Solução: `hooks/` + script de instalação
1. **Versionado**: `hooks/` é rastreado pelo Git
2. **Seguro**: Desenvolvedor escolhe instalar
3. **Automático**: `postinstall` instala após `npm install`
4. **Flexível**: Pode desabilitar com `--no-verify`

## 🛠️ Comandos Úteis

### Verificar hooks instalados
```bash
ls -lh .git/hooks/
```

### Desabilitar temporariamente
```bash
git commit --no-verify -m "Sem hooks"
```

### Reinstalar hooks
```bash
npm run install:hooks
```

### Remover hooks
```bash
rm .git/hooks/pre-commit .git/hooks/prepare-commit-msg
```

## 📋 Checklist para Novos Desenvolvedores

```bash
# 1. Clonar repositório
git clone https://github.com/gabrielsuriano/hinarioEvangelico.git
cd hinarioEvangelico

# 2. Instalar dependências (hooks instalados automaticamente)
npm install

# 3. Verificar instalação
ls -lh .git/hooks/pre-commit .git/hooks/prepare-commit-msg
# Devem existir e serem executáveis (-rwxr-xr-x)

# 4. Testar
git commit -m "[FIX] Teste" --allow-empty
# Deve mostrar versionamento automático

# 5. Pronto! 🎉
```

## 🔍 Troubleshooting

### Hooks não executam
```bash
# Verificar se existem
ls .git/hooks/pre-commit

# Verificar permissões
ls -l .git/hooks/pre-commit
# Deve ser -rwxr-xr-x (executável)

# Reinstalar
npm run install:hooks
```

### "Permission denied"
```bash
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/prepare-commit-msg
```

### Hooks não atualizam após pull
```bash
git pull
npm run install:hooks  # Sempre após pull!
```

---

**🎯 Resumo**: Hooks ficam em `hooks/` (versionados) e são copiados para `.git/hooks/` (local) via `install-hooks.sh`
