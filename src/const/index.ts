const restrictiveActivities = [
  {
    Code: 5320202,
    Description: 'SERVIÇOS DE ENTREGA RÁPIDA'
  },
  {
    Code: 8011101,
    Description: 'ATIVIDADES DE VIGILÂNCIA E SEGURANÇA PRIVADA'
  }
]

export enum ineligibleReasons {
  Active = 'Active',
  Commercial = 'Commercial',
  Financial = 'Financial',
  AgeLessThan3Months = 'AgeLessThan3Months',
  AgeBetween3And6Months = 'AgeBetween3And6Months'
}

export enum companySizeTypes {
  ME = 'ME',
  EPP = 'EPP',
  EMP = 'EMP',
  EGP = 'EGP',
  DEMAIS = 'DEMAIS'
}

const legalNatures = {
  2062: {
    Code: '2062',
    Description: 'Sociedade Empresária Limitada'
  },
  2135: {
    Code: '2135',
    Description: 'Empresário (Individual)'
  },
  2313: {
    Code: '2313',
    Description: 'Empresa Individual de Responsabilidade Limitada (de Natureza Simples)'
  },
  2305: {
    Code: '2305',
    Description: 'Empresa Individual de Responsabilidade Limitada (de Natureza Empresária)'
  },
  2240: {
    Code: '2240',
    Description: 'Sociedade Simples Limitada'
  },
  2259: {
    Code: '2259',
    Description: 'Sociedade Simples em Nome Coletivo'
  },
  2046: {
    Code: '2046',
    Description: 'Sociedade Anônima Aberta'
  },
  2054: {
    Code: '2054',
    Description: 'Sociedade Anônima Fechada'
  },
  2267: {
    Code: '2267',
    Description: 'Sociedade Simples em Comandita Simples'
  },
  2070: {
    Code: '2070',
    description: 'Sociedade Empresária em Nome Coletivo'
  },
  2089: {
    Code: '2089',
    Description: 'Sociedade Empresária em Comandita Simples'
  }
}

export {restrictiveActivities, legalNatures}
