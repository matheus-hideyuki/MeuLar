import { AMOSTRAS_IMOVEIS } from '../lib/imoveis';

// Mock de Usuário Autenticado
const MOCK_USER = {
  id: 'usr_1',
  name: 'Matheus Kawano',
  email: 'matheus.kawano@siscobra.com.br',
  role: 'user'
};

// Cliente de API Local (100% autônomo sem dependências externas)
export const base44 = {
  auth: {
    async me() {
      return MOCK_USER;
    },
    async login() {
      return MOCK_USER;
    },
    async logout() {
      return true;
    },
    async redirectToLogin() {
      return true;
    }
  },
  entities: {
    Imovel: {
      async findMany(params = {}) {
        let resultado = [...AMOSTRAS_IMOVEIS];

        if (params.where?.cidade && params.where.cidade !== 'Todas') {
          resultado = resultado.filter(
            i => i.cidade.toLowerCase() === params.where.cidade.toLowerCase()
          );
        }

        if (params.where?.tipoNegocio && params.where.tipoNegocio !== 'Todos') {
          resultado = resultado.filter(
            i => i.tipoNegocio.toLowerCase() === params.where.tipoNegocio.toLowerCase()
          );
        }

        return resultado;
      },
      async findUnique({ where }) {
        const imovel = AMOSTRAS_IMOVEIS.find(i => String(i.id) === String(where.id));
        return imovel || AMOSTRAS_IMOVEIS[0];
      },
      async create(data) {
        return { id: String(Date.now()), ...data };
      }
    },
    Avaliacao: {
      async findMany() {
        return [];
      },
      async create(data) {
        return { id: String(Date.now()), ...data };
      }
    }
  }
};

// Exportação compatível com chamadas diretas api.getImoveis
export const api = {
  async getImoveis(params = {}) {
    let resultado = [...AMOSTRAS_IMOVEIS];

    if (params.cidade && params.cidade !== 'Todas') {
      resultado = resultado.filter(
        i => i.cidade.toLowerCase() === params.cidade.toLowerCase()
      );
    }

    if (params.tipoNegocio && params.tipoNegocio !== 'Todos') {
      resultado = resultado.filter(
        i => i.tipoNegocio.toLowerCase() === params.tipoNegocio.toLowerCase()
      );
    }

    if (params.busca) {
      const termo = params.busca.toLowerCase();
      resultado = resultado.filter(
        i =>
          i.titulo.toLowerCase().includes(termo) ||
          i.bairro.toLowerCase().includes(termo) ||
          i.cidade.toLowerCase().includes(termo)
      );
    }

    return resultado;
  },

  async getImovelById(id) {
    const imovel = AMOSTRAS_IMOVEIS.find(i => String(i.id) === String(id));
    return imovel || AMOSTRAS_IMOVEIS[0];
  }
};

export default base44;