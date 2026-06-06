#!/bin/bash
# Script para validar chaves de tradução

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Procurando por strings em português hardcoded..."
echo ""

# Procura por padrões comuns de strings em português em arquivos React
patterns=(
  "✦ SIGNIFICADO"
  "Glossario dos"
  "Ritual"
  "Mapa"
  "horário"
  "data"
  "local"
  "Gerando"
  "Nome"
  "Signo"
  "Arcano"
  "Usuário"
)

files=(
  "app/(tabs)/glossario.tsx"
  "app/(tabs)/rituais.tsx"
  "app/(tabs)/mapa-astral.tsx"
)

found_hardcoded=false

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📄 Verificando: $file"
    for pattern in "${patterns[@]}"; do
      if grep -q "$pattern" "$file"; then
        echo -e "  ${RED}✗ Encontrado: '$pattern'${NC}"
        found_hardcoded=true
      fi
    done
  fi
done

echo ""
if [ "$found_hardcoded" = false ]; then
  echo -e "${GREEN}✅ Nenhum texto hardcoded encontrado!${NC}"
else
  echo -e "${YELLOW}⚠️ Alguns textos hardcoded foram encontrados. Considere traduzi-los.${NC}"
fi
