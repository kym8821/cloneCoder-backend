import File from './File'

export default interface Folder{
  id:Number,
  user_id:String,
  parent_id:Number|undefined,
  title:String
  file:File[] | undefined
}
