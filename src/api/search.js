// 搜索请求模块
import request from '@/utils/request'

// 请求获取文章列表数据
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: "/v1_0/suggestion",
    params: {
      q
    }
  })
}

// 请求获取搜索结果数据
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: "/v1_0/search",
    params
  })
}
