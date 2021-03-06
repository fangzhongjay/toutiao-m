// 用户相关请求模块
import request from '@/utils/request'

export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 发送验证码。注意：每个手机号每分钟1次
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`,
  })
}

// 获取用户信息(该接口需要授权（token）才能访问)
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user',
    // 发送请求头数据，把token 令牌拿过去验证身份
    // headers: {
    //     Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels',
  })
}

// 关注用户
export const addFollow = target => {
  return request({
    method: 'POST',
    url: "/v1_0/user/followings",
    data: {
      target
    }
  })
}

// 取消关注用户
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`,
  })
}

// 获取当前登录用户的个人资料
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile',
  })
}

// 更新用户资料资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

// 更新用户照片资料
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}
