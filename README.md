# Gerador XML Integrador

Projeto desktop desenvolvido em **Electron.js** para geração automatizada de arquivos XML contendo dados de agentes (pessoa física, jurídica ou outros), integrando múltiplas APIs e recursos auxiliares.

## 🧩 Funcionalidades

- Geração automática de nomes de pessoas físicas e jurídicas.
- Geração de CPF e CNPJ válidos (sem pontuação).
- Geração de XML com os seguintes dados:
  - Nome e Nome Fantasia
  - Tipo de pessoa (F - Física, J - Jurídica, R - Representante)
  - E-mail baseado no nome
  - UF (selecionável)
  - Código do município via API IBGE
  - Dados de endereço via API ViaCEP
  - Código interno do município via arquivo local `codigo.csv`
  - Seletor obrigatório de tipo de agente (`<AGN_TAU_ST_CODIGO>`)
  - Campos fiscais (`<Fiscal OPERACAO="I">`) com checkboxes convertidos para "S" ou "N"

## 🛠️ Tecnologias

- [Electron](https://www.electronjs.org/) (desktop app)
- HTML5 / CSS3 / JavaScript
- APIs externas:
  - [IBGE - Municípios](https://servicodados.ibge.gov.br/api/docs)
  - [ViaCEP](https://viacep.com.br/)
- Arquivo CSV local para mapeamento de códigos

## 📁 Estrutura de Pastas

- Seleção de tipo de pessoa (Física, Jurídica, Rural)
- Seleção de Estado (UF)
- Entrada manual do Município
- Geração de XML formatado
- Botão para copiar XML gerado

## 🖥️ Tecnologias Utilizadas

- [Electron](https://www.electronjs.org/)
- HTML5 / CSS3 / JavaScript
- APIs do IBGE (futuramente integradas)
  
## 📁 Estrutura do Projeto

⚠️ É necessário ter o Node.js e o npm instalados.
