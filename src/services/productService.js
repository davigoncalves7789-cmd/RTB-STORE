import { supabase } from '../config/supabase'

const COLUNAS =
  'id, nome, descricao, preco, preco_promocional, categoria, estoque, avaliacao_media, total_avaliacoes, imagens'

function paraProduto(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    descricao: linha.descricao,
    preco: Number(linha.preco),
    precoPromocional:
      linha.preco_promocional == null ? null : Number(linha.preco_promocional),
    categoria: linha.categoria,
    estoque: linha.estoque,
    avaliacaoMedia: Number(linha.avaliacao_media),
    totalAvaliacoes: linha.total_avaliacoes,
    imagens: linha.imagens ?? [],
  }
}

const escaparBusca = (texto) => texto.replace(/[\\%_]/g, '\\$&')

export async function getAll({ categoria, busca } = {}) {
  let consulta = supabase
    .from('produtos')
    .select(COLUNAS)
    .eq('ativo', true)
    .order('criado_em', { ascending: true })
    .order('id', { ascending: true })

  if (categoria) {
    consulta = consulta.eq('categoria', categoria)
  }

  if (busca) {
    consulta = consulta.ilike('nome', `%${escaparBusca(busca)}%`)
  }

  const { data, error } = await consulta
  if (error) throw error

  return data.map(paraProduto)
}

export async function getById(id) {
  const { data, error } = await supabase
    .from('produtos')
    .select(COLUNAS)
    .eq('id', id)
    .eq('ativo', true)
    .maybeSingle()

  if (error) throw error

  return data ? paraProduto(data) : null
}