import { supabase } from '../config/supabase'

const EXTENSOES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const MARCADOR_BUCKET = '/produtos-fotos/'

export async function listarProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select(
      'id, nome, descricao, categoria, preco, preco_promocional, estoque, ativo, imagens'
    )
    .order('criado_em', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw error
  return data
}

export async function criarProduto(dados) {
  const { error } = await supabase.from('produtos').insert(dados)
  if (error) throw error
}

export async function atualizarProduto(id, dados) {
  const { data, error } = await supabase
    .from('produtos')
    .update(dados)
    .eq('id', id)
    .select('id')

  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('Nenhum produto foi atualizado.')
  }
}

export async function excluirProduto(produto) {
  const { data, error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', produto.id)
    .select('id')

  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('Nenhum produto foi excluído.')
  }

  const caminhos = (produto.imagens ?? [])
    .filter((url) => url.includes(MARCADOR_BUCKET))
    .map((url) => decodeURIComponent(url.split(MARCADOR_BUCKET)[1].split('?')[0]))

  if (caminhos.length > 0) {
    await supabase.storage.from('produtos-fotos').remove(caminhos)
  }
}

export async function enviarFoto(arquivo) {
  const extensao = EXTENSOES[arquivo.type]
  if (!extensao) throw new Error('Formato de imagem não permitido.')

  const caminho = `${crypto.randomUUID()}.${extensao}`

  const { error } = await supabase.storage
    .from('produtos-fotos')
    .upload(caminho, arquivo, {
      contentType: arquivo.type,
      cacheControl: '31536000',
    })

  if (error) throw error

  const { data } = supabase.storage.from('produtos-fotos').getPublicUrl(caminho)
  return data.publicUrl
}