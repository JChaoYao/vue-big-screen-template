import http from '@/axios/index'

//查询
export const getSelectApi = ()=>{
  return http.get("/api/xxxxxx")
}
//新增
export const addApi = (params: any) => {
  return http.post("/api/xxxxxx",params)
}
//编辑
export const editApi = (params: any)=>{
  return http.put("/api/xxxxxx",params)
}
//删除
export const deleteApi = (xxx :string)=>{
  return http.delete(`/api/xxxxxx/${xxx}`)
}